import React, { useEffect, useState } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
  Switch,
  TextField,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import {
  Tournament,
  Team,
  MatchProgramSet,
} from "../../../interfaces/interfaces";
import { Timestamp } from "firebase/firestore";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { v4 } from "uuid";
import Grid from "@mui/material/Grid2";
import TransmisionPreview from "../TransmisionPreview";

interface Props {
  tournament: Tournament;
  leagueType: "leagueOne" | "leagueTwo";
  roundKeys: string[];
  setRoundKeys: React.Dispatch<React.SetStateAction<string[]>>;
  matchesProgram: MatchProgramSet[][];
  setMatchesProgram: React.Dispatch<React.SetStateAction<MatchProgramSet[][]>>;
}

interface MatchProgramDisplayProps {
  matchProgram: MatchProgramSet;
  matchNumber: number;
  teamA: Team;
  teamB: Team;
  onTimeChange: (newTime: Date | null, matchId: string) => void;
  onSwitchChange: (matchNumber: number, online: boolean) => void;
}

const MatchProgramDisplay: React.FC<MatchProgramDisplayProps> = ({
  matchProgram,
  matchNumber,
  teamA,
  teamB,
  onTimeChange,
  onSwitchChange,
}) => {
  const matchDate = matchProgram.dateTime?.toDate() || new Date();

  const handleTimeChange = (newTime: Dayjs | null) => {
    onTimeChange(newTime?.toDate() ?? new Date(), matchNumber.toString());
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSwitchChange(matchNumber, event.target.checked);
  };

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
          <TimePicker
            label="Hora:"
            value={dayjs(matchDate)}
            onChange={handleTimeChange}
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
  );
};

