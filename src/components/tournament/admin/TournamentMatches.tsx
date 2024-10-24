import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Paper,
  TextField,
  Divider,
  Tabs,
  Tab,
  Autocomplete,
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
import {
  Match,
  MatchProgramSet,
  Team,
  Tournament,
} from "../../../interfaces/interfaces";
import { calculateRoundsNumber } from "../../../utils/methods";
import { Timestamp } from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CustomNumberInput from "../../inputs/CustomNumberInput";
import TeamSelector from "./TeamsSelector";

interface TournamentBracketsProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  leagueType: "leagueOne" | "leagueTwo";
  rounds: Match[][];
  setRounds: React.Dispatch<React.SetStateAction<Match[][]>>;
  matchesProgram: MatchProgramSet[][];
  setMatchesProgram: React.Dispatch<React.SetStateAction<MatchProgramSet[][]>>;
  roundDates: Date[][];
  setRoundDates: React.Dispatch<React.SetStateAction<Date[][]>>;
  roundNames: string[];
  setRoundNames: React.Dispatch<React.SetStateAction<string[]>>;
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

const TournamentBrackets: React.FC<TournamentBracketsProps> = ({
  tournament,
  setTournament,
  leagueType = "leagueOne",
  rounds,
  setRounds,
  roundDates,
  setRoundDates,
  roundNames,
  setRoundNames,
  matchesProgram,
  setMatchesProgram,
}) => {
  const selectedLeague =
    leagueType === "leagueOne"
      ? tournament.matches
      : tournament.matchesLeagueTwo ?? {};

  const selectedProgram =
    leagueType === "leagueOne"
      ? tournament.matchesProgram
      : tournament.matchesLeagueTwoProgram ?? {};

  const paidTeams = tournament.teams.filter(
    (team) =>
      !team.deleted &&
      team.members.every((player) =>
        tournament.paidUsersId.some(
          (paidUser) => paidUser.userId === player.memberId
        )
      )
  );

  const initialTeams =
    leagueType === "leagueOne"
      ? paidTeams
      : tournament.teams.filter((team) =>
          tournament.leagueTwoTeamsIds?.includes(team.id!)
        );

  const [remainingTeams, setRemainingTeams] = useState<Team[]>([]);
  const [selectedTeamA, setSelectedTeamA] = useState<string>("");
  const [selectedTeamB, setSelectedTeamB] = useState<string>("");

  const [selectedRound, setSelectedRound] = useState(0);

  useEffect(() => {
    const matchesNamesInProgram = Object.keys(selectedProgram).sort(
      (a, b) => selectedProgram[b].length - selectedProgram[a].length
    );

    const matchesNames = Object.keys(selectedLeague).sort(
      (a, b) => selectedLeague[b].length - selectedLeague[a].length
    );

    setRoundNames(
      matchesNames.length > matchesNamesInProgram.length
        ? matchesNames
        : matchesNamesInProgram
    );
  }, [tournament]);

  useEffect(() => {
    const matches = Object.keys(selectedLeague)
      .sort((a, b) => selectedLeague[b].length - selectedLeague[a].length)
      .map((key) => selectedLeague[key]);

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
    setRounds(matches);
    setMatchesProgram(generatedProgram);

    if (matches.length === 0) setRemainingTeams(initialTeams);
    else {
      const teams = matches[matches.length - 1]
        .map((match) => [match.teamA, match.teamB])
        .flat();
      setRemainingTeams(
        initialTeams.filter(
          (team) => !teams.some((selectedTeam) => selectedTeam.id === team.id)
        )
      );
    }
  }, [tournament.matches, tournament.matchesLeagueTwo]);

  useEffect(() => {
    setRoundDates(
      matchesProgram.map((round) => {
        return round.map((program) => program.dateTime.toDate() || new Date());
      })
    );
  }, [matchesProgram]);

  const addManualMatch = () => {
    if (selectedTeamA && selectedTeamB && selectedTeamA !== selectedTeamB) {
      const teamA =
        selectedTeamA === "no-team"
          ? noTeam
          : remainingTeams.find((team) => team.id === selectedTeamA);
      const teamB =
        selectedTeamA === "no-team"
          ? noTeam
          : remainingTeams.find((team) => team.id === selectedTeamB);

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
    let updatedRounds = [...rounds];
    const updatedNames = [...roundNames];
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
          updatedNames.splice(roundIndex + 1);
        } else if (nextRound.length > 0) {
          updatedRounds.push(nextRound);
          if (updatedNames.length >= updatedRounds.length)
            updatedNames.push(`Ronda ${updatedRounds.length}`);
        }
      }

      if (
        calculateRoundsNumber(initialTeams.length) === rounds.length &&
        currentRound.length === 1 &&
        updatedMatch.played
      ) {
        if (leagueType === "leagueOne")
          setTournament((prev) => ({
            ...prev,
            teamWinnerId:
              updatedMatch.scoreA > updatedMatch.scoreB
                ? currentRound[0].teamA.id ?? ""
                : currentRound[0].teamB.id ?? "",
          }));
        else
          setTournament((prev) => ({
            ...prev,
            teamLeagueTwoWinnerId:
              updatedMatch.scoreA > updatedMatch.scoreB
                ? currentRound[0].teamA.id ?? ""
                : currentRound[0].teamB.id ?? "",
          }));
      }

      setRounds(updatedRounds);
      setRoundNames(updatedNames);
    }
  };

  const renderMatch = (
    match: Match,
    roundIndex: number,
    matchIndex: number
  ) => {
    const handleMatchTimeChange = (time: Dayjs | null) => {
      if (time) {
        const timeObj = time.toDate();

        const updatedRounds = [...rounds];

        if (matchIndex != -1) {
          const roundDatesTmp = [...roundDates];
          const currentDate = roundDatesTmp[roundIndex][matchIndex];

          const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            timeObj.getHours(),
            timeObj.getMinutes(),
            timeObj.getSeconds()
          );

          roundDatesTmp[roundIndex][matchIndex] = newDate;
          setRoundDates(roundDatesTmp);
        }
        setRounds(updatedRounds);
      }
    };

    return (
      <Paper
        key={match.id + roundIndex.toString() + uuidv4()}
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
            <CustomNumberInput
              aria-label=""
              placeholder=""
              value={Number(match.scoreA)}
              onChange={(e, val) => {
                e.preventDefault();
                setScore(match.id, roundIndex, "scoreA", val?.toString() ?? "");
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
                setScore(match.id, roundIndex, "scoreB", val?.toString() ?? "");
              }}
            />
          </Grid>
          <Grid size={{ xs: 10 }}>
            <br />
            <TimePicker
              label="Hora"
              value={dayjs(
                roundDates[roundIndex]
                  ? roundDates[roundIndex][matchIndex] ?? new Date()
                  : new Date()
              )}
              onChange={handleMatchTimeChange}
            />
            <br />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderRounds = () => {
    if (rounds.length === 0) {
      return <Typography>No hay enfrentamientos creados aún.</Typography>;
    }

    const handleMatchDateChange = (date: Dayjs | null) => {
      if (date) {
        const dateObj = date.toDate();

        const updatedRounds = [...rounds];
        const currentRound = updatedRounds[selectedRound];
        const roundDatesTmp = [...roundDates];

        for (let index = 0; index < currentRound.length; index++) {
          const currDate = roundDatesTmp[selectedRound][index] ?? new Date();

          const newDate = new Date(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate(),
            currDate.getHours(),
            currDate.getMinutes()
          );

          roundDatesTmp[selectedRound][index] = newDate;
          setRoundDates(roundDatesTmp);
        }

        setRounds([...updatedRounds]);
      }
    };

    return (
      <div
        key={`round-${selectedRound}`}
        style={{ marginBottom: 16, marginTop: 40 }}
      >
        <Divider />
        <div style={{ marginBottom: 12 }}>
          <TextField
            label="Nombre de ronda"
            type="text"
            placeholder="Eg: Cuartos de final"
            value={
              roundNames[selectedRound] != undefined
                ? roundNames[selectedRound]
                : `Ronda ${selectedRound + 1}`
            }
            onChange={(e) => {
              const roundsNamesC = [...roundNames];
              roundsNamesC[selectedRound] = e.target.value;
              setRoundNames(roundsNamesC);
            }}
          />

          <DatePicker
            label="Fecha"
            value={dayjs(
              matchesProgram[selectedRound]
                ? matchesProgram[selectedRound][0].dateTime.toDate() ??
                    new Date()
                : new Date()
            )}
            onChange={handleMatchDateChange}
          />
        </div>

        {rounds[selectedRound].map((match, index) =>
          renderMatch(match, selectedRound, index)
        )}
      </div>
    );
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
        tournament.teamWinnerId === winnerTeam.id ? "#31bebe" : "#30bbbb",
      color: "white",
    };
    const loserStyle = { backgroundColor: "#262b3e", color: "white" };
    const neutralStyle = { backgroundColor: "#131533", color: "white" };

    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 16 }}>
        <SeedItem>
          <Typography variant="body2">{seed.date}</Typography>
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
      title:
        roundNames[roundIndex] != undefined
          ? roundNames[roundIndex]
          : `Ronda ${roundIndex + 1}`,
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
        Enfrentamientos del Torneo{" "}
        {`${leagueType === "leagueOne" ? "Liga 1" : "Liga 2"}`}
      </Typography>

      {leagueType === "leagueTwo" && (
        <TeamSelector
          tournament={tournament}
          onSelectLeagueTwoTeams={(selectedTeamsIds: string[]) => {
            setTournament((prev) => ({
              ...prev,
              leagueTwoTeamsIds: selectedTeamsIds,
            }));
          }}
        />
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
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
                Añadir Enfrentamiento en Ronda {roundNames[rounds.length - 1]}
              </Typography>

              <Grid container spacing={1} sx={{ marginBottom: 2 }}>
                <Grid size={{ sm: 4.5, xs: 6 }}>
                  <Autocomplete
                    options={remainingTeams}
                    getOptionLabel={(option) =>
                      option.name + " - Rango: " + (option.range ?? "Sin rango")
                    }
                    value={
                      selectedTeamA
                        ? remainingTeams.find(
                            (team) => team.id === selectedTeamA
                          )
                        : null
                    }
                    onChange={(_event, newValue) => {
                      if (newValue?.id) setSelectedTeamA(newValue.id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar Equipo A"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ sm: 4.5, xs: 6 }}>
                  <Autocomplete
                    options={remainingTeams}
                    getOptionLabel={(option) =>
                      option.name + " - Rango: " + (option.range ?? "Sin rango")
                    }
                    value={
                      selectedTeamB
                        ? remainingTeams.find(
                            (team) => team.id === selectedTeamB
                          )
                        : null
                    }
                    onChange={(_event, newValue) => {
                      if (newValue?.id) setSelectedTeamB(newValue.id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar Equipo B"
                        variant="outlined"
                      />
                    )}
                  />
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

          <Tabs
            value={selectedRound}
            onChange={(_event, newValue) => setSelectedRound(newValue)}
            aria-label="match rounds"
            variant="scrollable"
          >
            {roundNames.slice(0, rounds.length).map((roundKey, index) => (
              <Tab key={index} label={roundKey} />
            ))}
          </Tabs>

          <br />

          <div>{renderRounds()}</div>

          <br />

          <div>{renderRoundsBrackets()}</div>

          <br />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default TournamentBrackets;
