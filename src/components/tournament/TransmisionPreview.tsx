import React from "react";
import { Typography, Box, Container, Card } from "@mui/material";
import { Tournament, Team, MatchProgramSet } from "../../interfaces/interfaces";
import Grid from "@mui/material/Grid2";

interface Props {
  tournament: Tournament;
  matchesProgram: MatchProgramSet[][];
  roundDate: Date;
  roundName: string;
  selectedRound: number;
  isFinal?: boolean;
}

interface MatchProgramDisplayProps {
  matchProgram: MatchProgramSet;
  matchNumber: number;
  teamA: Team;
  teamB: Team;
}

const MatchProgramDisplay: React.FC<MatchProgramDisplayProps> = ({
  matchProgram,
  matchNumber,
  teamA,
  teamB,
}) => {
  const matchDate = matchProgram.dateTime?.toDate() || new Date();

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <Card elevation={3} style={{ padding: "10px", marginBottom: "10px" }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="body1">
            {matchNumber}. {teamA.name} <strong>vs</strong> {teamB.name}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Typography>
            {matchProgram.dateTime ? formatTime(matchDate) : "TBD"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <Typography>
              {matchProgram.online ? "TRANS." : "OFFLINE"}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

const TransmisionPreview: React.FC<Props> = ({
  tournament,
  matchesProgram,
  roundDate,
  roundName,
  selectedRound,
  isFinal = false,
}) => {
  const matchPrograms = matchesProgram[selectedRound];

  const calculateStartingMatchNumber = (roundIdx: number) => {
    let matchCounter = 1;
    for (let i = 0; i < roundIdx; i++) {
      matchCounter += matchesProgram[i]?.length || 0;
    }
    return matchCounter;
  };

  function formatDate(date: Date): string {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  return (
    <Container style={{ textTransform: "uppercase" }}>
      <br />
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h6">
          {roundName} : {formatDate(roundDate)}
        </Typography>

        <br />

        <Grid container spacing={2} direction="column">
          {matchPrograms?.map((matchProgram, matchIdx) => {
            const matchNumber =
              calculateStartingMatchNumber(selectedRound) + matchIdx;
            const match = isFinal
              ? tournament.finalMatch
              : tournament.matches[roundName]?.[matchIdx];

            const teamA =
              match?.teamA ||
              ({
                name: isFinal ? "Ganador Liga 1" : `Ganador Partida ${
                  matchNumber - matchPrograms.length * 2 + matchIdx
                }`,
              } as Team);
            const teamB =
              match?.teamB ||
              ({
                name: isFinal ? "Ganador Liga 2" : `Ganador Partida ${
                  matchNumber - matchPrograms.length * 2 + matchIdx + 1
                }`,
              } as Team);

            return (
              <Grid key={`${selectedRound}-${matchIdx}`} size={{ xs: 12 }}>
                <MatchProgramDisplay
                  matchProgram={matchProgram}
                  matchNumber={matchNumber}
                  teamA={teamA}
                  teamB={teamB}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
};

export default TransmisionPreview;
