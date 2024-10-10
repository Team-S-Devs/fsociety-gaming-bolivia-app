import React, { useState, useEffect } from "react";
import { TextField, Typography, useTheme } from "@mui/material";
import { getAuth, sendPasswordResetEmail, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import styles from "../../assets/styles/profile.module.css";
import MainButton from "../../components/buttons/MainButton";
import {
  validateNickname,
  validatePhone,
  validateUserId,
} from "../../utils/validatorUtil";
import { useUserContext } from "../../contexts/UserContext";
import ProfileImage from "../../components/profile/ProfileImage";
import { toast } from "react-toastify";
import Loader from "../Loader";
import BlurBoxContainer from "../BlurBoxContainer";

interface UserData {
  nickname: string;
  phone: string;
  email: string;
  bio: string;
  userId: string;
}

const ProfileDetailsEdit: React.FC = () => {
  const auth = getAuth();
  const theme = useTheme();
  const currentUser = auth.currentUser as User | null;

  const { userInfo } = useUserContext();

  const [userData, setUserData] = useState<UserData>({
    nickname: "",
    phone: "",
    email: "",
    bio: "",
    userId: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [userIdError, setUserIdError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(
          doc(db, CollectionNames.Users, currentUser.uid)
        );
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData({
            nickname: data.nickname || "",
            phone: data.phone.toString() || "",
            email: data.email || "",
            bio: data.bio || "",
            userId: data.userId || "",
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
    const nameValidation = validateNickname(userData.nickname);
    const phoneValidation = validatePhone(userData.phone);
    const userIdValidation = validateUserId(userData.userId);

    setNicknameError(nameValidation);
    setPhoneError(phoneValidation);
    setUserIdError(userIdValidation);

    if (nameValidation || phoneValidation || userIdValidation) return;

    if (!currentUser) return;
    setUpdating(true);
    try {
      const nicknameLowerCase = userData.nickname.toLowerCase();
      if (userInfo?.nicknameLowerCase !== userData.nickname.toLowerCase()) {
        const usersCollectionRef = collection(db, CollectionNames.Users);
        const q = query(
          usersCollectionRef,
          where("nicknameLowerCase", "==", nicknameLowerCase)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setNicknameError(
            "El nombre de usuario ya está en uso. Por favor, elige otro."
          );
          setLoading(false);
          return;
        }
      }
      const userDocRef = doc(db, CollectionNames.Users, currentUser.uid);
      await updateDoc(userDocRef, {
        nickname: userData.nickname,
        nicknameLowerCase,
        phone: Number(userData.phone),
        bio: userData.bio,
        userId: userData.userId,
      });
      setSuccessMessage("Perfil actualizado con éxito.");
    } catch (error) {
      setErrorMessage("Error al actualizar el perfil.");
    }
    setUpdating(false);
  };

  const handleResetPassword = async () => {
    if (!userData.email) return;
    try {
      await sendPasswordResetEmail(auth, userData.email);
      toast.success("Correo enviado exitosamente (Verifique su bandeja de entrada para restablecer la contraseña)");
    } catch (error) {
      toast.error("Error al intentar restablecer la contraseña.");
    }
  };

  const handleChange =
    (field: keyof UserData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserData({ ...userData, [field]: event.target.value });
    };

  return (
    <BlurBoxContainer>
      {loading ? (
        <Loader />
      ) : (
        <form
        //   className={styles.profileForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <ProfileImage />
          <br />
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
            label="Nombre de usuario (nickname)"
            fullWidth
            margin="normal"
            placeholder="Nickname"
            value={userData.nickname}
            onChange={handleChange("nickname")}
            error={!!nicknameError}
            helperText={nicknameError}
            required
            className={styles.inputField}
          />
          <TextField
            label="ID:"
            fullWidth
            placeholder="12345678"
            margin="normal"
            value={userData.userId}
            onChange={handleChange("userId")}
            error={!!userIdError}
            helperText={userIdError}
            required
            className={styles.inputField}
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={userData.bio}
            onChange={handleChange("bio")}
            className={styles.inputField}
            multiline
            rows={3}
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
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            value={userData.email}
            className={styles.inputFieldDisabled}
          />
          <div className="d-flex justify-content-between flex-wrap mt-4">
            <MainButton
              title="Cambiar Contraseña"
              onClick={handleResetPassword}
              color="transparent"
            />
            <MainButton
              title="Guardar"
              onClick={handleUpdateProfile}
              loading={updating}
              color={theme.palette.secondary.main}
            />
          </div>
        </form>
      )}
    </BlurBoxContainer>
  );
};

export default ProfileDetailsEdit;
