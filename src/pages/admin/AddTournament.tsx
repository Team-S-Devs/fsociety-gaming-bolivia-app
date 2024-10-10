import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { Container } from "@mui/material";
import { db } from "../../utils/firebase-config";
import { CollectionNames, StoragePaths } from "../../utils/collectionNames";
import { Tournament } from "../../interfaces/interfaces";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import TournamentForm from "../../components/tournament/admin/TournamentForm";
import { getEmptyTournament } from "../../utils/methods";
import { uploadFileToStorage } from "../../utils/storageMethods";
import { useNavigate } from "react-router-dom";
import { PagesNames } from "../../utils/constants";

const AddTournament: React.FC = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament>(
    getEmptyTournament()
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

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

    if (!tournament.name || !tournament.startDate || !tournament.endDate) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      const refBanner = `${
        StoragePaths.TournamentsPreviews
      }/${Date.now().toString()}`;
      const urlBanner = await handleUploadImage(refBanner, file);

      const refPreview = `${
        StoragePaths.TournamentsPreviews
      }/${Date.now().toString()}`;
      const urlPreview = await handleUploadImage(refPreview, previewFile);
      await addDoc(collection(db, CollectionNames.Tournaments), {
        ...tournament,
        fakeId: new Date().toTimeString(),
        imagePath: {
          url: urlBanner,
          ref: refBanner,
        },
        previewImagePath: {
          url: urlPreview,
          ref: refPreview,
        },
        createdAt: Timestamp.now(),
      });
      setSuccess("Torneo añadido exitosamente.");
      setTournament(getEmptyTournament());
      setFile(null);
      navigate(PagesNames.AdminTournaments);
    } catch (err) {
      setError("Error añadiendo el torneo. Inténtalo de nuevo.");
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
          <TournamentForm
            tournament={tournament}
            setTournament={setTournament}
            submit={handleSubmit}
            success={success}
            error={error}
            setError={setError}
            title="Añadir Nuevo Torneo"
            file={file}
            setFile={setFile}
            setSuccess={setSuccess}
            previewFile={previewFile}
            setPreviewFile={setPreviewFile}
          />
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default AddTournament;
