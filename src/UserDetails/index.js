import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";

const UserDetails = () => {
  const location = useLocation();
  const { state: { phone } = {} } = location;
  const [totalframes, setTotalFrames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const mediaArray = Array.from(files);
    setTotalFrames((prevFrames) => prevFrames.concat(mediaArray));
    setSelectedFiles(mediaArray);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const userPhone = phone;
      for (let i = 0; i < selectedFiles.length; ++i) {
        const formData = new FormData();
        formData.append("date", "1111-11-11");
        formData.append("frame", selectedFiles[i]);

        const response = await fetch(
          `https://clientadminbackend.onrender.com/users/add-frames/${userPhone}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          console.log(`Frame added successfully`);
          window.location.reload();
        } else {
          console.error(`Failed to add frame`);
        }
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uniqueName, url, publicId) => {
    try {
      const phoneNo = phone;
      const encodedPublicId = encodeURIComponent(publicId);
      const response = await fetch(
        `https://clientadminbackend.onrender.com/users/user/${phoneNo}/${uniqueName}/${encodedPublicId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Media deleted successfully");
        setTotalFrames((prevMedia) =>
          prevMedia.filter((media) => media.cloudinaryUrl !== url)
        );
      } else {
        console.error("Error deleting media:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting media:", error.message);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://clientadminbackend.onrender.com/users/user/${phone}`
        );
        if (response.ok) {
          const data = await response.json();
          const dataArray = data.user.frames;
          setTotalFrames(dataArray);
        } else {
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
    handleUpload();
  }, [phone, selectedFiles]);

  return (
    <div>
      <div className="details-top">
        <h1 className="details-text">{phone}</h1>
        {loading && <p>Uploading...</p>}
      </div>
      <div className="details-mid">
        <div className="frames-container">
          {totalframes.map((frame, index) => (
            <div className="frames" key={index}>
              <img
                src={frame.cloudinaryUrl}
                alt={`Frame ${index + 1}`}
                style={{ width: "200px", height: "200px" }}
                className="frame"
              />
              <button
                className="delete-btn-frame"
                onClick={() => {
                  handleDelete(
                    frame.uniqueName,
                    frame.cloudinaryUrl,
                    frame.publicId
                  );
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <label className="details-upload-text">
        <span>Upload Frames: </span>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default UserDetails;
