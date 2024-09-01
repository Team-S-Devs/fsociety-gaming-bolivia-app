import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { UserType } from "../interfaces/interfaces";
import Loader from "../components/Loader";
import ContainerWithBackground from "../components/ContainerWithBackground";
import { LoadingButton } from "@mui/lab";
import BlurBoxContainer from "../components/BlurBoxContainer";
import "../assets/styles/auth.css";

const Registration: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [loadedVerification, setLoadedVerification] = useState<boolean>(false);

  useEffect(() => {
    const authInstance = getAuth();

    const queryParams = new URLSearchParams(window.location.search);
    const emailFromQuery = queryParams.get("email");

    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }

    if (isSignInWithEmailLink(authInstance, window.location.href)) {
      signInWithEmailLink(
        authInstance,
        emailFromQuery || "",
        window.location.href
      )
        .then(async (result) => {
          const user = result.user;

          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (!userDoc.exists()) {
            setLoadedVerification(true);
          } else {
            navigate("/");
            setRegistrationSuccess(true);
          }
        })
        .catch(() => {
          setError("Error al verificar el enlace de autenticación.");
        });
    }
  }, []);

  const handleRegister = async () => {
    if (!name || !phone) {
      setError("Todos los campos son requeridos.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const userDocRef = doc(db, "users", email);
      await setDoc(userDocRef, {
        name,
        email,
        phone: Number(phone),
        type: UserType.USER,
      });

      setRegistrationSuccess(true);
    } catch (error) {
      setError("Error al registrar el usuario.");
    }

    setLoading(false);
  };

  return (
    <ContainerWithBackground urlImage="/src/assets/background.jpg">
      {loadedVerification ? (
        <BlurBoxContainer>
          <Typography variant="h4" gutterBottom align="center">
            Completa tu Registro
          </Typography>
          <TextField
            label="Nombre"
            name="name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            error={!!error}
            helperText={error}
          />
          <TextField
            label="Teléfono"
            name="phone"
            type="tel"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
            error={!!error}
            helperText={error}
          />
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleRegister}
            fullWidth
            loading={loading}
            className="continue-button"
          >
            Registrarme
          </LoadingButton>
          {registrationSuccess && (
            <Typography variant="body1" color="success">
              Registro completado con éxito.
            </Typography>
          )}
        </BlurBoxContainer>
      ) : (
        <BlurBoxContainer>
          <Loader />
        </BlurBoxContainer>
      )}
    </ContainerWithBackground>
  );
};

export default Registration;
