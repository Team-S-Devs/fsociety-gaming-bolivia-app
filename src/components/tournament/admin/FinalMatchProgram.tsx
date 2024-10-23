import React, { useEffect, useState } from "react";
import { Typography, Card, Switch } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { Tournament, MatchProgramSet } from "../../../interfaces/interfaces";
import { Timestamp } from "firebase/firestore";
import Grid from "@mui/material/Grid2";
import TransmisionPreview from "../TransmisionPreview";

interface FinalMatchProgramProps {
  tournament: Tournament;
}

const FinalMatchProgram: React.FC<FinalMatchProgramProps> = ({
  tournament,
}) => {
  const [matchProgram, setMatchProgram] = useState<MatchProgramSet>({
    dateTime: Timestamp.now(),
    online: true,
  });

  useEffect(() => {
    if (tournament.finalProgram) setMatchProgram(tournament.finalProgram);
  }, [tournament]);

  const handleDateTimeChange = (newDate: Dayjs | null) => {
    if (newDate) {
      const date = newDate.toDate() ?? new Date();
      setMatchProgram((prev) => ({
        ...prev,
        dateTime: Timestamp.fromDate(date),
      }));
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatchProgram((prev) => ({ ...prev, online: event.target.checked }));
  };

  const teamA = tournament.finalMatch?.teamA.name ?? "Ganador Liga 1";
  const teamB = tournament.finalMatch?.teamB.name ?? "Ganador Liga 2";

  return (
    <div>
      <Card elevation={3} style={{ padding: "10px", marginBottom: "10px" }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="body1">
              FINAL. {teamA} <strong>vs</strong> {teamB}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <DateTimePicker
              label="Fecha y Hora:"
              value={dayjs(matchProgram.dateTime.toDate())}
              onChange={handleDateTimeChange}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <Typography>Trans:</Typography>
              <Switch
                checked={matchProgram.online}
                color="secondary"
                onChange={handleSwitchChange}
              />
            </div>
          </Grid>
        </Grid>
      </Card>
      <TransmisionPreview
        matchesProgram={[[matchProgram]]}
        tournament={tournament}
        roundDate={matchProgram.dateTime.toDate()}
        roundName={"FINAL"}
        selectedRound={0}
        isFinal
      />
    </div>
  );
};

export default FinalMatchProgram;
