import { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase/config';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  deleteDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ref, deleteObject, } from 'firebase/storage';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ImageGallery = ({ page }) => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteImageUrl, setDeleteImageUrl] = useState('');
  const [selectedCaption, setSelectedCaption] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const navigate = useNavigate();

  const getUsername = async (uid) => {
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    return userDoc.exists() ? userDoc.data().username : 'Unknown User';
  };

  const handleDeleteImage = (imageUrl) => {
    setDeleteImageUrl(imageUrl);
    document.getElementById('delete_modal').showModal();
  };

  const handleEditCaption = (imageUrl, caption) => {
    setSelectedImageUrl(imageUrl);
    setSelectedCaption(caption);
    document.getElementById('edit_caption_modal').showModal();
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
          document.getElementById('delete_modal').close();

          // Redirect to 'your-uploads' page
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const confirmEditCaption = async () => {
    try {
      // Update caption in Firestore user uploads collection
      const uid = auth.currentUser.uid;
      const userUploadsRef = doc(firestore, 'user_uploads', uid);

      // Get the current data
      const userUploadsDoc = await getDoc(userUploadsRef);

      if (userUploadsDoc.exists()) {
        const userImages = userUploadsDoc.data().imageUrls || [];
        const captions = userUploadsDoc.data().captions || [];

        // Find the index of the image URL
        const indexToUpdate = userImages.indexOf(selectedImageUrl);

        if (indexToUpdate !== -1) {
          // Update the caption at the specified index
          const updatedCaptions = [...captions];
          updatedCaptions[indexToUpdate] = selectedCaption;

          // Update the document in Firestore
          await updateDoc(userUploadsRef, {
            captions: updatedCaptions,
          });

          // Close the modal
          document.getElementById('edit_caption_modal').close();
        }
      }
    } catch (error) {
      console.error('Error updating caption:', error);
    }
  };

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        setLoading(true);

        let allImageData = [];

        if (page === 'pub') {
          const allUploadsQuery = query(collection(firestore, 'user_uploads'));
          const allUploadsSnapshot = await getDocs(allUploadsQuery);

          for (const doc of allUploadsSnapshot.docs) {
            const uid = doc.id;
            const userImages = doc.data().imageUrls || [];
            const captions = doc.data().captions || [];
            const uploadedOnArray = doc.data().uploadedOn || [];

            for (const [index, imageUrl] of userImages.entries()) {
              const uploadedOn = uploadedOnArray[index];
              const caption = captions[index] || '';

              allImageData.push({
                imageUrl,
                uploadedBy: await getUsername(uid),
                uploadedOn: new Date(uploadedOn).getTime(),
                caption,
              });
            }
          }
        } else if (page === 'user') {
          const uid = auth.currentUser.uid;
          const userUploadsRef = doc(firestore, 'user_uploads', uid);
          const userUploadsDoc = await getDoc(userUploadsRef);

          if (userUploadsDoc.exists()) {
            const userImages = userUploadsDoc.data().imageUrls || [];
            const captions = userUploadsDoc.data().captions || [];
            const uploadedOnArray = userUploadsDoc.data().uploadedOn || [];

            for (const [index, imageUrl] of userImages.entries()) {
              const uploadedOn = uploadedOnArray[index];
              const caption = captions[index] || '';

              allImageData.push({
                imageUrl,
                uploadedBy: await getUsername(uid),
                uploadedOn: new Date(uploadedOn).getTime(),
                caption,
              });
            }
          }
        }

        // Sort the array by uploadedOn in descending order
        allImageData.sort((a, b) => b.uploadedOn - a.uploadedOn);

        setImageData(allImageData);
      } catch (error) {
        console.error('Error fetching image data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrls();
  }, [page, setImageData]);

  const formatUploadDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

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
                <>
                  <button
                    className="absolute top-2 right-2 text-red-500 text-center"
                    onClick={() => handleDeleteImage(imageInfo.imageUrl)}
                  >
                    <i className="fi fi-ss-trash"></i>
                  </button>
                  <button
                    className="absolute bottom-[4.2rem] right-5 text-blue-500 text-center"
                    onClick={() => handleEditCaption(imageInfo.imageUrl, imageInfo.caption)}
                  >
                    <i className="fi fi-ss-pencil"></i>
                  </button>
                </>
              )}
            </figure>
            <div className="card-body text-left text-bold text-lilac-800">
              {imageInfo.caption && <span>{imageInfo.caption}</span>}
              <span>Posted By: {imageInfo.uploadedBy}</span>
              <span>Posted on: {formatUploadDate(imageInfo.uploadedOn)}</span>
              
            </div>
          </div>
        ))
      )}
      {/* Confirmation Modal for Deletion */}
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this image?</p>
          <div className="modal-action">
            <button className="btn btn-success" onClick={confirmDelete}>
              Confirm
            </button>
            <button
              className="btn btn-error"
              onClick={() => document.getElementById('delete_modal').close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
      {/* Modal for Editing Caption */}
      <dialog id="edit_caption_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Caption</h3>
          <div className="py-4">
            <textarea
              className="w-full h-20 p-2 border border-gray-300 rounded-md"
              placeholder="Enter caption..."
              value={selectedCaption}
              onChange={(e) => setSelectedCaption(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-action">
            <button className="btn btn-success" onClick={confirmEditCaption}>
              Save Caption
            </button>
            <button
              className="btn btn-error"
              onClick={() => document.getElementById('edit_caption_modal').close()}
            >
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
