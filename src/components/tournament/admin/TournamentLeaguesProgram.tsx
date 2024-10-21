import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import { MatchProgramSet, Tournament } from "../../../interfaces/interfaces";
import ViewTournamentMatches from "../ViewTournamentMatches";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getEmptyTournament } from "../../../utils/methods";
import { LoadingButton } from "@mui/lab";
import styles from "../../../assets/styles/buttons.module.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`league-tabpanel-${index}`}
      aria-labelledby={`league-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `league-tab-${index}`,
    "aria-controls": `league-tabpanel-${index}`,
  };
}

interface TournamentLeaguesProgramProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  error: string | null;
  success: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  submit: (e: React.FormEvent<HTMLFormElement>, t: Tournament) => Promise<void>;
}

const TournamentLeaguesProgram: React.FC<TournamentLeaguesProgramProps> = ({
  tournament,
  error,
  success,
  setError,
  submit,
}) => {
  const [selectedLeague, setSelectedLeague] = useState(0);

  const [roundKeys1, setRoundKeys1] = useState<string[]>([]);
  const [matchesProgram1, setMatchesProgram1] = useState<MatchProgramSet[][]>(
    []
  );

  const [roundKeys2, setRoundKeys2] = useState<string[]>([]);
  const [matchesProgram2, setMatchesProgram2] = useState<MatchProgramSet[][]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(false);

  function hasDuplicates(arr: string[]) {
    const seen = new Set();

    for (const item of arr) {
      if (seen.has(item)) {
        return true;
      }
      seen.add(item);
    }

    return false;
  }

  const handleUpdateTournament = async (
    leagueType: "leagueOne" | "leagueTwo"
  ): Promise<Tournament | false> => {
    const selectedLeague =
      leagueType === "leagueOne"
        ? tournament.matches
        : tournament.matchesLeagueTwo ?? {};

    const rounds = Object.keys(selectedLeague)
      .sort((a, b) => selectedLeague[b].length - selectedLeague[a].length)
      .map((key) => selectedLeague[key]);

    const roundNames = leagueType === "leagueOne" ? roundKeys1 : roundKeys2;
    const matchesProgram =
      leagueType === "leagueOne" ? matchesProgram1 : matchesProgram2;

    if (hasDuplicates(roundNames)) {
      alert("No puedes tener dos rondas con el mismo nombre");
      return false;
    }

    let roundProgram: Record<string, MatchProgramSet[]> = {};

    if (rounds.length > matchesProgram.length) {
      for (let i = 0; i < rounds.length; i++) {
        const round = rounds[i];
        const matchesProgramTmp: MatchProgramSet[] = [];

        for (let j = 0; j < round.length; j++) {
          matchesProgramTmp.push({
            dateTime: matchesProgram[i][j].dateTime,
            online: matchesProgram[i][j].online ?? false,
          });
        }
        roundProgram[
          roundNames[i] != undefined ? roundNames[i] : `Ronda-${i}`
        ] = matchesProgramTmp;
      }
    } else {
      for (let i = 0; i < matchesProgram.length; i++) {
        const round = matchesProgram[i];
        const matchesProgramTmp: MatchProgramSet[] = [];

        for (let j = 0; j < round.length; j++) {
          matchesProgramTmp.push({
            dateTime: matchesProgram[i][j].dateTime,
            online: matchesProgram[i][j].online ?? false,
          });
        }
        roundProgram[
          roundNames[i] != undefined ? roundNames[i] : `Ronda-${i}`
        ] = matchesProgramTmp;
      }
    }

    let tournmt = getEmptyTournament();

    if (leagueType === "leagueOne") {
      tournmt = {
        ...tournament,
        matchesProgram: roundProgram,
      };
    } else {
      tournmt = {
        ...tournament,
        matchesLeagueTwoProgram: roundProgram,
      };
    }

    return tournmt;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let tournmt = { ...tournament };
    const updated1 = await handleUpdateTournament("leagueOne");
    const updated2 = await handleUpdateTournament("leagueTwo");
    if (updated1 != false && updated2 != false) {
      tournmt = {
        ...tournmt,
        matches: updated1.matches,
        matchesProgram: updated1.matchesProgram,
        matchesLeagueTwo: updated2.matchesLeagueTwo,
        matchesLeagueTwoProgram: updated2.matchesLeagueTwoProgram,
      };

      try {
        await submit(e, tournmt);
      } catch (error) {
        setError("Error al enviar el formulario. Inténtalo de nuevo.");
      }
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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedLeague}
            onChange={(_event, newValue) => setSelectedLeague(newValue)}
            aria-label="tournament leagues"
            variant="scrollable"
          >
            <Tab label="Liga 1" {...a11yProps(0)} />
            <Tab label="Liga 2" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CustomTabPanel value={selectedLeague} index={0}>
            <ViewTournamentMatches
              tournament={tournament}
              leagueType="leagueOne"
              roundKeys={roundKeys1}
              setRoundKeys={setRoundKeys1}
              matchesProgram={matchesProgram1}
              setMatchesProgram={setMatchesProgram1}
            />
          </CustomTabPanel>
          <CustomTabPanel value={selectedLeague} index={1}>
            <ViewTournamentMatches
              tournament={tournament}
              leagueType="leagueTwo"
              roundKeys={roundKeys2}
              setRoundKeys={setRoundKeys2}
              matchesProgram={matchesProgram2}
              setMatchesProgram={setMatchesProgram2}
            />
          </CustomTabPanel>
        </LocalizationProvider>
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

export default TournamentLeaguesProgram;
