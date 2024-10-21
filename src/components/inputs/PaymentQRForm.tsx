import React from "react";
import { TextField, Typography } from "@mui/material";
import { PaymentQRData } from "../../interfaces/interfaces";
import Grid from "@mui/material/Grid2";

interface PaymentQRFormProps {
  paymentData: PaymentQRData;
  setPaymentData: React.Dispatch<React.SetStateAction<PaymentQRData>>;
}

const PaymentQRForm: React.FC<PaymentQRFormProps> = ({
  paymentData,
  setPaymentData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ marginTop: "20px" }}
    >
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" align="center">
          Datos de Pago
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }}>
        <TextField
          fullWidth
          label="Número de Cuenta"
          name="accountNumber"
          value={paymentData.accountNumber}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Beneficiario:"
          name="accountName"
          value={paymentData.accountName}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Banco"
          name="bank"
          value={paymentData.bank}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default PaymentQRForm;
