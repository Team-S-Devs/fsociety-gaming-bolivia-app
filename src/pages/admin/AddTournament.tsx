import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { Container } from "@mui/material";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { Tournament } from "../../interfaces/interfaces";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import TournamentForm from "../../components/tournament/admin/TournamentForm";
import { getEmptyTournament } from "../../utils/methods";
import { uploadFileToStorage } from "../../utils/storageMethods";

const AddTournament: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament>(
    getEmptyTournament()
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleUploadImage = async (ref: string): Promise<string> => {
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
      const ref = `tournaments/${Date.now().toString()}`;
      const url = await handleUploadImage(ref);
      if (url !== "") {
        await addDoc(collection(db, CollectionNames.TOURNAMENTS), {
          ...tournament,
          imagePath: {
            url,
            ref,
          },
          createdAt: Timestamp.now(),
        });
        setSuccess("Torneo añadido exitosamente.");
        setTournament(getEmptyTournament());
        setFile(null);
      } else {
        setError("Error subiendo la imagen. Inténtalo de nuevo.");
      }
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
          />
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default AddTournament;
