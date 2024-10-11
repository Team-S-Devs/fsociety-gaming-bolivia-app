import React from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "../../assets/styles/tournamentDetails.module.css";

const DeleteMemberModal: React.FC<{
  showModal: boolean;
  handleModalClose: () => void;
  confirmDeleteMember: (memberId: string) => Promise<void>;
  loading: boolean;
  memberId: string | undefined;
}> = ({ showModal, handleModalClose, confirmDeleteMember, loading, memberId }) => {
  if (!showModal) return null;

  return (
    <div className={styles.modalJoin} onClick={handleModalClose}>
      <div className={styles.modalJoinContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeContainer}>
          <button className={styles.closeButton} onClick={handleModalClose}>
            ×
          </button>
        </div>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitleDelete}>Confirmar eliminación</h5>
        </div>
        <div className={styles.modalBody}>
          ¿Estás seguro de que deseas eliminarlo?
        </div>
        <div className={styles.modalFooterDeleteMember}>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
          {loading ? (
            <Button variant="danger" disabled>
              <Spinner animation="border" size="sm" /> Eliminando...
            </Button>
          ) : (
            <Button variant="danger" onClick={() => confirmDeleteMember(memberId!)}>
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteMemberModal;
