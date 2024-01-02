import { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    sendEmailVerification,
} from 'firebase/auth';

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import FullnameInputField from '../components/FullnameInputField';
import EmailInputField from '../components/EmailInputField';
import UsernameInputField from '../components/UsernameInputField';
import PasswordInputFields from '../components/PasswordInputFields';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(5);

    const addUserToFirestore = async (uid, userData) => {
        const { email, fullName, username } = userData;

        try {
            // Check if the username is already taken
            const usernameExists = await checkUsernameExists(username);
            if (usernameExists) {
                throw new Error('Username is already taken. Please choose a different one.');
            }

            // Add user data to the 'users' collection
            const userRef = doc(firestore, 'users', uid);
            await setDoc(userRef, { email, fullName, username });

            // Add the username to the 'usernames' collection
            const usernameRef = doc(firestore, 'usernames', username.toLowerCase());
            await setDoc(usernameRef, { uid });

            console.log('User added to Firestore successfully.');
        } catch (error) {
            console.error('Error adding user to Firestore:', error);
            throw error;
        }
    };


    const checkUsernameExists = async (desiredUsername) => {
        const usernameRef = doc(firestore, 'usernames', desiredUsername.toLowerCase());
        const snapshot = await getDoc(usernameRef);
        return snapshot.exists();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile with full name and set username
            await updateProfile(userCredential.user, {
                displayName: username,//displayName is username
            });

            // Add user data to Firestore
            await addUserToFirestore(userCredential.user.uid, {
                email,
                fullName,
                username,
            });

            // Send email verification
            await sendEmailVerification(userCredential.user);

            // Display success message and navigate after 5 seconds
            setError(
                'A verification email has been sent to your email address. Please verify your account.'
            );
            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (error) {
            setError(error.message);

            // Check if the error is due to the email already being in use
            if (error.code === 'auth/email-already-in-use') {
                let seconds = 7;

                // Update countdown and error message at regular intervals
                const countdownInterval = setInterval(() => {
                    setCountdown((prevCountdown) => prevCountdown - 1);
                    seconds--;

                    setError(`Email already in use. Redirecting to login page in ${seconds} seconds.`);

                    if (seconds === 0) {
                        clearInterval(countdownInterval);
                        navigate('/login');
                    }
                }, 1000);

                // Clear the interval when the component unmounts
                return () => {
                    clearInterval(countdownInterval);
                };
            }
        }
    };



    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const googleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Extracting email from the Google user profile
            const email = result.user.email;

            // Redirect to HandleUserInfo page with user's UID and email
            navigate(`/handle-user-info/${result.user.uid}?email=${email}`);
        } catch (error) {
            setError(error.message);
        }
    };


    useEffect(() => {
        // Clear countdown on component unmount
        return () => {
            setCountdown(0);
        };
    }, []);

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Lazy-Gram</h1>
                    <p className="pt-6 pb-[0.5rem]">Dont be Lazy, Just Signup</p>
                </div>
                <div className="card sm:w-[30rem] shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        {error && <div className="alert alert-error">{error}</div>}
                        <FullnameInputField fullName={fullName} setFullName={setFullName} />
                        <EmailInputField email={email} setEmail={setEmail} />
                        <UsernameInputField username={username} setUsername={setUsername} />
                        <PasswordInputFields password={password} setPassword={setPassword} showPassword={showPassword} handleTogglePassword={handleTogglePassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />
                        <div className="border-stone-300 text-center">
                            <p className="text-sm text-gray-500">
                                Already signed up? <a className="hover:text-lilac-500" href="/login">Login here</a>.
                            </p>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Sign Up</button>
                        </div>
                        <div className="form-control mt-4">
                            <button type="button" className="btn btn-accent" onClick={googleSignIn}>
                                Sign Up using Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );


};

export default Signup;
