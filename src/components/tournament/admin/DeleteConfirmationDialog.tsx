import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loadingDelete: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  loadingDelete
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Torneo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro que deseas eliminar este torneo? 
          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: "#fff"}}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          {loadingDelete ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
