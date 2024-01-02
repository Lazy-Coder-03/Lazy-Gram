import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { sendEmailVerification, onAuthStateChanged, getAuth } from 'firebase/auth';

const WaitingVerification = () => {
  const { user, isLoading, emailVerified } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const emailVerified = user.emailVerified;
        if (emailVerified) {
          navigate('/', { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleResendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      console.log('Verification email resent!');
      // You may want to update the component state to show a success message
    } catch (error) {
      console.error('Error resending verification email:', error);
      // Handle the error and show an error message if needed
    }
  };

  if (!user || isLoading) {
    // If the user is not logged in or still loading, you can show a loading indicator or redirect to signup
    return <Navigate to="/signup" replace={true} />;
  }

  if (emailVerified) {
    // If email is already verified, redirect to home
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-bold mb-4">Email Verification Required</h1>
        <p className="mb-4">
          You need to verify your email before accessing the main application. Please check your
          email for a verification link. Refresh this Page after You are done Verifying Your Email
        </p>
        <button
          onClick={handleResendVerificationEmail}
          className="bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-dark mr-2"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default WaitingVerification;
