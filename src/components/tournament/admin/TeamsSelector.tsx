import React, { SyntheticEvent, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import { Team, Tournament } from "../../../interfaces/interfaces";

interface TeamSelectorProps {
  tournament: Tournament;
  onSelectLeagueTwoTeams: (selectedTeamIds: string[]) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  tournament,
  onSelectLeagueTwoTeams,
}) => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    tournament.leagueTwoTeamsIds ?? []
  );

  const handleSelectChange = (
    _event: SyntheticEvent<Element, Event>,
    value: Team[]
  ) => {
    setSelectedTeams(value.map((teams) => teams.id ?? ""));
    onSelectLeagueTwoTeams(value.map((teams) => teams.id ?? ""));
  };

  const initialTeams = tournament.teams.filter((team) =>
    team.members.every((player) =>
      tournament.paidUsersId.some(
        (paidUser) => paidUser.userId === player.memberId
      )
    )
  );

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      <Typography variant="h6">Equipos para la Liga 2</Typography>

      <br />
      <Autocomplete
        multiple
        options={initialTeams}
        getOptionLabel={(option) => option.name}
        value={initialTeams.filter((team) =>
          selectedTeams.includes(team.id ?? "")
        )}
        onChange={handleSelectChange}
        renderInput={(params) => (
          <TextField {...params} label="Equipos" variant="outlined" />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox checked={selected} />
            {option.name}
          </li>
        )}
      />

      <div>
        <br />
        <Typography>
          <strong>Equipos participantes de la liga 2: </strong>
          {selectedTeams
            .map((teamId) => {
              const team = initialTeams.find((t) => t.id === teamId);
              return team ? team.name : "Unknown team";
            })
            .join(", ")}
        </Typography>
      </div>
    </Box>
  );
};

export default TeamSelector;
