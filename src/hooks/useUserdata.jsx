// useUserData.js
import { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const useUserData = (uid) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setUserData(null);
      }
    };

    if (uid) {
      getUserData();
    }
  }, [uid]);

  return userData;
};

export default useUserData;