const ViewTournamentMatches: React.FC<Props> = ({
  tournament,
  leagueType,
  roundKeys,
  setRoundKeys,
  matchesProgram,
  setMatchesProgram,
}) => {
  const [roundDates, setRoundDates] = useState<Date[]>([]);
  const [selectedRound, setSelectedRound] = useState(0);

  const selectedLeague =
    leagueType === "leagueOne"
      ? tournament.matches
      : tournament.matchesLeagueTwo;

  const selectedProgram =
    leagueType === "leagueOne"
      ? tournament.matchesProgram
      : tournament.matchesLeagueTwoProgram;

  const generateNextRound = () => {
    const maxMatchesLength = Math.min(
      ...Object.values(matchesProgram).map((round) => round.length)
    );

    const roundNames: string[] = [...roundKeys];
    const generatedProgram = [...matchesProgram];

    const currentRoundsLength = Object.keys(matchesProgram ?? {}).length;

    if (maxMatchesLength > 1) {
      const nextRoundKey = `Ronda ${currentRoundsLength + 1}`;
      const nextRound = Array(Math.floor(maxMatchesLength / 2)).fill({
        dateTime: Timestamp.fromDate(new Date()),
        online: false,
        id: v4(),
      });

      generatedProgram.push(nextRound);
      roundNames.push(nextRoundKey);
      setRoundKeys(roundNames);
      setMatchesProgram(generatedProgram);
    }

    return { generatedProgram, roundNames };
  };

  useEffect(() => {
    const generateMatchesProgram = () => {
      const roundNames: string[] = [];
      const matchesNamesInProgram = Object.keys(selectedProgram ?? {}).sort(
        (a, b) => selectedProgram[b].length - selectedProgram[a].length
      );

      const selectedProcess =
        Object.keys(selectedLeague).length > Object.keys(selectedProgram).length
          ? selectedLeague
          : selectedProgram;

      const generatedProgram: MatchProgramSet[][] = Object.keys(
        selectedProcess ?? {}
      )
        .sort((a, b) => selectedProcess[b].length - selectedProcess[a].length)
        .map((roundKey) => {
          roundNames.push(roundKey);
          return selectedProcess[roundKey]?.map((_match, idx: number) => {
            const existingProgram = selectedProgram?.[roundKey]?.[idx];

            return {
              dateTime:
                existingProgram?.dateTime || Timestamp.fromDate(new Date()),
              online: existingProgram?.online || false,
              id: existingProgram?.id || "",
            };
          });
        });

      setMatchesProgram(generatedProgram);
      setRoundKeys(
        roundNames.length > matchesNamesInProgram.length
          ? roundNames
          : matchesNamesInProgram
      );
    };

    generateMatchesProgram();
  }, [tournament.matches, tournament.matchesProgram, leagueType]);

  useEffect(() => {
    setRoundDates(
      matchesProgram.map((round) => round[0].dateTime.toDate() || new Date())
    );
  }, [matchesProgram]);

  const handleTimeChange = (newTime: Date | null, matchId: string) => {
    if (!newTime) return;
    const updatedProgram = matchesProgram.map((round) =>
      round.map((matchProgram, idx) => {
        if (idx === parseInt(matchId)) {
          const updatedDate = new Date(
            matchProgram.dateTime.toDate() || new Date()
          );
          updatedDate.setHours(newTime.getHours(), newTime.getMinutes());
          return {
            ...matchProgram,
            dateTime: Timestamp.fromDate(updatedDate),
          };
        }
        return matchProgram;
      })
    );
    setMatchesProgram(updatedProgram);
  };

  const handleSwitchChange = (
    matchNumber: number,
    online: boolean,
    matchIdx: number
  ) => {
    const updatedMatchesProgram = [...matchesProgram];
    updatedMatchesProgram[matchIdx][matchNumber].online = online;
    setMatchesProgram(updatedMatchesProgram);
  };

  const calculateStartingMatchNumber = (roundIdx: number) => {
    let matchCounter = 1;
    for (let i = 0; i < roundIdx; i++) {
      matchCounter += matchesProgram[i]?.length || 0;
    }
    return matchCounter;
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Transmisión de partidas
      </Typography>

      <Tabs
        value={selectedRound}
        onChange={(_event, newValue) => setSelectedRound(newValue)}
        aria-label="match rounds"
        variant="scrollable"
      >
        {roundKeys.map((roundKey, index) => (
          <Tab key={index} label={roundKey} />
        ))}
      </Tabs>

      <br />
      <Box sx={{ padding: "20px" }}>
        <TextField
          label="Nombre de ronda"
          type="text"
          placeholder="Eg: Cuartos de final"
          value={
            roundKeys[selectedRound] != undefined
              ? roundKeys[selectedRound]
              : `Ronda ${selectedRound + 1}`
          }
          onChange={(e) => {
            const roundsNamesC = [...roundKeys];
            roundsNamesC[selectedRound] = e.target.value;
            setRoundKeys(roundsNamesC);
          }}
        />

        <DatePicker
          label="Fecha"
          value={dayjs(roundDates[selectedRound])}
          onChange={(newDate) => {
            const updatedDates = [...roundDates];
            if (newDate) updatedDates[selectedRound] = newDate.toDate();
            setRoundDates(updatedDates);
          }}
        />

        <br />
        <br />
        <br />

        <Grid container spacing={2} direction="column">
          {matchesProgram[selectedRound]?.map((matchProgram, matchIdx) => {
            const programCurr = matchesProgram[selectedRound];
            const matchNumber =
              calculateStartingMatchNumber(selectedRound) + matchIdx;
            const match =
              tournament.matches[roundKeys[selectedRound]]?.[matchIdx];

            const teamA =
              match?.teamA ||
              ({
                name: `Ganador Partida ${
                  matchNumber - programCurr.length * 2 + matchIdx
                }`,
              } as Team);
            const teamB =
              match?.teamB ||
              ({
                name: `Ganador Partida ${
                  matchNumber - programCurr.length * 2 + matchIdx + 1
                }`,
              } as Team);

            return (
              <Grid key={`${selectedRound}-${matchIdx}`} size={{ xs: 12 }}>
                <MatchProgramDisplay
                  matchProgram={matchProgram}
                  matchNumber={matchNumber}
                  teamA={teamA}
                  teamB={teamB}
                  onTimeChange={handleTimeChange}
                  onSwitchChange={(_matchNumber: number, online: boolean) =>
                    handleSwitchChange(matchIdx, online, selectedRound)
                  }
                />
              </Grid>
            );
          })}
        </Grid>

        {matchesProgram.length > 0 && (
          <Button
            onClick={generateNextRound}
            color="secondary"
            variant="outlined"
          >
            Mostrar siguiente ronda
          </Button>
        )}

        <br />
      </Box>
      <TransmisionPreview
        selectedRound={selectedRound}
        tournament={tournament}
        roundName={roundKeys[selectedRound]}
        roundDate={roundDates[selectedRound] ?? new Date()}
        matchesProgram={matchesProgram}
      />
    </div>
  );
};

export default ViewTournamentMatches;
