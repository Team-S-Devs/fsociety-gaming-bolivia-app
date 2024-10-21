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
import {
  AdminSettingsInterface,
  PaymentQRData,
} from "../../interfaces/interfaces";
import { getEmptyAdminSettings, getEmptyPayment } from "../../utils/methods";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { WPP_NUMBER } from "../../utils/constants";
import Grid from "@mui/material/Grid2";
import Slider from "react-slick";

interface PaymentStepsDialogInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  price: number | "";
}

interface PaymentQRDisplayProps {
  data: PaymentQRData;
  price: number | "";
}

const PaymentQRDisplay: React.FC<PaymentQRDisplayProps> = ({ data, price }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ marginTop: 4 }}
    >
      <Grid size={{ xs: 12 }}>
        <Typography variant="body1">
          <strong>Número de cuenta:</strong> {data?.accountNumber ?? ""}
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant="body1">
          <strong>Pagar a:</strong> {data?.accountName ?? ""}
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant="body1">
          <strong>Banco:</strong> {data?.bank ?? ""}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body1">
          <strong>Monto a pagar:</strong> Bs. {price}
        </Typography>
      </Grid>
    </Grid>
  );
};

interface QRSliderProps {
  adminSettings: AdminSettingsInterface;
  price: number | "";
}

const QRSlider: React.FC<QRSliderProps> = ({ adminSettings, price }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  return (
    <Slider {...sliderSettings}>
      <Box
        sx={{
          textAlign: "center",
          my: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={adminSettings.paymentQR.url}
            alt="QR Code 1"
            style={{ height: "400px" }}
          />
        </div>
        <PaymentQRDisplay data={adminSettings.paymentQRData} price={price} />
      </Box>

      <Box sx={{ textAlign: "center", my: 2 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={adminSettings.paymentQRTwo?.url ?? ""}
            alt="QR Code 2"
            style={{ height: "400px" }}
          />
        </div>
        <PaymentQRDisplay
          data={adminSettings.paymentQRDataTwo ?? getEmptyPayment()}
          price={price}
        />
      </Box>
    </Slider>
  );
};

const PaymentStepsDialog: React.FC<PaymentStepsDialogInterface> = ({
  open,
  setOpen,
  price,
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
                <Typography variant="body1">
                  Paga a uno de los siguientes QR
                </Typography>
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
                <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                  <QRSlider adminSettings={adminSettings} price={price} />
                </div>
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
