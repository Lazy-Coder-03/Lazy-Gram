import  { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase/config';
import {
    doc,
    getDoc,
} from 'firebase/firestore';
import Navbar from '../components/Navbar';
import ImageGallery from '../components/ImageGallery';
import { Link } from 'react-router-dom';

function UserUploads() {
    const [hasUploads, setHasUploads] = useState(false);

    useEffect(() => {
        const checkUserUploads = async () => {
            try {
                const uid = auth.currentUser.uid;
                const userUploadsRef = doc(firestore, 'user_uploads', uid);
                const userUploadsDoc = await getDoc(userUploadsRef);

                if (userUploadsDoc.exists()) {
                    const userImages = userUploadsDoc.data().imageUrls || [];
                    setHasUploads(userImages.length > 0);
                } else {
                    setHasUploads(false);
                }
            } catch (error) {
                console.error('Error checking user uploads:', error);
            }
        };

        checkUserUploads();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <Navbar />
            {hasUploads ? (
                <ImageGallery page="user" />
            ) : (
                <div className="text-center mt-8">
                    <p className="text-lg font-semibold">
                        You have not uploaded anything yet.
                    </p>
                    <p className="mt-2">
                        If you want to upload pictures,{' '}
                        <Link to="/upload-images" className="text-accent underline">
                            go to the upload images page
                        </Link>
                        .
                    </p>
                </div>
            )}
        </div>
    );
}

export default UserUploads;
