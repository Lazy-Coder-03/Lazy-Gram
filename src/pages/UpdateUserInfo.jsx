import { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase/config';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateUserInfo = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [connectedEmail, setConnectedEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName || '');
          setUsername(userData.username || '');
          setProfilePicture(
            userData.profilePicture ||
            'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
          );
        } else {
          setError('User not found.');
        }

        setConnectedEmail(auth.currentUser.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data.');
      }
    };

    fetchUserData();
  }, [uid]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      try {
        setUploading(true);

        const storageRef = ref(storage, `profile_pictures/${uid}`);
        const snapshot = await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(snapshot.ref);

        setProfilePicture(downloadURL);
        setUploading(false);

        const userRef = doc(firestore, 'users', uid);
        await updateDoc(userRef, { profilePicture: downloadURL });

        submitForm();
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
        setUploading(false);
      }
    } else {
      setProfilePicture(null);
      setError('Invalid file type. Please select a PNG, JPEG, JPG, or BMP file.');
    }
  };

  const submitForm = async () => {
    try {
      setUploading(true);

      let updatedProfile = {
        displayName: username,
        photoURL: auth.currentUser.photoURL || '',
      };

      await updateProfile(auth.currentUser, updatedProfile);

      const userRef = doc(firestore, 'users', uid);
      await updateDoc(userRef, { fullName, username, profilePicture });

      if (password) {
        if (password === confirmPassword) {
          await updatePassword(auth.currentUser, password);
        } else {
          throw new Error("Passwords don't match.");
        }
      }

      //navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (uploading) {
      return;
    }

    submitForm();
    navigate('/');
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Lazy-Gram</h1>
          <p className="pt-6 pb-[0.5rem]">Update Your Information</p>
        </div>
        <div className="card sm:w-[30rem] shadow-2xl bg-base-100 mx-auto">
          <div
            className="avatar cursor-pointer mx-auto mt-4 relative flex"
            onClick={() => document.getElementById('fileInput').click()}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
              <img src={profilePicture} alt="Profile Avatar" className="w-full h-full object-cover" />
            </div>
            <input
              type="file"
              accept=".png, .jpeg, .jpg, .bmp"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            {uploading && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                <div className="text-white">Uploading... {Math.round(uploadProgress)}%</div>
              </div>
            )}
          </div>
          <div className="text-center py-1">
            <span>Update Profile Picture</span>
          </div>
          <form className="card-body" onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Connected Email</span>
              </label>
              <input
                type="email"
                value={connectedEmail}
                readOnly
                placeholder="Connected Email"
                className="input input-bordered"
                disabled
              />
            </div>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Update Info'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserInfo;
