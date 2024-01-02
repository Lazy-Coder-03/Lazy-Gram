// login.jsx
import { useState } from 'react';
import { auth, firestore } from '../firebase/config';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const getEmailFromUsername = async (username) => {
    try {
      // Get the email associated with the username from Firestore
      const usernameDoc = await getDoc(doc(firestore, 'usernames', username.toLowerCase()));
      if (usernameDoc.exists()) {
        const userUid = usernameDoc.data().uid;
        const userDoc = await getDoc(doc(firestore, 'users', userUid));
        if (userDoc.exists()) {
          return userDoc.data().email;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting email from username:', error);
      return null;
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Attempt to sign in with email or username and password
  //     let email = identifier;

  //     // Check if the identifier is a username
  //     if (!identifier.includes('@')) {
  //       // Retrieve the email associated with the username
  //       const userEmail = await getEmailFromUsername(identifier);
  //       if (userEmail) {
  //         email = userEmail;
  //       } else {
  //         throw new Error('Username not found. Please check your username or sign up.');
  //       }
  //     }

  //     // Sign in with the obtained email and password
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate('/');
  //   } catch (error) {
  //     // Display errors
  //     setError(error.message);

  //     // Check if the error is due to a username not found
  //     if (error.message.includes('Username not found')) {
  //       // Start countdown and redirect to signup after 5 seconds
  //       let seconds = 5;
  //       const countdownInterval = setInterval(() => {
  //         seconds--;

  //         if (seconds === 0) {
  //           clearInterval(countdownInterval);
  //           navigate('/signup');
  //         }
  //       }, 1000);

  //       // Clear the interval when the component unmounts
  //       return () => {
  //         clearInterval(countdownInterval);
  //       };
  //     }
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Attempt to sign in with email or username and password
      let email = identifier;

      // Check if the identifier is a username
      if (!identifier.includes('@')) {
        // Retrieve the email associated with the username
        const userEmail = await getEmailFromUsername(identifier);
        if (userEmail) {
          email = userEmail;
        } else {
          throw new Error('Error: Invalid credentials! Please check your credentials. Or try Signing Up if you do not have an account');
        }
      }

      // Sign in with the obtained email and password
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      // Display errors
      setError(error.message);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // You can access user information from result.user if needed
      console.log(result.user);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const inputType = identifier.includes('@') ? 'email' : 'text';

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Lazy-Gram</h1>
          <p className="py-6">Login to Lazy-Gram</p>
        </div>
        <div className="card sm:w-[30rem] shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email or Username</span>
                {/* <span className="label-text">{inputType === 'email' ? 'Email' : 'Username'}</span> */}
              </label>
              <input
                type={inputType}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder='email or username'
                // placeholder={inputType === 'email' ? 'email' : 'username'}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="input input-bordered"
                required
              />
            </div>
            <div className="flex items-center mt-2 gap-4">
              <label className="label gap-4">
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={handleTogglePassword}
                />
                <span className="label-text-alt ml-15 showPass">Show Password</span>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
            <div className="form-control mt-4">
              <button type="button" className="btn btn-accent" onClick={googleSignIn}>
                Login using Google
              </button>
            </div>
            <div className="border-stone-300 text-center mt-4">
              <p className="text-sm text-gray-500">
                Dont have an account yet? <Link className="hover:text-lilac-500" to="/signup">Sign up for Lazy-Gram</Link>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
