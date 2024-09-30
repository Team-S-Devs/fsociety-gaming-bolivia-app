import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Box, Container, TextField, Typography } from "@mui/material";
import { db } from "../../utils/firebase-config";
import { CollectionNames, StoragePaths } from "../../utils/collectionNames";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import { getEmptyAdminSettings } from "../../utils/methods";
import { uploadFileToStorage } from "../../utils/storageMethods";
import { useNavigate } from "react-router-dom";
import { PagesNames } from "../../utils/constants";
import { AdminSettingsInterface } from "../../interfaces/interfaces";
import FileUpload from "../../components/inputs/FileUpload";
import { LoadingButton } from "@mui/lab";
import styles from "../../assets/styles/buttons.module.css";
import Loader from "../../components/Loader";

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [adminSettings, setAdminSettings] = useState<AdminSettingsInterface>(
    getEmptyAdminSettings()
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGetting, setLoadingGetting] = useState<boolean>(false);

  useEffect(() => {
    const fetchBannerById = async () => {
      setError(null);
      setLoadingGetting(true);
      try {
        const bannerRef = doc(db, CollectionNames.Admin, "admin");

        const docSnap = await getDoc(bannerRef);

        if (docSnap.exists()) {
          setAdminSettings(docSnap.data() as AdminSettingsInterface);
        } else {
          setError("Información no encontrado.");
        }
      } catch (error) {
        setError("Error obteniendo los datos.");
      }
      setLoadingGetting(false);
    };

    fetchBannerById();
  }, []);

  const handleUploadImage = async (
    ref: string,
    file: File | null
  ): Promise<string> => {
    if (!file) return "";

    try {
      const url = await uploadFileToStorage(file, ref);
      return url;
    } catch (error: any) {
      alert("Hubo un error subiendo la imagen, intenta de nuevo.");
      return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "position" ? (Number(value) == 0 ? "" : Number(value)) : value;

    setAdminSettings({
      ...adminSettings,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!adminSettings.twitchChannel) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const refBanner = `${StoragePaths.Admin}/pay_qr_code}`;
      const urlBanner = await handleUploadImage(refBanner, file);

      await updateDoc(doc(db, CollectionNames.Admin, "admin"), {
        ...adminSettings,
        twitchChannel: adminSettings.twitchChannel,
        paymentQR: {
          url: urlBanner,
          ref: refBanner,
        },
      });
      setSuccess("Guardado exitosamente.");
      setAdminSettings(getEmptyAdminSettings());
      setFile(null);
      navigate(PagesNames.Admin);
      setLoading(false);
    } catch (err) {
      setError("Error al guardar. Inténtalo de nuevo.");
    }
  };

  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Container maxWidth="md">
        <br />
        <br />
        <br />
        <br />

        <BlurBoxContainer>
          <Box>
            <Typography variant="h4" gutterBottom>
              CONFIGURACIÓN
            </Typography>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {success && (
              <Typography color="success" variant="body2">
                {success}
              </Typography>
            )}

            {loadingGetting ? (
              <Loader />
            ) : (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  name="twitchChannel"
                  value={adminSettings.twitchChannel}
                  onChange={handleInputChange}
                  placeholder="https://www.twitch.tv/fsocietygamingtorneos"
                  label="URL del canal de Twitch:"
                  required
                />

                <div style={{ marginTop: 24 }}>
                  <Typography>QR para pago de torneos:</Typography>
                  <FileUpload
                    setFile={setFile}
                    file={file}
                    imgUrl={adminSettings.paymentQR.url}
                  />
                </div>

                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  loading={loading}
                  className={styles.continueButton}
                  style={{ marginTop: 24 }}
                  onClick={handleSubmit}
                >
                  Guardar
                </LoadingButton>
              </>
            )}
          </Box>
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default AdminSettings;
