import React, { useEffect, useState } from "react";
import {
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { Tournament } from "../../interfaces/interfaces";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import TournamentForm from "../../components/tournament/admin/TournamentForm";
import { getEmptyTournament } from "../../utils/methods";
import { uploadFileToStorage } from "../../utils/storageMethods";
import { PagesNames } from "../../utils/constants";
import Loader from "../../components/Loader";

const EditTournament: React.FC = () => {
  const { fakeId } = useParams<{ fakeId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [tournament, setTournament] = useState<Tournament>(
    getEmptyTournament()
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewfile, setPreviewFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournamentByFakeId = async () => {
      setError(null);
      setLoading(true);
      try {
        const q = query(
          collection(db, CollectionNames.Tournaments),
          where("fakeId", "==", fakeId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const tournamentDoc = querySnapshot.docs[0];
          setTournament(tournamentDoc.data() as Tournament);
          setDocId(tournamentDoc.id);
        } else {
          setError("Torneo no encontrado.");
        }
      } catch (error) {
        setError("Error obteniendo los datos del torneo.");
      }
      setLoading(false);
    };

    fetchTournamentByFakeId();
  }, [fakeId]);

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

    if (
      !tournament ||
      !tournament.name ||
      !tournament.startDate ||
      !tournament.endDate
    ) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    try {
      let imagePath = tournament.imagePath;
      let previewImagePath = tournament.previewImagePath;

      if (file) {
        const ref = tournament.imagePath.ref;
        const url = await handleUploadImage(ref, file);
        imagePath = { url, ref };
      }

      if (previewfile) {
        const ref = tournament.previewImagePath.ref;
        const url = await handleUploadImage(ref, previewfile);
        previewImagePath = { url, ref };
      }

      if (docId) {
        await updateDoc(doc(db, CollectionNames.Tournaments, docId), {
          ...tournament,
          imagePath,
          previewImagePath,
          updatedAt: Timestamp.now(),
        });

        setSuccess("Torneo actualizado exitosamente.");
        navigate(PagesNames.Admin);
      } else {
        setError("No se encontró el torneo para actualizar.");
      }
    } catch (err) {
      setError("Error actualizando el torneo. Inténtalo de nuevo.");
    }
  };

  if (!tournament) {
    return <div>Cargando datos del torneo...</div>;
  }

  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Container maxWidth="md">
        <br />
        <br />
        <br />
        <br />

        <BlurBoxContainer>
          {loading ? (
            <Loader />
          ) : (
            <TournamentForm
              tournament={tournament}
              setTournament={setTournament}
              submit={handleSubmit}
              success={success}
              error={error}
              setError={setError}
              title="Editar Torneo"
              file={file}
              setFile={setFile}
              setSuccess={setSuccess}
              isEditing
              previewFile={previewfile}
              setPreviewFile={setPreviewFile}
            />
          )}
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default EditTournament;
