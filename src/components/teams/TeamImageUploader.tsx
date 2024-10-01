import React, { useRef, useState } from "react";
import { Avatar, Badge, CircularProgress } from "@mui/material";
import { MdEdit } from "react-icons/md";
import { TbCameraPlus } from "react-icons/tb";
import { updateDoc, arrayUnion, arrayRemove, doc } from "firebase/firestore";
import { uploadFileToStorage } from "../../utils/storageMethods";
import { StoragePaths } from "../../utils/collectionNames";
import { db } from "../../utils/firebase-config";
import styles from "../../assets/styles/teamsParticipants.module.css";


interface TeamImageUploadProps {
  tournamentId: string;
  team: any;
  onUpdate: (updatedTeam: any) => void;
}

const TeamImageUpload: React.FC<TeamImageUploadProps> = ({
  tournamentId,
  team,
  onUpdate,
}) => {
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
        const uploadPath = `${StoragePaths.TeamBanners}/${team.captainId}`;
        const imageUrl = await uploadFileToStorage(file, uploadPath);

        const tournamentDocRef = doc(db, "tournaments", tournamentId);
        const updatedTeam = { ...team, banner: { ...team.banner, url: imageUrl } };

        await updateDoc(tournamentDocRef, {
          teams: arrayRemove(team),
        });
        await updateDoc(tournamentDocRef, {
          teams: arrayUnion(updatedTeam),
        });

        onUpdate(updatedTeam);
      } catch (error) {
        setError("Error uploading the image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.teamImageContainer}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <div className={styles.editIconButton}>
            {!team?.banner?.url ? (
              <TbCameraPlus color="#fff" size={28} />
            ) : (
              <MdEdit color="#fff" size={28} />
            )}
          </div>
        }
        onClick={handleBadgeClick}
        style={{ cursor: "pointer" }}
        className={styles.badgeTeamImage}
      >
        {loading ? (
          <CircularProgress size={80} />
        ) : (
          <Avatar
            alt="Team Image"
            src={team?.banner?.url || "/defaultTeamBanner.png"}
            sx={{ width: 130, height: 130 }}
            className={styles.teamImage}
          />
        )}
      </Badge>

      <input
        title="input img"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default TeamImageUpload;
