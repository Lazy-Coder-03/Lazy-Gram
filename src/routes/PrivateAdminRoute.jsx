// PrivateAdminRoute.jsx
import { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import propTypes from 'prop-types';
const PrivateAdminRoute = ({ element }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin status when the component mounts
    const checkAdminStatus = async () => {
      try {
        // Replace the following logic with your own server-side check
        // using Firebase Admin SDK or any other method.
        // Example: Check if the user has a custom claim "admin".
        const user = auth.currentUser;
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          const isAdminUser = idTokenResult.claims.admin;
          setIsAdmin(isAdminUser);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, []);

  if (isAdmin) {
    // Render the component if the user is an admin
    return <Route element={element} />;
  } else {
    // Redirect to another page if the user is not an admin
    return <Navigate to="/access-denied" />;
  }
};

PrivateAdminRoute.propTypes = {
    element: propTypes.element.isRequired,
};

export default PrivateAdminRoute;
