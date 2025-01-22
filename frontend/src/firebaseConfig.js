import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyANgmvjvQkHMwFH5Bswl5S0prNOZS3lLnY",
  authDomain: "unreal-heroes.firebaseapp.com",
  projectId: "unreal-heroes",
  storageBucket: "unreal-heroes.firebasestorage.app",
  messagingSenderId: "882397003079",
  appId: "1:882397003079:web:55845255353df34c0ba062",
  measurementId: "G-9XX3BC49NQ",
  databaseURL: "https://unreal-heroes-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
