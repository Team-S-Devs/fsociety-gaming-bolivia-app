import React, { useEffect, useState } from "react";
import {
  Timestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { Banner } from "../../interfaces/interfaces";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import { getEmptyBanner } from "../../utils/methods";
import { uploadFileToStorage } from "../../utils/storageMethods";
import { PagesNames } from "../../utils/constants";
import Loader from "../../components/Loader";
import BannerForm from "../../components/banners/admin/BannerForm";

const EditBanner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [banner, setBanner] = useState<Banner>(getEmptyBanner());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerById = async () => {
      setError(null);
      setLoading(true);
      try {
        if(!id) return;
        const bannerRef = doc(db, CollectionNames.Banners, id);

        const docSnap = await getDoc(bannerRef);

        if (docSnap.exists()) {
          setBanner(docSnap.data() as Banner);
          setDocId(docSnap.id);
        } else {
          setError("Banner no encontrado.");
        }
      } catch (error) {
        setError("Error obteniendo los datos del Banner.");
      }
      setLoading(false);
    };

    fetchBannerById();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!banner || !banner.redirectUrl || !banner.position) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      let imagePath = banner.image;

      if (file) {
        const ref = banner.image.ref;
        const url = await handleUploadImage(ref, file);
        imagePath = { url, ref };
      }

      if (docId) {
        await updateDoc(doc(db, CollectionNames.Banners, docId), {
          ...banner,
          image: imagePath,
          updatedAt: Timestamp.now(),
        });

        setSuccess("Banner actualizado exitosamente.");
        navigate(PagesNames.AdminBanners);
      } else {
        setError("No se encontró el banner para actualizar.");
      }
    } catch (err) {
      setError("Error actualizando el banner. Inténtalo de nuevo.");
    }
  };

  if (!banner) {
    return <div>Cargando datos del banner...</div>;
  }

  return (
    <ContainerWithBackground urlImage="/assets/bannerFsociety.jpg">
      <Container maxWidth="md">
        <br />
        <br />
        <br />
        <br />

        <BlurBoxContainer>
          {loading ? (
            <Loader />
          ) : (
            <BannerForm
              banner={banner}
              setBanner={setBanner}
              submit={handleSubmit}
              success={success}
              error={error}
              setError={setError}
              title="Editar Banner"
              file={file}
              setFile={setFile}
              setSuccess={setSuccess}
              isEditing
            />
          )}
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default EditBanner;
