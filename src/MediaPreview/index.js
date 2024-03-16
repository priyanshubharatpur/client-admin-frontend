import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const MediaPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: { formattedDate } = {} } = location;
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [initialMedia, setInitialMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDone = () => {
    navigate("/home");
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const mediaArray = Array.from(files);
    setSelectedMedia([...mediaArray, ...selectedMedia]);
  };

  const handleUpload = async () => {
    const fDate = format(formattedDate, "yyyy-MM-dd");
    setLoading(true);
    for (let i = 0; i < selectedMedia.length; ++i) {
      const formData = new FormData();
      formData.append("date", fDate);
      formData.append("mediaFile", selectedMedia[i]);

      try {
        const response = await fetch(
          "https://client-admin-backend-jx3ada7jca-el.a.run.app/media/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
        } else {
          console.error("Upload failed");
        }
      } catch (error) {
        console.error("Error during upload:", error);
      }
    }
    setLoading(false);
    if (selectedMedia.length !== 0) {
      setSelectedMedia([]);
    }
  };

  const handleDelete = async (uniqueName, publicId) => {
    try {
      const encodedUniqueName = encodeURIComponent(uniqueName);
      const encodedPublicId = encodeURIComponent(publicId);
      const response = await fetch(
        `https://client-admin-backend-jx3ada7jca-el.a.run.app/media/delete/${encodedUniqueName}/${encodedPublicId}/${formattedDate}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setInitialMedia((prevMedia) =>
          prevMedia.filter((media) => media.uniqueName !== uniqueName)
        );
      } else {
        console.error("Error deleting media:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting media:", error.message);
    }
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(
          `https://client-admin-backend-jx3ada7jca-el.a.run.app/media/${formattedDate}`
        );
        if (response.ok) {
          const mediaData = await response.json();
          setInitialMedia(mediaData.media);
        } else {
          console.error("Failed to fetch media");
        }
      } catch (error) {
        console.error("Error during media fetch:", error);
      }
    };

    handleUpload();
    fetchMedia();
  }, [formattedDate, selectedMedia]);

  return (
    <div className="media-container">
      <div className="media-top">
        <h1 className="media-text">Date: {formattedDate}</h1>
        {loading && <p>Uploading...</p>}
      </div>
      <div className="media-mid">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {initialMedia &&
            initialMedia.map((media, index) => {
              const mediaName = media.uniqueName;
              const fileExtension = mediaName.split(".").pop().toLowerCase();
              const isVideo = ["mp4", "webm", "ogg"].includes(fileExtension);
              return (
                <div
                  key={media.uniqueName}
                  style={{ margin: "5px" }}
                  className="media-items"
                >
                  {isVideo ? (
                    <video
                      controls
                      width="200"
                      height="200"
                      className="media-video"
                    >
                      <source
                        src={media.cloudinaryUrl}
                        type={`video/${fileExtension}`}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={media.cloudinaryUrl}
                      alt={`Media ${index + 1}`}
                      style={{ width: "200px", height: "200px" }}
                      className="media-image"
                    />
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => {
                      handleDelete(media.uniqueName, media.cloudinaryPublicId);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <div className="media-bottom">
        <label>
          <span className="media-text">Select more media:</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            multiple
            className="media-upload"
          />
        </label>
        <button className="media-button" onClick={handleDone}>
          <span className="upload-media-text">Done</span>
        </button>
      </div>
    </div>
  );
};

export default MediaPreview;
