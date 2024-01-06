import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Upload from "../Upload";

const ProtectedUpload = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <Upload />;
};

export default ProtectedUpload;
