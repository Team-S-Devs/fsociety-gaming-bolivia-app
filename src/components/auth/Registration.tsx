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
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import styles from "../../assets/styles/buttons.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CollectionNames } from "../../utils/collectionNames";
import { validateNickname, validatePhone } from "../../utils/validatorUtil";

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

  const [nickname, setNickname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [generalSucces, setGeneralSucces] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);

  const validateFields = () => {
    let valid = true;

    if (isforSignUp) {
      const nameValidation = validateNickname(nickname);
      setNicknameError(nameValidation);

      const phoneValidation = validatePhone(phone);
      setPhoneError(phoneValidation);

      if(nameValidation || phoneValidation) return false;
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

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!validateFields()) return;
  
    setLoading(true);
  
    try {
      if (isforSignUp) {
        const nicknameLowerCase = nickname.toLowerCase();
        const usersCollectionRef = collection(db, CollectionNames.Users);
        const q = query(usersCollectionRef, where("nicknameLowerCase", "==", nicknameLowerCase));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          setNicknameError("El nombre de usuario ya está en uso. Por favor, elige otro.");
          setLoading(false);
          return;
        }
  
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.toLowerCase(),
          password
        );
        const user = userCredential.user;
  
        const userDocRef = doc(db, CollectionNames.Users, user.uid);
        await setDoc(userDocRef, {
          nickname,
          nicknameLowerCase, 
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
        setGeneralError("El email ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setGeneralError("El email no es válido.");
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

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setGeneralSucces("Correo de recuperación enviado.");
    } catch (error: any) {
      setGeneralError("Error al enviar el correo de recuperación.");
    }
  };

  return (
    <form onChange={() => setGeneralError(null)} onSubmit={handleRegister}>
      <Typography variant="h4" gutterBottom align="center">
        {isforSignUp ? "Completa tu Registro" : "Iniciar sesión"}
      </Typography>
      <Typography>
        {isforSignUp
          ? `Completa los datos para registrarte con el correo ${email}`
          : `Introduce tu contraseña asociada al correo ${email} para iniciar sesión`}
      </Typography>
      {generalError && (
        <Typography color="error" marginTop={1}>
          {generalError}
        </Typography>
      )}
      {generalSucces && (
        <div className="d-flex justify-content-center text-center">
          <Typography color="success" marginTop={1}>
            {generalSucces}
          </Typography>
        </div>
      )}
      {isforSignUp && (
        <>
          <TextField
            label="Nombre de usuario (nickname)"
            name="nickname"
            fullWidth
            margin="normal"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value.trim());
              setNicknameError(null);
            }}
            error={!!nicknameError}
            required
            helperText={nicknameError}
          />
          <TextField
            label="Teléfono"
            name="phone"
            type="tel"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.trim());
              setPhoneError(null);
            }}
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
        name={nickname}
        type={showPassword ? "text" : "password"}
        label={"Contraseña"}
        required={true}
        fullWidth
        onChange={(event) => {
          setPassword(event.target.value);
          setPasswordError(null);
        }}
        error={!!passwordError}
        helperText={passwordError}
        InputProps={{
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
        }}
      />
      <LoadingButton
        variant="contained"
        color="primary"
        onClick={handleRegister}
        fullWidth
        loading={loading}
        className={styles.continueButton}
      >
        {isforSignUp
          ? loading
            ? "Registrándote..."
            : "Registrarme"
          : loading
          ? "Iniciando Sesión..."
          : "Iniciar Sesión"}
      </LoadingButton>
      {!isforSignUp && (
        <div className={`d-flex justify-content-center text-center mt-3 ${styles.forgotPswd}`}>
            <p onClick={handleForgotPassword}>
                ¿Olvidaste tu contraseña?
            </p>
        </div>
      )}
      {registrationSuccess && (
        <Typography variant="body1" color="success">
          Registro completado con éxito.
        </Typography>
      )}
    </form>
  );
};

export default Registration;
