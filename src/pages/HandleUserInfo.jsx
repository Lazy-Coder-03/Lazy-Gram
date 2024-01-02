import { useState, useContext } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { firestore } from '../firebase/config';

const HandleUserInfo = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const { user } = useContext(AuthContext); // Accessing user information from AuthContext
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const checkUsernameExists = async (desiredUsername) => {
    const usernameRef = doc(firestore, 'usernames', desiredUsername.toLowerCase());
    const snapshot = await getDoc(usernameRef);
    return snapshot.exists();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = user.email; // Get email from authenticated user

      // Check if the username is already taken
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        throw new Error('Username is already taken. Please choose a different one.');
      }
      

      // Add user data to Firestore
      const userRef = doc(firestore, 'users', uid);
      await setDoc(userRef, { fullName, username, email });

      // Add the username to the 'usernames' collection
      const usernameRef = doc(firestore, 'usernames', username.toLowerCase());
      await setDoc(usernameRef, { uid });

      // Redirect to home or any other page as needed
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Lazy-Gram</h1>
          <p className="pt-6 pb-[0.5rem]">Complete Your Profile</p>
        </div>
        <div className="card sm:w-[30rem] shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="input input-bordered"
                required
              />
            </div>
            
            <div className="form-control mt-6">
              <button className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HandleUserInfo;
