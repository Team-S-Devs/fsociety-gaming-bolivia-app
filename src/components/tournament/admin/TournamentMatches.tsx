import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Select,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import {
  Bracket,
  Seed,
  SeedItem,
  SeedTeam,
  IRoundProps as RoundProps,
} from "react-brackets";
import Grid from "@mui/material/Grid2";
import { Match, Team, Tournament } from "../../../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import styles from "../../../assets/styles/buttons.module.css";
import { calculateRoundsNumber } from "../../../utils/methods";

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
  const matches = Object.keys(tournament.matches)
    .sort()
    .map((key) => tournament.matches[key]);
  const [rounds, setRounds] = useState<Match[][]>(matches);
  const initialTeams = tournament.teams.filter((team) =>
    team.members.every((member) => member.payment)
  );
  const [remainingTeams, setRemainingTeams] = useState<Team[]>([]);
  const [selectedTeamA, setSelectedTeamA] = useState<string>("");
  const [selectedTeamB, setSelectedTeamB] = useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (matches.length === 0) setRemainingTeams(initialTeams);
    else {
      const teams = matches[matches.length - 1]
        .map((match) => [match.teamA, match.teamB])
        .flat();
      setRemainingTeams(initialTeams.filter((team) => !teams.includes(team)));
    }
  }, [tournament.matches]);

  const addManualMatch = () => {
    if (selectedTeamA && selectedTeamB && selectedTeamA !== selectedTeamB) {
      const teamA = remainingTeams.find((team) => team.id === selectedTeamA);
      const teamB = remainingTeams.find((team) => team.id === selectedTeamB);

      if (teamA && teamB) {
        const newMatch: Match = {
          id: uuidv4(),
          teamA,
          teamB,
          scoreA: "",
          scoreB: "",
          played: false,
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
        scoreA: "",
        scoreB: "",
        played: false,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roundsObj = rounds.reduce((acc, curr, index) => {
      acc[`round${index}`] = curr;
      return acc;
    }, {} as Record<string, Match[]>);

    setTournament((prev) => ({ ...prev, matches: roundsObj }));

    setLoading(true);
    setError(null);
    try {
      await submit(e);
    } catch (error) {
      setError("Error al enviar el formulario. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const generateNextRound = (currentRound: Match[]): Match[] => {
    const winners: Team[] = currentRound
      .filter((match) => match.played)
      .map((match) => {
        const scoreA = parseInt(match.scoreA);
        const scoreB = parseInt(match.scoreB);
        return scoreA > scoreB ? match.teamA : match.teamB;
      });

    const nextRound: Match[] = [];

    for (let i = 0; i < winners.length; i += 2) {
      if (winners[i + 1]) {
        const teamA = winners[i];
        const teamB = winners[i + 1];
        nextRound.push({
          id: uuidv4(),
          teamA,
          teamB,
          scoreA: "",
          scoreB: "",
          played: false,
        });
      }
    }

    return nextRound;
  };

  const setScore = (
    matchId: string,
    roundIndex: number,
    scoreType: "scoreA" | "scoreB",
    score: string
  ) => {
    const updatedRounds = [...rounds];
    const currentRound = updatedRounds[roundIndex];

    const updatedMatch = currentRound.find((match) => match.id === matchId);
    if (updatedMatch) {
      updatedMatch[scoreType] = score;
      updatedMatch.played =
        updatedMatch.scoreA !== "" && updatedMatch.scoreB !== "";

      const allMatchesPlayed = currentRound.every((match) => match.played);

      if (allMatchesPlayed) {
        const nextRound = generateNextRound(currentRound);
        if (
          updatedRounds[roundIndex + 1] &&
          updatedRounds[roundIndex + 1].length > 0
        ) {
          updatedRounds[roundIndex + 1] = nextRound;
          updatedRounds.splice(roundIndex + 2);
        } else if (nextRound.length > 0) {
          updatedRounds.push(nextRound);
        }
      }

      if (
        calculateRoundsNumber(initialTeams.length) === rounds.length &&
        currentRound.length === 1 &&
        updatedMatch.played
      ) {
        setTournament((prev) => ({
          ...prev,
          teamWinnerId:
            updatedMatch.scoreA > updatedMatch.scoreB
              ? currentRound[0].teamA.id ?? ""
              : currentRound[0].teamB.id ?? "",
        }));
      }

      setRounds(updatedRounds);
    }
  };

  const renderMatch = (match: Match, roundIndex: number) => {
    const isPlayed = match.scoreA !== "" && match.scoreB !== "";

    return (
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
        <Grid
          container
          justifyContent="center"
          spacing={1}
          sx={{ marginTop: 2 }}
        >
          <Grid size={{ xs: 5 }}>
            <Typography>{match.teamA.name} Puntaje:</Typography>
            <TextField
              type="text"
              value={match.scoreA}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;
                setScore(match.id, roundIndex, "scoreA", e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 5 }}>
            <Typography>{match.teamB.name} Puntaje:</Typography>
            <TextField
              type="text"
              value={match.scoreB}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;
                setScore(match.id, roundIndex, "scoreB", e.target.value);
              }}
            />
          </Grid>
        </Grid>

        {!isPlayed ? (
          <Typography align="center" sx={{ marginTop: 2 }}>
            Aún no se ha jugado
          </Typography>
        ) : (
          <Typography align="center" sx={{ marginTop: 2 }}>
            Partida jugada
          </Typography>
        )}
      </Paper>
    );
  };

  const renderRounds = () => {
    if (rounds.length === 0) {
      return <Typography>No hay enfrentamientos creados aún.</Typography>;
    }

    return rounds.map((round, roundIndex) => (
      <div key={`round-${roundIndex}`}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {roundIndex + 1 === calculateRoundsNumber(initialTeams.length)
            ? "Final"
            : `Ronda ${roundIndex + 1}`}
        </Typography>
        {round.map((match) => renderMatch(match, roundIndex))}
      </div>
    ));
  };

  const renderCustomSeed = ({
    seed,
    breakpoint,
  }: {
    seed: any;
    breakpoint: number;
  }) => {
    const teamA = seed.teams[0];
    const teamB = seed.teams[1];

    const isTeamAWinner =
      teamA.score !== "" && teamB.score !== "" && teamA.score > teamB.score;
    const isTeamBWinner =
      teamA.score !== "" && teamB.score !== "" && teamB.score > teamA.score;

    const winnerTeam = isTeamAWinner ? teamA : teamB;

    const winnerStyle = {
      backgroundColor:
        tournament.teamWinnerId === winnerTeam.id ? "#31bebe" : "#279090",
      color: "white",
    };
    const loserStyle = { backgroundColor: "#262b3e", color: "white" };
    const neutralStyle = { backgroundColor: "#131533", color: "white" };

    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 16 }}>
        <SeedItem>
          <SeedTeam
            style={
              isTeamAWinner
                ? winnerStyle
                : isTeamBWinner
                ? loserStyle
                : neutralStyle
            }
          >
            <span>{teamA.name}</span>
            <span>{teamA.score}</span>
          </SeedTeam>

          <SeedTeam
            style={
              isTeamBWinner
                ? winnerStyle
                : isTeamAWinner
                ? loserStyle
                : neutralStyle
            }
          >
            <span>{teamB.name}</span>
            <span>{teamB.score}</span>
          </SeedTeam>
        </SeedItem>
      </Seed>
    );
  };

  const renderRoundsBrackets = () => {
    if (rounds.length === 0) {
      return <></>;
    }

    const bracketRounds: RoundProps[] = rounds.map((round, roundIndex) => ({
      title: round.length === 1 ? "FINAL" : `Ronda ${roundIndex + 1}`,
      seeds: round.map((match) => ({
        id: match.id,
        teams: [
          {
            id: match.teamA.id,
            name: match.teamA.name,
            score: match.scoreA || "",
          },
          {
            id: match.teamB.id,
            name: match.teamB.name,
            score: match.scoreB || "",
          },
        ],
      })),
    }));

    return (
      <Bracket rounds={bracketRounds} renderSeedComponent={renderCustomSeed} />
    );
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

            <Grid container spacing={1} sx={{ marginBottom: 2 }}>
              <Grid size={{ sm: 4.5, xs: 6 }}>
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

              <Grid size={{ sm: 4.5, xs: 6 }}>
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

              <Grid size={{ sm: 3, xs: 12 }}>
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

        <br />

        <div>{renderRounds()}</div>

        <br />

        <div>{renderRoundsBrackets()}</div>

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

export default TournamentBrackets;
