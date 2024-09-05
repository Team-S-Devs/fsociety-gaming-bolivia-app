import React, { useEffect, useState } from "react";
import { TextField, Typography, Container } from "@mui/material";
import ContainerWithBackground from "../components/ContainerWithBackground";
import { LoadingButton } from "@mui/lab";
import BlurBoxContainer from "../components/BlurBoxContainer";
import "../assets/styles/auth.css";
import Registration from "./Registration";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { CollectionNames } from "../utils/collectionNames";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Authentication: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isForSignUp, setIsForSignUp] = useState<boolean>(true);

  useEffect(() => {
    if(user) navigate("/")
  }, [user])

  const handleCheckEmail = async () => {
    try {
      const usersRef = collection(db, CollectionNames.Users);
      const q = query(usersRef, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs)

      if (querySnapshot.empty) {
        setIsForSignUp(true);
      } else {
        setIsForSignUp(false);
      }
      setEmailSent(true);
    } catch (error) {
      setError("Error al comprobar el correo. Por favor, inténtalo de nuevo");
    }
  };

  const handleManageAuth = async () => {
    if (!email) {
      setError("El email es requerido.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email no válido.");
      return;
    }

    setError(null);
    setLoading(true);
    await handleCheckEmail();

    setLoading(false);
  };

  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Container maxWidth="sm">
        <BlurBoxContainer>
          {emailSent ? (
            <Registration email={email} isforSignUp={isForSignUp} />
          ) : (
            <>
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
                onClick={handleManageAuth}
                fullWidth
                className="continue-button"
                loading={loading}
              >
                CONTINUAR
              </LoadingButton>
            </>
          )}
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default Authentication;
