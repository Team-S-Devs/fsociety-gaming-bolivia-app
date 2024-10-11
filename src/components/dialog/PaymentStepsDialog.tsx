import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import { FaWhatsapp } from "react-icons/fa";
import { AdminSettingsInterface } from "../../interfaces/interfaces";
import { getEmptyAdminSettings } from "../../utils/methods";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { WPP_NUMBER } from "../../utils/constants";

interface PaymentStepsDialogInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentStepsDialog: React.FC<PaymentStepsDialogInterface> = ({
  open,
  setOpen,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettingsInterface>(
    getEmptyAdminSettings()
  );

  useEffect(() => {
    const fetchAdminSettings = async () => {
      setLoading(true);
      try {
        const adminSettingsRef = doc(db, CollectionNames.Admin, "admin");

        const docSnap = await getDoc(adminSettingsRef);

        if (docSnap.exists()) {
          setAdminSettings(docSnap.data() as AdminSettingsInterface);
        }
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchAdminSettings();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Verifica tu Pago</DialogTitle>

        <DialogContent>
          <Typography>
            Sube tu comprobante de pago para poder participar del torneo.
          </Typography>
          <Stepper activeStep={-1} orientation="vertical">
            <Step>
              <StepLabel>
                <Typography variant="body1">Paga el siguiente QR</Typography>
              </StepLabel>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress color="secondary" />
                </div>
              ) : error ? (
                <Typography>
                  Hubo un error cargando el código QR, recarga la página por
                  favor.
                </Typography>
              ) : (
                <Box sx={{ textAlign: "center", my: 2 }}>
                  <img
                    src={adminSettings.paymentQR.url}
                    alt="QR Code"
                    style={{ width: "200px", height: "200px" }}
                  />
                </Box>
              )}
            </Step>

            <Step>
              <StepLabel>
                <Typography variant="body1">
                  Envía tu comprobante al Whatsapp
                </Typography>
              </StepLabel>
              <Box sx={{ textAlign: "center", my: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FaWhatsapp />}
                  href={`https://wa.me/${WPP_NUMBER}`}
                  target="_blank"
                >
                  Enviar Comprobante
                </Button>
              </Box>
            </Step>

            <Step>
              <StepLabel>
                <Typography variant="body1">
                  Espera a que se valide tu transacción
                </Typography>
              </StepLabel>
            </Step>
          </Stepper>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentStepsDialog;
