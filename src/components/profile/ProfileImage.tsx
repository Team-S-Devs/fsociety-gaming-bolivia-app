import React, { useRef, useState } from "react";
import { Avatar, Badge, CircularProgress } from "@mui/material";
import profileImg from "../../assets/nonProfile.png";
import styles from "../../assets/styles/profile.module.css";
import { useUserContext } from "../../contexts/UserContext";
import { MdEdit } from "react-icons/md";
import { TbCameraPlus } from "react-icons/tb";
import { updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase-config";
import { Typography } from "antd";
import { uploadFileToStorage } from "../../utils/storageMethods";

const ProfileImage: React.FC = () => {
  const { user, setUser } = useUserContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleBadgeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setError("");

      try {
        const uploadPath = `profile-images/${user?.uid}`;
        const imageUrl = await uploadFileToStorage(file, uploadPath);

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: imageUrl });

          setUser((prev) => (prev ? { ...prev, photoURL: imageUrl } : null));
        }
      } catch (error) {
        setError("Error uploading the image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.profileImgContainer}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <div className={styles.editIconButton}>
            {!user?.photoURL ? (
              <TbCameraPlus color="#fff" size={28} />
            ) : (
              <MdEdit color="#fff" size={28} />
            )}
          </div>
        }
        onClick={handleBadgeClick}
        style={{ cursor: "pointer" }}
        className={styles.badgeProfile}
      >
        {loading ? (
          <CircularProgress size={80} />
        ) : (
          <Avatar
            alt="Imagen de perfil"
            src={user?.photoURL || profileImg}
            sx={{ width: 100, height: 100 }}
            className={styles.profileImg}
          />
        )}
      </Badge>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default ProfileImage;
