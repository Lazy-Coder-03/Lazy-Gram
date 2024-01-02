// PrivateRoute.jsx

import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show loading indicator or placeholder while authentication status is being determined
    return <div>Loading...</div>;
  }

  if (!user) {
    // Reroute to login page after user information is available
    return <Navigate to="/signup" replace={true} />;
  }
  if (!user.emailVerified) {
    // Reroute to login page after user information is available
    return <Navigate to="/verificationpending" replace={true} />;
  }

//   if (user && !user.emailVerified) {
//     // User is logged in but hasn't verified their email
//     return (
//       <Navigate to="/verificationpending" replace={true} />
//     );
//   }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
