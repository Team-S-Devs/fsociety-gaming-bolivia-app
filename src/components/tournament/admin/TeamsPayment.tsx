import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { BiExpand } from "react-icons/bi";
import { Tournament } from "../../../interfaces/interfaces";
import Grid from "@mui/material/Grid2";
import { LoadingButton } from "@mui/lab";
import styles from "../../../assets/styles/buttons.module.css";

interface TeamsPaymentProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  error: string | null;
  success: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const TeamsPayment: React.FC<TeamsPaymentProps> = ({
  tournament,
  setTournament,
  error,
  success,
  setError,
  submit,
}) => {
  const [teamSearch, setTeamSearch] = useState<string>("");
  const [playerSearch, setPlayerSearch] = useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [expandedPaid, setExpandedPaid] = useState<string | false>(false);
  const [expandedNotPaid, setExpandedNotPaid] = useState<string | false>(false);

  const handleChangePaid =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPaid(isExpanded ? panel : false);
    };

  const handleChangeNotPaid =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedNotPaid(isExpanded ? panel : false);
    };

  const handlePaymentToggle = (teamIndex: number, playerIndex: number) => {
    const updatedTeams = [...tournament.teams];
    const player = updatedTeams[teamIndex].members[playerIndex];
    player.payment = !player.payment;
    player.paidAt = player.payment ? Timestamp.now() : "not-paid";
    setTournament({ ...tournament, teams: updatedTeams });
  };

  const handleMarkAllAsPaid = (teamIndex: number) => {
    const updatedTeams = [...tournament.teams];
    updatedTeams[teamIndex].members.forEach((player) => {
      player.payment = true;
      player.paidAt = Timestamp.now();
    });
    setTournament({ ...tournament, teams: updatedTeams });
  };

  const timestampToDate = (firebaseTimestamp: Timestamp) => {
    try {
      const date = firebaseTimestamp.toDate();

      const formattedDate = date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return formattedDate;
    } catch (e) {
      return "";
    }
  };

  const rendermembers = (teamIndex: number, members: any[]) => (
    <>
      {members
        .filter(
          (player) =>
            player.user.nickname
              .toLowerCase()
              .includes(playerSearch.toLowerCase()) ||
            player.user.email.toLowerCase().includes(playerSearch.toLowerCase())
        )
        .map((player, playerIndex) => (
          <div
            style={{
              borderWidth: 1,
              borderRadius: 20,
              borderColor: "white",
              borderStyle: "solid",
              padding: 10,
              marginBottom: 10,
            }}
            key={player.id}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{player.user.nickname}</Typography>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{player.user.email}</Typography>
              </Grid>
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>{player.user.phone}</Typography>
              </Grid>
              <Divider />
              <Grid size={{ md: 6, xs: 12 }}>
                <Typography>
                  Se unió el {timestampToDate(player.joinedAt)}
                </Typography>
              </Grid>
              {player.payment && (
                <Grid size={{ md: 6, xs: 12 }}>
                  <Typography>
                    Pagó el {timestampToDate(player.paidAt)}
                  </Typography>
                </Grid>
              )}
              <Divider />

              <Grid size={{ md: 6, xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={player.payment}
                      onChange={() =>
                        handlePaymentToggle(teamIndex, playerIndex)
                      }
                      color="secondary"
                    />
                  }
                  label="Pagado"
                />
              </Grid>
            </Grid>
          </div>
        ))}
    </>
  );

  const filterTeams = (team: any) => {
    const teamMatches = team.name
      .toLowerCase()
      .includes(teamSearch.toLowerCase());

    const hasMatchingPlayer = team.members.some(
      (player: any) =>
        player.user.nickname
          .toLowerCase()
          .includes(playerSearch.toLowerCase()) ||
        player.user.email.toLowerCase().includes(playerSearch.toLowerCase())
    );

    return teamMatches && hasMatchingPlayer;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    try {
      await submit(e);
    } catch (error) {
      setError("Error al enviar el formulario. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div>
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

      <form onSubmit={handleSubmit}>
        <TextField
          label="Buscar equipo por nombre"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={teamSearch}
          onChange={(e) => setTeamSearch(e.target.value)}
        />

        <TextField
          label="Buscar jugador por nickname o email"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 4 }}
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
        />

        <Typography variant="h6">
          Equipos con Todos los Jugadores Pagados
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {tournament.teams
          .filter(
            (team) =>
              team.members.every((player) => player.payment) &&
              filterTeams(team)
          )
          .map((team, teamIndex) => (
            <Accordion
              key={team.name + teamIndex}
              style={{ background: "#3b3e8f" }}
              expanded={expandedPaid === `paid${teamIndex}`}
              onChange={handleChangePaid(`paid${teamIndex}`)}
            >
              <AccordionSummary expandIcon={<BiExpand />}>
                <Typography>{team.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {rendermembers(teamIndex, team.members)}
              </AccordionDetails>
            </Accordion>
          ))}

        <Divider sx={{ marginBottom: 2 }} />

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Equipos con Jugadores Pendientes de Pago
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {tournament.teams
          .filter(
            (team) =>
              team.members.some((player) => !player.payment) &&
              filterTeams(team)
          )
          .map((team, teamIndex) => (
            <Accordion
              key={team.name + teamIndex}
              style={{ background: "#3b3e8f" }}
              expanded={expandedNotPaid === `paid${teamIndex}`}
              onChange={handleChangeNotPaid(`paid${teamIndex}`)}
            >
              <AccordionSummary expandIcon={<BiExpand />}>
                <Typography>{team.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {rendermembers(teamIndex, team.members)}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleMarkAllAsPaid(teamIndex)}
                  sx={{ marginTop: 2 }}
                >
                  Marcar a todos como pagados
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
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
          Guardar
        </LoadingButton>
      </form>
    </div>
  );
};

export default TeamsPayment;
