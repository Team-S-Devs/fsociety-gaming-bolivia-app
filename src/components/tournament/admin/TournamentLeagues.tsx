import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import TournamentMatches from "./TournamentMatches";
import { Tournament } from "../../../interfaces/interfaces";

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

interface TournamentLeaguesProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  error: string | null;
  success: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  submit: (e: React.FormEvent<HTMLFormElement>, t: Tournament) => Promise<void>;
}

const TournamentLeagues: React.FC<TournamentLeaguesProps> = ({
  tournament,
  setTournament,
  error,
  success,
  setError,
  submit,
}) => {
  const [selectedLeague, setSelectedLeague] = useState(0);

  return (
    <div>
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
      <CustomTabPanel value={selectedLeague} index={0}>
        <TournamentMatches
          tournament={tournament}
          setTournament={setTournament}
          success={success}
          error={error}
          setError={setError}
          submit={submit}
          leagueType="leagueOne"
        />
      </CustomTabPanel>
      <CustomTabPanel value={selectedLeague} index={1}>
        <TournamentMatches
          tournament={tournament}
          setTournament={setTournament}
          success={success}
          error={error}
          setError={setError}
          submit={submit}
          leagueType="leagueTwo"
        />
      </CustomTabPanel>
    </div>
  );
};

export default TournamentLeagues;
