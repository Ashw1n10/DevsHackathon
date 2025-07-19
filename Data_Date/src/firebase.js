// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNolPG0ctmP4Em-bmbIovf6xIFNheSNFA",
  authDomain: "datadate-8d8df.firebaseapp.com",
  projectId: "datadate-8d8df",
  storageBucket: "datadate-8d8df.firebasestorage.app",
  messagingSenderId: "1014942815328",
  appId: "1:1014942815328:web:1204006f8629f61f70df05",
  measurementId: "G-G7CDMYYDVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
const db = getFirestore(app); 

export { auth, db, analytics };
export default app;