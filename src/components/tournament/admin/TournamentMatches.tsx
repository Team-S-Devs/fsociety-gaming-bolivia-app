import React, { useState } from "react";
import { Button, Typography, Select, MenuItem, Paper } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import Grid from "@mui/material/Grid2";
import { Match, Team, Tournament } from "../../../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import styles from "../../../assets/styles/buttons.module.css";

/* const mockTeams: Team[] = [
  {
    id: "1",
    name: "Team Alpha",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
  {
    id: "2",
    name: "Team Beta",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
  {
    id: "3",
    name: "Team Gamma",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
  {
    id: "4",
    name: "Team Delta",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
  {
    id: "5",
    name: "Team Epsilon",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
  {
    id: "6",
    name: "Team Zeta",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
  {
    id: "7",
    name: "Team Eta",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
  {
    id: "8",
    name: "Team Theta",
    captainId: "",
    code: "",
    banner: { ref: "", url: "" },
    members: [],
  },
]; */

interface TournamentBracketsProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  error: string | null;
  success: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const TournamentBrackets: React.FC<TournamentBracketsProps> = ({
  tournament,
  setTournament,
  error,
  success,
  setError,
  submit,
}) => {
  const [rounds, setRounds] = useState<Match[][]>(tournament.matches);
  const initialTeams = tournament.teams.filter((team) =>
    team.members.every((member) => member.payment)
  );
  const [remainingTeams, setRemainingTeams] = useState<Team[]>(initialTeams);
  const [selectedTeamA, setSelectedTeamA] = useState<string>("");
  const [selectedTeamB, setSelectedTeamB] = useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const addManualMatch = () => {
    if (selectedTeamA && selectedTeamB && selectedTeamA !== selectedTeamB) {
      const teamA = remainingTeams.find((team) => team.id === selectedTeamA);
      const teamB = remainingTeams.find((team) => team.id === selectedTeamB);

      if (teamA && teamB) {
        const newMatch: Match = {
          id: uuidv4(),
          teamA,
          teamB,
          winner: "no-winner",
        };

        const updatedRounds = [...rounds];
        const currentRound = updatedRounds[updatedRounds.length - 1] || [];
        currentRound.push(newMatch);

        updatedRounds[updatedRounds.length - 1] = currentRound;
        setRounds(updatedRounds);
        setRemainingTeams(
          remainingTeams.filter(
            (team) => team.id !== teamA.id && team.id !== teamB.id
          )
        );

        setSelectedTeamA("");
        setSelectedTeamB("");
      }
    }
  };

  const generateRandomMatch = () => {
    const shuffledTeams = [...remainingTeams].sort(() => Math.random() - 0.5);
    if (shuffledTeams.length >= 2) {
      const teamA = shuffledTeams[0];
      const teamB = shuffledTeams[1];

      const newMatch: Match = {
        id: uuidv4(),
        teamA,
        teamB,
        winner: "no-winner",
      };

      const updatedRounds = [...rounds];
      const currentRound = updatedRounds[updatedRounds.length - 1] || [];
      currentRound.push(newMatch);

      updatedRounds[updatedRounds.length - 1] = currentRound;
      setRounds(updatedRounds);
      setRemainingTeams(
        remainingTeams.filter(
          (team) => team.id !== teamA.id && team.id !== teamB.id
        )
      );
    }
  };

  const setWinner = (matchId: string, roundIndex: number, winnerId: string) => {
    const updatedRounds = [...rounds];
    const currentRound = updatedRounds[roundIndex];

    const updatedMatch = currentRound.find((match) => match.id === matchId);
    if (updatedMatch) {
      updatedMatch.winner =
        initialTeams.find((team) => team.id === winnerId) || "no-winner";

      if (currentRound.every((match) => match.winner !== "no-winner")) {
        const nextRound = generateNextRound(currentRound);
        if (nextRound.length > 0) {
          updatedRounds.push(nextRound);
        }
      }

      setRounds(updatedRounds);
    }
  };

  const generateNextRound = (currentRound: Match[]): Match[] => {
    if (currentRound.some((match) => match.winner == "no-winner")) return [];
    const winners: Team[] = currentRound
      .map((match) => match.winner)
      .filter((winner) => winner !== "no-winner") as Team[];

    const nextRound: Match[] = [];

    for (let i = 0; i < winners.length; i += 2) {
      if (winners[i + 1]) {
        const teamA = winners[i];
        const teamB = winners[i + 1];
        nextRound.push({
          id: uuidv4(),
          teamA,
          teamB,
          winner: "no-winner",
        });
      }
    }

    setRemainingTeams(winners);
    return nextRound;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTournament((prev) => ({ ...prev, matches: rounds }));

    setLoading(true);
    setError(null);
    try {
      await submit(e);
    } catch (error) {
      setError("Error al enviar el formulario. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const renderMatch = (match: Match, roundIndex: number) => (
    <Paper
      key={match.id}
      sx={{ padding: 2, marginBottom: 2, background: "#3b3e8f" }}
    >
      <Grid container alignItems="center">
        <Grid size={{ xs: 4 }}>
          <Typography>{match.teamA.name}</Typography>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography align="center">vs</Typography>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography>{match.teamB.name}</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
        <Select
          value={(match.winner !== "no-winner" && match.winner?.id) || ""}
          onChange={(e) =>
            setWinner(match.id, roundIndex, e.target.value as string)
          }
          displayEmpty
        >
          <MenuItem value="">Seleccionar Ganador</MenuItem>
          <MenuItem value={match.teamA.id}>{match.teamA.name}</MenuItem>
          <MenuItem value={match.teamB.id}>{match.teamB.name}</MenuItem>
        </Select>
      </Grid>
      {match.winner && (
        <Typography align="center" sx={{ marginTop: 2 }}>
          Ganador: {match.winner !== "no-winner" && match.winner.name}
        </Typography>
      )}
    </Paper>
  );

  const renderRounds = () => {
    if (rounds.length === 0) {
      return <Typography>No hay enfrentamientos creados aún.</Typography>;
    }

    return rounds.map((round, roundIndex) => (
      <div key={`round-${roundIndex}`}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Ronda {roundIndex + 1}
        </Typography>
        {round.map((match) => renderMatch(match, roundIndex))}
      </div>
    ));
  };

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Enfrentamientos del Torneo
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

      <form onSubmit={handleSubmit}>
        {rounds.length === 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setRounds([[]])}
            sx={{ marginBottom: 2 }}
          >
            Iniciar Primera Ronda
          </Button>
        )}

        {rounds.length > 0 && remainingTeams.length > 1 && (
          <div>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Añadir Enfrentamiento en Ronda {rounds.length}
            </Typography>

            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid size={{ xs: 5 }}>
                <Select
                  fullWidth
                  value={selectedTeamA}
                  onChange={(e) => setSelectedTeamA(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Seleccionar Equipo A</MenuItem>
                  {remainingTeams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid size={{ xs: 5 }}>
                <Select
                  fullWidth
                  value={selectedTeamB}
                  onChange={(e) => setSelectedTeamB(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Seleccionar Equipo B</MenuItem>
                  {remainingTeams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid size={{ xs: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={addManualMatch}
                  disabled={!selectedTeamA || !selectedTeamB}
                >
                  Añadir
                </Button>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="secondary"
              onClick={generateRandomMatch}
              disabled={remainingTeams.length < 2}
            >
              Generar Enfrentamiento Aleatorio
            </Button>
          </div>
        )}

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

      <div>{renderRounds()}</div>
    </div>
  );
};

export default TournamentBrackets;
