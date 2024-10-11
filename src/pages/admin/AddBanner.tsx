import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { Container } from "@mui/material";
import { db } from "../../utils/firebase-config";
import { CollectionNames, StoragePaths } from "../../utils/collectionNames";
import { Banner } from "../../interfaces/interfaces";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import { getEmptyBanner } from "../../utils/methods";
import { uploadFileToStorage } from "../../utils/storageMethods";
import { useNavigate } from "react-router-dom";
import { PagesNames } from "../../utils/constants";
import BannerForm from "../../components/banners/admin/BannerForm";

const AddBanner: React.FC = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner>(
    getEmptyBanner()
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleUploadImage = async (ref: string, file: File | null): Promise<string> => {
    if (!file) return "";

    try {
      const url = await uploadFileToStorage(file, ref);
      return url;
    } catch (error: any) {
      alert("Hubo un error subiendo la imagen, intenta de nuevo.");
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!banner.redirectUrl || !banner.position) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      const refBanner = `${
        StoragePaths.Banners
      }/${Date.now().toString()}`;
      const urlBanner = await handleUploadImage(refBanner, file);

      await addDoc(collection(db, CollectionNames.Banners), {
        ...banner,
        fakeId: new Date().toTimeString(),
        image: {
          url: urlBanner,
          ref: refBanner,
        },
        createdAt: Timestamp.now(),
      });
      setSuccess("Torneo añadido exitosamente.");
      setBanner(getEmptyBanner());
      setFile(null);
      navigate(PagesNames.AdminBanners);
    } catch (err) {
      setError("Error añadiendo el torneo. Inténtalo de nuevo.");
    }
  };

  return (
    <ContainerWithBackground urlImage="/assets/bannerFsociety.jpg">
      <Container maxWidth="md">
        <br />
        <br />
        <br />
        <br />

        <BlurBoxContainer>
          <BannerForm
            banner={banner}
            setBanner={setBanner}
            submit={handleSubmit}
            success={success}
            error={error}
            setError={setError}
            title="Añadir Nuevo Torneo"
            file={file}
            setFile={setFile}
            setSuccess={setSuccess}
          />
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default AddBanner;
