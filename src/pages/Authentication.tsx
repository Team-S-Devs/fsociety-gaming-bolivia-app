import React, { useState } from "react";
import { TextField, Typography, Container } from "@mui/material";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import ContainerWithBackground from "../components/ContainerWithBackground";
import { WEB_URL } from "../utils/constants";
import { LoadingButton } from "@mui/lab";
import BlurBoxContainer from "../components/BlurBoxContainer";
import "../assets/styles/auth.css";

const Authentication: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();

  const handleSendLink = async () => {
    if (!email) {
      setError("El email es requerido.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email no válido.");
      return;
    }

    setError(null);

    const actionCodeSettings = {
      url: `${WEB_URL}/registration?email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    };

    setLoading(true);

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setEmailSent(true);
    } catch (error) {
      setError("Error al enviar el enlace de autenticación.");
    }

    setLoading(false);
  };

  return (
    <ContainerWithBackground urlImage="/src/assets/background.jpg">
      <Container maxWidth="sm">
        <BlurBoxContainer>
          <Typography variant="h4" gutterBottom align="center">
            ¡Bienvenido!
          </Typography>
          <Typography style={{ marginTop: "24px" }}>
            Introduce tu e-mail para iniciar sesión o registrarte.
          </Typography>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            error={!!error}
            helperText={error}
          />
          <LoadingButton
            variant="contained"
            onClick={handleSendLink}
            fullWidth
            className="continue-button"
            loading={loading}
          >
            CONTINUAR
          </LoadingButton>
          {emailSent && (
            <Typography
              variant="body1"
              color="success"
              style={{ marginTop: 20 }}
            >
              Enlace de autenticación enviado. Por favor revisa tu correo.
            </Typography>
          )}
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default Authentication;
