import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface RoundFormatSelectorProps {
  selectedFormat: "Bo1" | "Bo3" | "Bo5";
  onFormatChange: (format: "Bo1" | "Bo3" | "Bo5") => void;
}

const RoundFormatSelector: React.FC<RoundFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
}) => {
  return (
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel>Formato de la Ronda</InputLabel>
      <Select
        value={selectedFormat}
        label="Formato de la Ronda"
        onChange={(e) =>
          onFormatChange(e.target.value as "Bo1" | "Bo3" | "Bo5")
        }
      >
        <MenuItem value="Bo1">Mejor de 1 (Bo1)</MenuItem>
        <MenuItem value="Bo3">Mejor de 3 (Bo3)</MenuItem>
        <MenuItem value="Bo5">Mejor de 5 (Bo5)</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RoundFormatSelector;
