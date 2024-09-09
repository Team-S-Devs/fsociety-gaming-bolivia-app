import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { TextField, Typography, Container, Box, MenuItem } from "@mui/material";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { Tournament, TournamentModality } from "../../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { IoCalendarOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import "../../assets/styles/auth.css";
import { modalities } from "../../interfaces/enumsData";

const darkDatePickerStyle = {
  backgroundColor: "transparent",
  color: "#fff",
  borderColor: "#fff",
  height: 56,
  width: "100%",
  fontSize: 40,
};

const AddTournament: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament>({
    name: "",
    inscriptionPrice: 0,
    imagePath: "",
    participants: 0,
    teamLimit: 0,
    modality: TournamentModality.ELIMINATION, // Default modality
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    teams: [],
    createdAt: Timestamp.now(),
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTournament({ ...tournament, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!tournament.name || !tournament.startDate || !tournament.endDate) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, CollectionNames.TOURNAMENTS), {
        ...tournament,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        createdAt: Timestamp.now(),
      });

      setSuccess("Torneo añadido exitosamente.");
      setTournament({
        name: "",
        inscriptionPrice: 0,
        imagePath: "",
        participants: 0,
        teamLimit: 0,
        modality: TournamentModality.ELIMINATION,
        startDate: Timestamp.now(),
        endDate: Timestamp.now(),
        teams: [],
        createdAt: Timestamp.now(),
      });
    } catch (err) {
      setError("Error añadiendo el torneo. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setTournament((prevTournament) => ({
        ...prevTournament,
        startDate: Timestamp.fromDate(date.toDate()),
      }));
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      setTournament((prevTournament) => ({
        ...prevTournament,
        endDate: Timestamp.fromDate(date.toDate()),
      }));
    }
  };

  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Container maxWidth="sm">
        <BlurBoxContainer>
          <Box mt={4} p={3}>
            <Typography variant="h4" gutterBottom>
              Añadir Nuevo Torneo
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
            <form
              onSubmit={handleSubmit}
              onChange={() => {
                setSuccess(null);
                setError(null);
              }}
            >
              <TextField
                fullWidth
                margin="normal"
                name="name"
                value={tournament.name}
                onChange={handleInputChange}
                placeholder="Nombre"
                label="Nombre del torneo"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="inscriptionPrice"
                value={tournament.inscriptionPrice}
                onChange={handleInputChange}
                placeholder="Precio de inscripción"
                label="Precio de inscripción"
                type="number"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="participants"
                value={tournament.participants}
                onChange={handleInputChange}
                placeholder="Número de participantes"
                label="Participantes"
                type="number"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="teamLimit"
                value={tournament.teamLimit}
                onChange={handleInputChange}
                placeholder="Límite de equipos"
                label="Límite de equipos"
                type="number"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="imagePath"
                value={tournament.imagePath}
                onChange={handleInputChange}
                placeholder="Ruta de la imagen"
                label="Ruta de la imagen"
                required
              />
              <TextField
                fullWidth
                select
                margin="normal"
                name="modality"
                value={tournament.modality}
                onChange={handleInputChange}
                label="Modalidad"
                required
              >
                {modalities.map((modality, index) => (
                  <MenuItem value={modality} key={`Modality ${index}`}>
                    {modality}
                  </MenuItem>
                ))}
              </TextField>
              <Typography marginTop={2} marginLeft={0.5} marginBottom={1}>
                Fecha de inicio:
              </Typography>
              <DatePicker
                value={dayjs(tournament.startDate.toDate())}
                onChange={handleStartDateChange}
                format="DD-MM-YYYY"
                style={darkDatePickerStyle}
                suffixIcon={<IoCalendarOutline color="#fff" size={24} />}
                allowClear={{
                  clearIcon: (
                    <IoMdClose
                      color="#fff"
                      size={24}
                      style={{ marginTop: 8 }}
                    />
                  ),
                }}
              />
              <Typography marginTop={3} marginLeft={0.5} marginBottom={1}>
                Fecha de finalización:
              </Typography>
              <DatePicker
                value={dayjs(tournament.endDate.toDate())}
                onChange={handleEndDateChange}
                disabledDate={(current) =>
                  current &&
                  current.isBefore(dayjs(tournament.startDate.toDate()))
                }
                format="DD-MM-YYYY"
                style={darkDatePickerStyle}
                suffixIcon={<IoCalendarOutline color="#fff" size={24} />}
                allowClear={{
                  clearIcon: (
                    <IoMdClose
                      color="#fff"
                      size={24}
                      style={{ marginTop: 8 }}
                    />
                  ),
                }}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                loading={loading}
                style={{ marginTop: 24 }}
              >
                {loading ? "Añadiendo..." : "Añadir Torneo"}
              </LoadingButton>
            </form>
          </Box>
        </BlurBoxContainer>
      </Container>
    </ContainerWithBackground>
  );
};

export default AddTournament;
