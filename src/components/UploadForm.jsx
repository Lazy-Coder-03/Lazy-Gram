import React, { useState } from 'react';
import { storage } from '../firebase/config';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
      setError(null); // Clear any previous error
    } else {
      setSelectedFile(null);
      setError('Invalid file type. Please select a PNG, JPEG, JPG, or BMP file.');
    }
  };


  // ... (previous imports)

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        setUploading(true);
        const uid = auth.currentUser.uid;

        // Upload the selected file to Firebase Storage
        const storageRef = ref(storage, `uploaded_images/${uid}/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        console.log('File uploaded. Download URL:', downloadURL);

        // Update Firestore collection for user's uploads
        const userUploadsRef = doc(firestore, 'user_uploads', uid);
        const userUploadsDoc = await getDoc(userUploadsRef);

        if (userUploadsDoc.exists()) {
          const existingImageUrls = userUploadsDoc.data().imageUrls || [];
          const updatedImageUrls = [...existingImageUrls, downloadURL];

          // Use arrayUnion to add the new timestamp without duplicates
          const uploadedOnArray = arrayUnion(new Date().toISOString());

          await updateDoc(userUploadsRef, {
            imageUrls: updatedImageUrls,
            uploadedOn: uploadedOnArray,
          });
        } else {
          await setDoc(userUploadsRef, {
            imageUrls: [downloadURL],
            uploadedOn: [new Date().toISOString()],
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };



  return (
    <div className="text-center mt-10">
      <form className="flex items-center flex-col gap-4">
        <input type="file" onChange={handleChange} className="file-input file-input-bordered w-full max-w-xs" />

        {/* Display selected image */}
        {selectedFile && (
          <div>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              className="max-w-xs max-h-48 object-cover mt-2 border border-gray-300 rounded-md shadow-md"
            />
            {uploading && <p>Uploading...</p>}
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button onClick={handleUpload} className="btn btn-primary gap-3" disabled={uploading || !selectedFile}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
