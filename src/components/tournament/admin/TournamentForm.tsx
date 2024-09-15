import React from "react";
import { TextField, Typography, Box, MenuItem, Switch } from "@mui/material";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { IoCalendarOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Tournament } from "../../../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import { Timestamp } from "firebase/firestore";
import { modalities } from "../../../interfaces/enumsData";
import AwardsForm from "./AwardsForm";
import Grid from "@mui/material/Grid2";
import FileUpload from "../../inputs/FileUpload";
import styles from "../../../assets/styles/buttons.module.css";

const darkDatePickerStyle = {
  backgroundColor: "transparent",
  color: "#fff",
  borderColor: "#fff",
  height: 56,
  width: "100%",
  fontSize: 40,
};

interface TournamentFormProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  error: string | null;
  success: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  isEditing?: boolean;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  tournament,
  setTournament,
  submit,
  error,
  setError,
  success,
  title,
  file,
  setFile,
  setSuccess,
  isEditing = false,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [teamLimitError, setTeamLimitError] = React.useState<string | null>(
    null
  );
  const [priceError, setPriceError] = React.useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "inscriptionPrice" ||
      name === "participants" ||
      name === "teamLimit"
        ? Number(value) == 0
          ? ""
          : Number(value)
        : value;

    setTournament({
      ...tournament,
      [name]: parsedValue,
    });
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
      const dateObj = date.toDate();
      dateObj.setHours(23, 59, 59, 999);
      setTournament((prevTournament) => ({
        ...prevTournament,
        endDate: Timestamp.fromDate(dateObj),
      }));
    }
  };

  const validateFields = (): boolean => {
    if (
      !tournament.name ||
      !tournament.inscriptionPrice ||
      !tournament.participants ||
      !tournament.teamLimit
    ) {
      setError("Por favor, rellena todos los campos.");
      return false;
    }

    if (
      isNaN(tournament.inscriptionPrice) ||
      tournament.inscriptionPrice <= 0
    ) {
      setPriceError("El precio de inscripción debe ser un número positivo.");
      return false;
    }

    if (isNaN(tournament.teamLimit) || tournament.teamLimit <= 0) {
      setTeamLimitError("El límite por equipo debe ser un número positivo.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFields()) return;

    setLoading(true);
    setError(null);
    try {
      await submit(e);
    } catch (error) {
      setError("Error al enviar el formulario. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const clearSuccessMessageWhenChange = () => {
    if (success) setSuccess(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
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

      <form onSubmit={handleSubmit} onChange={clearSuccessMessageWhenChange}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <Typography>Activo:</Typography>
          <Switch
            checked={
              tournament.active && new Date() < tournament.endDate.toDate()
            }
            onChange={() =>
              setTournament((prev) => ({ ...prev, active: !prev.active }))
            }
            color="secondary"
            disabled={new Date() > tournament.endDate.toDate()}
          />
        </div>

        <TextField
          fullWidth
          margin="normal"
          name="name"
          value={tournament.name}
          onChange={handleInputChange}
          placeholder="Nombre del torneo"
          label="Nombre"
          required
        />

        <TextField
          label="Descripción"
          name="description"
          placeholder="Descripción del torneo"
          value={tournament.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={5}
          margin="normal"
          required
        />
        <div style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 6 }}>
              <TextField
                fullWidth
                margin="normal"
                name="inscriptionPrice"
                value={tournament.inscriptionPrice}
                onChange={handleInputChange}
                placeholder="Precio de inscripción en Bs"
                label="Precio de inscripción (Bs)"
                type="number"
                required
                error={!!priceError}
                helperText={priceError}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 6 }}>
              <TextField
                fullWidth
                margin="normal"
                name="teamLimit"
                value={tournament.teamLimit}
                onChange={handleInputChange}
                placeholder="Límite por equipos"
                label="Límite de jugadores por equipo"
                type="number"
                required
                error={!!teamLimitError}
                helperText={teamLimitError}
              />
            </Grid>
          </Grid>
        </div>

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
              <IoMdClose color="#fff" size={24} style={{ marginTop: 8 }} />
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
            current && current.isBefore(dayjs(tournament.startDate.toDate()))
          }
          format="DD-MM-YYYY"
          style={darkDatePickerStyle}
          suffixIcon={<IoCalendarOutline color="#fff" size={24} />}
          allowClear={{
            clearIcon: (
              <IoMdClose color="#fff" size={24} style={{ marginTop: 8 }} />
            ),
          }}
        />
        <div style={{ marginTop: 24 }}>
          <Typography>Banner del torneo:</Typography>
          <FileUpload
            setFile={setFile}
            file={file}
            imgUrl={tournament.imagePath.url}
          />
        </div>
        <AwardsForm tournament={tournament} setTournament={setTournament} />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          loading={loading}
          className={styles.continueButton}
          style={{ marginTop: 24 }}
        >
          {isEditing
            ? loading
              ? "Editando..."
              : "Editar Torneo"
            : loading
            ? "Creando..."
            : "Crear Torneo"}
        </LoadingButton>
      </form>
    </Box>
  );
};

export default TournamentForm;
