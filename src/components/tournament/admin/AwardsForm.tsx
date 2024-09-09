import React from "react";
import { TextField, Box, Button, Typography, IconButton } from "@mui/material";
import { Tournament } from "../../../interfaces/interfaces";
import { LuPlus, LuTrash } from "react-icons/lu";

interface AwardsFormProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
}

const AwardsForm: React.FC<AwardsFormProps> = ({
  tournament,
  setTournament,
}) => {
  const handleAwardChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedAwards = [...tournament.awards];
    updatedAwards[index] = e.target.value;
    setTournament({ ...tournament, awards: updatedAwards });
  };

  const addAward = () => {
    setTournament({ ...tournament, awards: [...tournament.awards, ""] });
  };

  const removeAward = (index: number) => {
    const updatedAwards = tournament.awards.filter((_, i) => i !== index);
    setTournament({ ...tournament, awards: updatedAwards });
  };

  return (
    <Box marginTop={4}>
      <Typography variant="h6" gutterBottom>
        Premios
      </Typography>
      {tournament.awards.map((award, index) => (
        <Box key={index} display="flex" alignItems="center" marginBottom={2}>
          <TextField
            label={`Premio ${index + 1}`}
            value={award}
            onChange={(e) => handleAwardChange(index, e)}
            fullWidth
            required
          />
          <IconButton onClick={() => removeAward(index)} color="error">
            <LuTrash />
          </IconButton>
        </Box>
      ))}
      <Button
        onClick={addAward}
        variant="outlined"
        startIcon={<LuPlus color="#fff" />}
        style={{ 
            borderColor: "#fff",
            color: "#fff"
        }}
      >
        Añadir Premio
      </Button>
    </Box>
  );
};

export default AwardsForm;
