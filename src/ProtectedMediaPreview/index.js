import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import MediaPreview from "../MediaPreview";

const ProtectedMediaUpload = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <MediaPreview />;
};

export default ProtectedMediaUpload;
