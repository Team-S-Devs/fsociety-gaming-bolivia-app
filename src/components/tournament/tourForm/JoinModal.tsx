import React from "react";
import styles from "../../../assets/styles/tournamentDetails.module.css";

interface JoinModalProps {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const JoinModal: React.FC<JoinModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className={styles.modalJoin} onClick={onClose}>
      <div
        className={styles.modalJoinContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.closeContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default JoinModal;
