import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXR2StQJlWJbu_bIKLzuvHSmfgRKoe2CU",
  authDomain: "playground-database-b8293.firebaseapp.com",
  databaseURL: "https://playground-database-b8293-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "playground-database-b8293",
  storageBucket: "playground-database-b8293.appspot.com",
  messagingSenderId: "447731721791",
  appId: "1:447731721791:web:c6fcb203668d10cd03ba8a"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);