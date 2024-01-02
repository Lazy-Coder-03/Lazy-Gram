import { useAuth } from "../hooks/useAuth"
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';



const PublicRoute = ({ children }) => {
  const { user }=useAuth();


  console.log("PublicRoute component is being called");

  
  if (user) {
    // Reroute to home page after user information is available
    return <Navigate to="/" replace={true} />;
  }


  return children

}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export default PublicRoute

