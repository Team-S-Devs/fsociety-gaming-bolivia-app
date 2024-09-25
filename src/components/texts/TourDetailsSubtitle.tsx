import React from "react";
import styles from "../../assets/styles/tournamentDetails.module.css";
import modalImage from "../../assets/backgroundSplash.jpg";

interface TourDetailsSubtitleProps {
  text: string;
}

const TourDetailsSubtitle: React.FC<TourDetailsSubtitleProps> = ({ text }) => {
  return (
    <div className={styles.textInfoSectionItem}>
      <img
        src={modalImage}
        alt="subtitle image card"
        className={styles.textInfoSectionImage}
      />
      <h2>{text}</h2>
    </div>
  );
};

export default TourDetailsSubtitle;
