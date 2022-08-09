// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA165DFGe7lzbg012u_al3UMBLjIvfq13k",
  authDomain: "reddit-clone-7c97c.firebaseapp.com",
  projectId: "reddit-clone-7c97c",
  storageBucket: "reddit-clone-7c97c.appspot.com",
  messagingSenderId: "1040791811323",
  appId: "1:1040791811323:web:856456995fb8f3979c2c5e",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export default app;
export { db, storage };
