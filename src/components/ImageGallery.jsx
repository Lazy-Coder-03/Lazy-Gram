import { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase/config';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  deleteDoc,setDoc,
  
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ImageGallery = ({ page }) => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteImageUrl, setDeleteImageUrl] = useState('');
  const navigate = useNavigate();

  const getUsername = async (uid) => {
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    return userDoc.exists() ? userDoc.data().username : 'Unknown User';
  };

  const handleDeleteImage = (imageUrl) => {
    setDeleteImageUrl(imageUrl);
    document.getElementById('my_modal_5').showModal();
  };

  const confirmDelete = async () => {
    try {
      // Delete image from storage
      const imageRef = ref(storage, deleteImageUrl);
      await deleteObject(imageRef);

      // Delete image URL from Firestore user uploads collection
      const uid = auth.currentUser.uid;
      const userUploadsRef = doc(firestore, 'user_uploads', uid);

      // Get the current data
      const userUploadsDoc = await getDoc(userUploadsRef);
      if (userUploadsDoc.exists()) {
        const userImages = userUploadsDoc.data().imageUrls || [];
        const uploadedOnArray = userUploadsDoc.data().uploadedOn || [];

        // Find the index of the image URL
        const indexToDelete = userImages.indexOf(deleteImageUrl);

        if (indexToDelete !== -1) {
          // Delete the image URL and uploadedOn value
          const updatedImageUrls = [
            ...userImages.slice(0, indexToDelete),
            ...userImages.slice(indexToDelete + 1),
          ];
          const updatedUploadedOn = [
            ...uploadedOnArray.slice(0, indexToDelete),
            ...uploadedOnArray.slice(indexToDelete + 1),
          ];

          // Update the document in Firestore
          await deleteDoc(userUploadsRef);
          await setDoc(userUploadsRef, {
            imageUrls: updatedImageUrls,
            uploadedOn: updatedUploadedOn,
          });

          // Close the modal
          document.getElementById('my_modal_5').close();

          // Redirect to 'your-uploads' page
          navigate('/');

        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        setLoading(true);

        if (page === 'pub') {
          const allUploadsQuery = query(collection(firestore, 'user_uploads'));
          const allUploadsSnapshot = await getDocs(allUploadsQuery);

          const allImageData = [];
          for (const doc of allUploadsSnapshot.docs) {
            const uid = doc.id;
            const userImages = doc.data().imageUrls || [];
            const uploadedOnArray = doc.data().uploadedOn || [];

            for (const [index, imageUrl] of userImages.entries()) {
              const uploadedOn = uploadedOnArray[index];
              allImageData.push({
                imageUrl,
                uploadedBy: await getUsername(uid),
                uploadedOn: new Date(uploadedOn).toLocaleDateString(),
              });
            }
          }

          setImageData(allImageData);
        } else if (page === 'user') {
          const uid = auth.currentUser.uid;
          const userUploadsRef = doc(firestore, 'user_uploads', uid);
          const userUploadsDoc = await getDoc(userUploadsRef);

          if (userUploadsDoc.exists()) {
            const userImages = userUploadsDoc.data().imageUrls || [];
            const uploadedOnArray = userUploadsDoc.data().uploadedOn || [];

            const userImageData = [];
            for (const [index, imageUrl] of userImages.entries()) {
              const uploadedOn = uploadedOnArray[index];
              userImageData.push({
                imageUrl,
                uploadedBy: await getUsername(uid),
                uploadedOn: new Date(uploadedOn).toLocaleDateString(),
              });
            }

            setImageData(userImageData);
          }
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrls();
  }, [page, setImageData]);

  return (
    <div className="grid md:grid-cols-3 justify-center gap-10 my-5">
      {loading ? (
        <p>Loading...</p>
      ) : (
        imageData.map((imageInfo, index) => (
          <div key={index} className="card card-compact w-80 md:w-auto bg-lilac-200 shadow-xl">
            <figure>
              <img src={imageInfo.imageUrl} alt={`Image ${index + 1}`} />
              {page === 'user' && (
                <button
                  className="absolute top-2 right-2 text-red-500 text-center"
                  onClick={() => handleDeleteImage(imageInfo.imageUrl)}
                >
                  <i className="fi fi-ss-trash"></i>
                </button>
              )}
            </figure>
            <div className="card-body text-center text-bold text-lilac-800">
              <span>Uploaded By: {imageInfo.uploadedBy}</span>
              <span>Created on: {imageInfo.uploadedOn}</span>
            </div>
          </div>
        ))
      )}
      {/* Confirmation Modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this image?</p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={() => confirmDelete()}>
              Confirm
            </button>
            <button className="btn btn-success" onClick={() => document.getElementById('my_modal_5').close()}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

ImageGallery.propTypes = {
  page: PropTypes.string.isRequired,
};

export default ImageGallery;
