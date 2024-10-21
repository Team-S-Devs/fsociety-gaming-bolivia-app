import React, { ReactNode, useState } from "react";
import {
  MenuItem,
  Select,
  Typography,
  Box,
  FormControl,
  InputLabel,
  ListItemText,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material";
import { Tournament } from "../../../interfaces/interfaces";

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
    event: SelectChangeEvent<string[]>,
    _child: ReactNode
  ) => {
    const selectedTeamIds = event.target.value as string[];
    setSelectedTeams(selectedTeamIds);
    onSelectLeagueTwoTeams(selectedTeamIds);
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
      <FormControl fullWidth>
        <InputLabel id="team-selector-label">Equipos</InputLabel>
        <Select
          labelId="team-selector-label"
          multiple
          value={selectedTeams}
          onChange={handleSelectChange}
          renderValue={(selected) =>
            (selected as string[])
              .map((teamId) => {
                const team = initialTeams.find((t) => t.id === teamId);
                return team ? team.name : "Unknown team";
              })
              .join(", ")
          }
        >
          {initialTeams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              <Checkbox checked={selectedTeams.includes(team.id!)} />
              <ListItemText primary={team.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
