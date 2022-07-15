import React from 'react'
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export default function ProtectedRoutes({ children }) {
    const { user } = useUserAuth();

    console.log("Check user in Private: ", user);
    if (!user) {
      return <Navigate to="/sign-in" />;
    }
    return children;
}
