import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import { getAuth, User, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { CollectionNames } from "../utils/collectionNames";
import ContainerWithBackground from "../components/ContainerWithBackground";
import Splash from "./Splash";
import styles from "../assets/styles/profile.module.css";
import MainButton from "../components/buttons/MainButton";
import { validateName, validatePhone } from "../utils/validatorUtil";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  phone: string;
  email: string;
}

const Profile: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const currentUser = auth.currentUser as User | null;

  const [userData, setUserData] = useState<UserData>({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [loggingOut, setLogOut] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, CollectionNames.Users, currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        }
      } catch (error) {
        setErrorMessage("Error al cargar los datos del usuario.");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleUpdateProfile = async () => {
    setSuccessMessage(null);
    const nameValidation = validateName(userData.name);
    const phoneValidation = validatePhone(userData.phone);

    setNameError(nameValidation);
    setPhoneError(phoneValidation);

    if (nameValidation || phoneValidation) return;

    if (!currentUser) return;
    setUpdating(true);
    try {
      const userDocRef = doc(db, CollectionNames.Users, currentUser.uid);
      await updateDoc(userDocRef, {
        name: userData.name,
        phone: Number(userData.phone),
      });
      setSuccessMessage("Perfil actualizado con éxito.");
    } catch (error) {
      setErrorMessage("Error al actualizar el perfil.");
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    try {
      setLogOut(true);
      await signOut(auth);
      setLogOut(false);
      navigate("/");
    } catch (error) {
      setErrorMessage("Error al cerrar sesión.");
    }
  };

  const handleChange = (field: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [field]: event.target.value });
  };

  if (loading) {
    return <Splash />;
  }

  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <div className={styles.profileContainer}>
        <form className={styles.profileForm} onSubmit={(e) => e.preventDefault()}>
          <Typography variant="h4" gutterBottom className={styles.title}>
            {userData.name}
          </Typography>
          {successMessage && (
            <Typography className={styles.successMessage}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography className={styles.errorMessage}>
              {errorMessage}
            </Typography>
          )}
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={userData.name}
            onChange={handleChange("name")}
            error={!!nameError}
            helperText={nameError}
            required
            className={styles.inputField}
          />
          <TextField
            label="Teléfono"
            type="tel"
            fullWidth
            margin="normal"
            value={userData.phone}
            onChange={handleChange("phone")}
            error={!!phoneError}
            helperText={phoneError}
            required
            className={styles.inputField}
          />
          <TextField
            label="Correo Electrónico"
            fullWidth
            margin="normal"
            inputProps={{ readOnly: true }}
            value={userData.email}
            className={styles.inputFieldDisabled}
          />
          <div className="d-flex justify-content-between flex-wrap mt-3">
            <MainButton title="Cerrar Sesión" onClick={handleLogout} color="#bb0c0c" loading={loggingOut} />
            <MainButton title="Guardar" onClick={handleUpdateProfile} loading={updating} />
          </div>
        </form>
      </div>
    </ContainerWithBackground>
  );
};

export default Profile;
