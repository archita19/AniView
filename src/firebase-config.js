import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  confirmPasswordReset
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpQw4xF1eHvCWEQMF5Wa5det3S9K46IEo",
  authDomain: "aniview-ae629.firebaseapp.com",
  projectId: "aniview-ae629",
  storageBucket: "aniview-ae629.appspot.com",
  messagingSenderId: "38998250161",
  appId: "1:38998250161:web:69e1c726ba40c08c50c890",
  measurementId: "G-8GHSZGHN1V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const signUp = async (userName, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await addDoc(collection(db, "users"), {
      userName: userName,
      uid: user.uid,
      emailId: email,
      authProvider: "local",
      isAdmin: Boolean(false),
      img: "",
      gender: "",
      dob: "",
      bio: "",
    });
    return 0;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

export const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
  }
};

const google = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
};

export const signUpViaGoogle = async () => {
  try {
    const res = await google();
    const user = res.user;

    await addDoc(collection(db, "users"), {
      userName: user.displayName,
      uid: user.uid,
      emailId: user.email,
      authProvider: "google",
      img: user.photoURL,
      gender: "",
      dob: "",
      bio: "",
    });
  } catch (err) {
    console.log(err);
  }
};

export const signInViaGoogle = async () => {
  try {
    await google();
  } catch (err) {
    console.log(err);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.log(err);
  }
};

export const forgetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/sign-in",
      handleCodeInApp: false,
    });
  } catch (err) {
    console.log(err);
  }
};

export const changePassword = async (oobCode, newPassword) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (err) {
    console.log(err);
  }
};

// database
export const db = getFirestore(app);

// storage
export const storage = getStorage(app);
