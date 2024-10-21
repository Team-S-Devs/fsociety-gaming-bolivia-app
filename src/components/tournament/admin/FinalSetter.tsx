import React, { useEffect } from "react";
import { Team, Tournament } from "../../../interfaces/interfaces";
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { v4 } from "uuid";
import dayjs, { Dayjs } from "dayjs";
import CustomNumberInput from "../../inputs/CustomNumberInput";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Timestamp } from "firebase/firestore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface FinalSetterProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
}

const noTeam: Team = {
  id: "no-team",
  name: "SIN EQUIPO",
  captainId: "",
  code: "",
  banner: {
    url: "",
    ref: "",
  },
  members: [],
};

const FinalSetter: React.FC<FinalSetterProps> = ({
  tournament,
  setTournament,
}) => {
  useEffect(() => {
    if (tournament.teamWinnerId && tournament.teamLeagueTwoWinnerId) {
      setTournament((prev) => ({
        ...prev,
        finalMatch: {
          id: tournament.finalMatch?.id ?? v4(),
          scoreA: tournament.finalMatch?.scoreA ?? "",
          scoreB: tournament.finalMatch?.scoreB ?? "",
          teamA:
            tournament.teams.find(
              (team) => team.id === tournament.teamWinnerId
            ) ?? noTeam,
          teamB:
            tournament.teams.find(
              (team) => team.id === tournament.teamLeagueTwoWinnerId
            ) ?? noTeam,
          played: tournament.finalMatch?.played ?? false,
        },
      }));
    }
  }, [tournament.teamWinnerId, tournament.teamLeagueTwoWinnerId]);

  const handleMatchTimeChange = (date: Dayjs | null) => {
    if (date) {
      const dateObj = date.toDate();
      const tournamentTmp = { ...tournament };
      if (tournamentTmp.finalProgram)
        tournamentTmp.finalProgram.dateTime = Timestamp.fromDate(dateObj);
    }
  };

  const handleSetScore = (score: number, scoreType: "scoreA" | "scoreB") => {
    const tournamentTmp = { ...tournament };
    if (tournamentTmp.finalMatch)
      tournamentTmp.finalMatch[scoreType] = score.toString();
    setTournament(tournamentTmp);
  };

  const match = tournament.finalMatch;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {tournament.finalMatch && match && (
        <Paper sx={{ padding: 2, marginBottom: 2, background: "#3b3e8f" }}>
          <Typography variant="h4">FINAL</Typography>
          <br />
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
              <CustomNumberInput
                aria-label=""
                placeholder=""
                value={Number(match.scoreA)}
                onChange={(e, val) => {
                  e.preventDefault();
                  if (val) handleSetScore(val, "scoreA");
                }}
              />
            </Grid>
            <Grid size={{ xs: 5 }}>
              <Typography>{match.teamB.name} Puntaje:</Typography>
              <CustomNumberInput
                aria-label=""
                placeholder=""
                value={Number(match.scoreB)}
                onChange={(e, val) => {
                  e.preventDefault();
                  if (val) handleSetScore(val, "scoreB");
                }}
              />
            </Grid>
            <Grid size={{ xs: 10 }}>
              <br />
              <DateTimePicker
                label="Hora"
                value={dayjs(
                  tournament.finalProgram?.dateTime.toDate() ?? new Date()
                )}
                onChange={handleMatchTimeChange}
              />
              <br />
            </Grid>
          </Grid>
        </Paper>
      )}
    </LocalizationProvider>
  );
};

export default FinalSetter;
