import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  sendEmailVerification,
  onAuthStateChanged,
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

const WaitingVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGoBackToSignup = async () => {
    try {
      // Check if email is verified
      if (!user.emailVerified) {
        // Open the reauthentication modal
        document.getElementById('reauth_modal').showModal();
      }
    } catch (error) {
      console.error('Error handling "Go Back to Signup":', error);
      // Handle the error and show an error message if needed
    }
  };

  const handleReauthenticate = async () => {
    try {
      // Close the reauthentication modal
      document.getElementById('reauth_modal').close();

      // Reauthenticate the user before deleting the account
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete the user account if reauthentication is successful
      await deleteUser(auth.currentUser);

      // Navigate back to the signup page
      navigate('/signup', { replace: true });
    } catch (error) {
      console.error('Error during reauthentication:', error);
      // Handle the error and show an error message if needed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-bold mb-4">Email Verification Required</h1>
        <p className="mb-4">
          You need to verify your email before accessing the main application. Please check your
          email for a verification link. Refresh this Page after You are done Verifying Your Email
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleResendVerificationEmail}
            className="bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-dark mr-2"
          >
            Resend Verification Email
          </button>
          <button
            onClick={handleGoBackToSignup}
            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Go Back to Signup
          </button>
        </div>

        {/* Reauthentication Modal */}
        <dialog id="reauth_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Reauthentication Required</h3>
            <p className="py-4">Please enter your password to go back to signup:</p>
            <div className="form-control">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 px-4 border rounded-md"
              />
              <label className="label cursor-pointer">
                <span className="label-text">Show Password</span>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="checkbox"
                />
              </label>
            </div>
            <div className="modal-action">
              <button onClick={handleReauthenticate} className="btn">
                Reauthenticate
              </button>
              <button
                onClick={() => document.getElementById('reauth_modal').close()}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default WaitingVerification;
