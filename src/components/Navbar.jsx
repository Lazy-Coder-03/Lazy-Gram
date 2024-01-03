import { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
  );
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            if (userData.profilePicture) {
              setProfilePicture(userData.profilePicture);
            } else {
              const storageRef = ref(storage, `profile_pictures/${user.uid}`);
              const downloadURL = await getDownloadURL(storageRef);
              setProfilePicture(downloadURL);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const redirectToUpdateProfile = () => {
    navigate(`/update-user-info/${user?.uid}`);
  };

  const openLogoutConfirmationModal = () => {
    setShowLogoutConfirmation(true);
  };

  const closeLogoutConfirmationModal = () => {
    setShowLogoutConfirmation(false);
  };

  const confirmLogout = () => {
    handleLogout();
    closeLogoutConfirmationModal();
  };

  return (
    <div className="flex items-center justify-evenly bg-base-100 p-4 md:justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="btn btn-ghost text-xl text-lilac-600">
          <i className="fi fi-ss-home"></i>
          <span className="hidden md:inline-block">Lazy-Gram</span>
        </Link>
      </div>
      <div>
        {user && (
          <div className="items-center md:gap-4 flex">
            <Link to="/upload-images" className="btn btn-ghost text-lilac-600">
              <i className="fi fi-ss-square-plus text-xl"></i>
              <span className="hidden md:inline-block">Upload Images</span>
            </Link>
          </div>
        )}
      </div>
      {user && (
        <div className="items-center md:gap-4 flex">
          <Link to="/your-uploads" className="btn btn-ghost text-lilac-600">
            <i className="fi fi-ss-picture text-xl"></i>
            <span className="hidden md:inline-block">Your Uploads</span>
          </Link>
        </div>
      )}
      {user && (
        <div className="flex items-center md:gap-4">
          <span className="text-bold text-lilac-600 hidden md:inline-block">{user.displayName}</span>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Profile Avatar" src={profilePicture} />
              </div>
            </div>
            <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 ">
              <li className="pb-3">
                <button onClick={redirectToUpdateProfile} className="btn py-3 text-lilac-600">
                  Profile
                </button>
              </li>
              <li>
                <button onClick={openLogoutConfirmationModal} className="btn py-3 text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {showLogoutConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-[2]">
          <dialog id="logout_confirmation_modal" className="modal modal-bottom sm:modal-middle" open>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Logout Confirmation</h3>
              <p className="py-4">Are you sure you want to logout?</p>
              <div className="modal-action">
                <button className="btn btn-primary mr-2" onClick={closeLogoutConfirmationModal}>
                  Cancel Logging out
                </button>
                <button className="btn btn-error" onClick={confirmLogout}>
                  Logout
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};


export default Navbar;
