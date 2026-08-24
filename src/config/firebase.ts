// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB7gy8wZxeHRyFtttTLBNmo_sRFk0ynmg4',
  authDomain: 'water-tracker-4cf9f.firebaseapp.com',
  projectId: 'water-tracker-4cf9f',
  storageBucket: 'water-tracker-4cf9f.firebasestorage.app',
  messagingSenderId: '59243248896',
  appId: '1:59243248896:web:8d0e27efec0f269a18c7e5',
  measurementId: 'G-DZ6TZW1CT5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const db = getDatabase(app);
export const db = getFirestore(app);
