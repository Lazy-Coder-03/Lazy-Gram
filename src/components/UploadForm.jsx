import { useState } from 'react';
import { storage } from '../firebase/config';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Invalid file type. Please select a PNG, JPEG, JPG, or BMP file.');
    }
  };

  const handleUpload = async () => {
    if (selectedFile && caption.trim() !== '') {
      try {
        setUploading(true);
        const uid = auth.currentUser.uid;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = URL.createObjectURL(selectedFile);

        await new Promise(resolve => (image.onload = resolve));

        const maxDimension = Math.max(image.width, image.height);
        canvas.width = maxDimension;
        canvas.height = maxDimension;

        const x = (canvas.width - image.width) / 2;
        const y = (canvas.height - image.height) / 2;

        ctx.drawImage(image, x, y);

        canvas.toBlob(async (blob) => {
          const storageRef = ref(storage, `uploaded_images/${uid}/${selectedFile.name}`);
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

          console.log('File uploaded. Download URL:', downloadURL);

          const userUploadsRef = doc(firestore, 'user_uploads', uid);
          const userUploadsDoc = await getDoc(userUploadsRef);

          if (userUploadsDoc.exists()) {
            const existingImageUrls = userUploadsDoc.data().imageUrls || [];
            const updatedImageUrls = [...existingImageUrls, downloadURL];

            const uploadedOnArray = arrayUnion(new Date().toISOString());

            const existingCaptions = userUploadsDoc.data().captions || [];
            const updatedCaptions = [...existingCaptions, caption];

            await updateDoc(userUploadsRef, {
              imageUrls: updatedImageUrls,
              uploadedOn: uploadedOnArray,
              captions: updatedCaptions,
            });
          } else {
            await setDoc(userUploadsRef, {
              imageUrls: [downloadURL],
              uploadedOn: [new Date().toISOString()],
              captions: [caption],
            });
          }

          URL.revokeObjectURL(image.src);
          navigate('/');
          setUploading(false);
        }, selectedFile.type);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
        setUploading(false);
      }
    } else {
      setError('Please select a valid image file and enter a caption.');
    }
  };



  return (
    <div className="container mx-auto max-w-lg mt-10 p-6 bg-white rounded-md shadow-md">
      <form className="flex flex-col gap-4">
        <input type="file" className="file-input file-input-bordered w-full max-w-lg" onChange={handleChange}/>

        {selectedFile && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              className="max-w-full h-auto border border-gray-300 rounded-md shadow-md"
            />
            {uploading && <p className="mt-2 text-blue-500">Uploading...</p>}
          </div>
        )}

        <label className="text-gray-700">Caption:</label>
        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-lg" value={caption} onChange={handleCaptionChange} />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleUpload}
          className="btn btn-outline btn-primary max-w-lg"
          disabled={uploading || !selectedFile || caption.trim() === ''}
        >
          Upload
        </button>
        <span className="text-purple-700">Recommended Aspect Ratio is 1:1</span>
      </form>
    </div>
  );
}

export default UploadForm;
