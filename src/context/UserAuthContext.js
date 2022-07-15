import { createContext } from "react";
import { auth } from "../firebase-config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";

const userAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
    const [user, setUser] = useState();

    function signIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }
    
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function logOut() {
        return signOut(auth);
    }

    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            unsubscribe();
        }
    }, [])

    return <userAuthContext.Provider value={{user, signUp, signIn, logOut, googleSignIn}}>{children}</userAuthContext.Provider>
}

export const useUserAuth = () => {
    return useContext(userAuthContext);
}