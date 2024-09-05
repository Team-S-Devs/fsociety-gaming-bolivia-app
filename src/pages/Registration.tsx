import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { UserType } from "../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import "../assets/styles/auth.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CollectionNames } from "../utils/collectionNames";

interface RegistrationProps {
  isforSignUp: boolean;
  email: string;
}

const Registration: React.FC<RegistrationProps> = ({
  isforSignUp = true,
  email = "",
}) => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);

  const validateFields = () => {
    let valid = true;

    if (isforSignUp) {
      if (!name.trim()) {
        setNameError("El nombre es requerido.");
        valid = false;
      } else {
        setNameError(null);
      }

      if (!phone.trim()) {
        setPhoneError("El teléfono es requerido.");
        valid = false;
      } else {
        setPhoneError(null);
      }
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener mínimo 6 caracteres.");
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      if (isforSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.toLowerCase(),
          password
        );
        const user = userCredential.user;

        const userDocRef = doc(db, CollectionNames.Users, user.uid);
        await setDoc(userDocRef, {
          name,
          email: email.toLowerCase(),
          phone: Number(phone),
          type: UserType.USER,
        });

        setRegistrationSuccess(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setNameError("El correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setNameError("El correo no es válido.");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("La contraseña es muy débil.");
      } else if (error.code === "auth/wrong-password") {
        setPasswordError("La contraseña es incorrecta.");
      } else {
        setPasswordError("Error en la autenticación.");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align="center">
        Completa tu Registro
      </Typography>
      <Typography>
        {isforSignUp
          ? `Completa los datos para registrarte con el correo ${email}`
          : `Introduce tu contraseña asociada al correo ${email} para iniciar sesión`}
      </Typography>
      {isforSignUp && (
        <>
          <TextField
            label="Nombre"
            name="name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            error={!!nameError}
            required
            helperText={nameError}
          />
          <TextField
            label="Teléfono"
            name="phone"
            type="tel"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
            error={!!phoneError}
            required
            helperText={phoneError}
          />
        </>
      )}
      <TextField
        style={{ marginTop: 12 }}
        id="password"
        value={password}
        name={name}
        type={showPassword ? "text" : "password"}
        label={"Contraseña"}
        required={true}
        fullWidth
        onChange={(event) => setPassword(event.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        slotProps={{
          htmlInput: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEye size={28} color="#fff" />
                  ) : (
                    <AiOutlineEyeInvisible size={28} color="#fff" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <LoadingButton
        variant="contained"
        color="primary"
        onClick={handleRegister}
        fullWidth
        loading={loading}
        className="continue-button"
      >
        {isforSignUp ? "Registrarme" : "Iniciar Sesión"}
      </LoadingButton>
      {registrationSuccess && (
        <Typography variant="body1" color="success">
          Registro completado con éxito.
        </Typography>
      )}
    </>
  );
};

export default Registration;
