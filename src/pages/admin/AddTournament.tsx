import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { Container } from "@mui/material";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { Tournament } from "../../interfaces/interfaces";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import "../../assets/styles/auth.css";
import TournamentForm from "../../components/tournament/admin/TournamentForm";
import { getEmptyTournament } from "../../utils/methods";

const AddTournament: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament>(getEmptyTournament());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!tournament.name || !tournament.startDate || !tournament.endDate) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, CollectionNames.TOURNAMENTS), {
        ...tournament,
        createdAt: Timestamp.now(),
      });

      setSuccess("Torneo añadido exitosamente.");
      setTournament(getEmptyTournament());
    } catch (err) {
      setError("Error añadiendo el torneo. Inténtalo de nuevo.");
    }
  };

  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Container maxWidth="md">
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
          />
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default AddTournament;
