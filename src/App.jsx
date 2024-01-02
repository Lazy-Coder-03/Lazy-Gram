// Import the necessary components and modules
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import WaitingVerification from './pages/WaitingVerification.jsx';
import Login from './pages/Login.jsx';
import HandleUserInfo from './pages/HandleUserInfo.jsx';
import UpdateUserInfo from './pages/UpdateUserInfo.jsx';
import UploadImages from './pages/UploadImages.jsx'; // Import the UploadImages component
import { AuthProvider } from './context/auth';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute.jsx';
import UserUploads from './pages/UserUploads.jsx'; // Import the UserUploads component

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/verificationpending"
          element={
            <WaitingVerification />
          }
        />
        {/* Add the route for HandleUserInfo */}
        <Route
          path="/handle-user-info/:uid"
          element={
            <PrivateRoute>
              <HandleUserInfo />
            </PrivateRoute>
          }
        />
        {/* Add the route for UpdateUserInfo */}
        <Route
          path="/update-user-info/:uid"
          element={
            <PrivateRoute>
              <UpdateUserInfo />
            </PrivateRoute>
          }
        />
        {/* Add the route for UploadImages */}
        <Route
          path="/upload-images"
          element={
            <PrivateRoute>
              <UploadImages />
            </PrivateRoute>
          }
        />
        <Route
          path="/your-uploads"
          element={
            <PrivateRoute>
              <UserUploads />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
