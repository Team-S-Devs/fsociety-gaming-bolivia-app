import React from "react";
import styles from "../../../assets/styles/tournamentDetails.module.css";
import JoinModal from "../../tournament/tourForm/JoinModal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
}) => {
  return (
    <JoinModal show={isOpen} onClose={onClose}>
      <div className={styles.modalForm}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p>{message}</p>
        <div className={styles.modalButtons}>
          <button onClick={onConfirm} className={styles.modalButton}>
            {confirmText}
          </button>
          <button onClick={onClose} className={styles.modalButtonClose}>
            Cancelar
          </button>
        </div>
      </div>
    </JoinModal>
  );
};

export default ConfirmationModal;
