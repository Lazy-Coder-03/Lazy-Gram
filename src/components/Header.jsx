// Navbar.jsx
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();
  let timeoutId;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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

  const handleLogoutConfirmation = () => {
    setShowLogoutConfirmation(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutConfirmation(false);
  };

  const redirectToUpdateProfile = () => {
    navigate(`/update-user-info/${user.uid}`);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId); // Clear the timeout if the mouse enters before the delay expires
    setMenuVisible(true);
  };

  const handleMouseLeave = () => {
    // Set a 2-second delay before hiding the menu
    timeoutId = setTimeout(() => {
      setMenuVisible(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-around h-full m-4">
      <Link to="/" className="font-bold btn btn-ghost text-xl text-lilac-700">
        Lazy-Gram
      </Link>

      {user && (
        <div className="flex items-center relative">
          <div className="px-4">
            <div
              className="group relative cursor-pointer text-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-gray-500 text-sm focus:outline-none"
                onClick={handleMouseEnter}
              >
                <big className="text-lilac-600">{user.displayName}</big>
              </button>

              {/* Menu content */}
              <div
                className={`absolute top-full right-0 mt-2 bg-white rounded-md shadow-lg opacity-0 transition-opacity duration-300 ${menuVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="py-2 px-4 text-center hover:bg-lilac-50 focus:outline-none"
                  onClick={redirectToUpdateProfile}
                >
                  Update Profile
                </button>
                <button
                  className="py-2 px-4 text-center text-red-600 hover:bg-lilac-50 focus:outline-none"
                  onClick={handleLogoutConfirmation}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-md text-lilac-900">
            <p>Do you really want to log out?</p>
            <div className="mt-4 flex justify-end">
              <button className="btn btn-success mr-2" onClick={confirmLogout}>
                Yes
              </button>
              <button className="btn btn-error" onClick={cancelLogout}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
