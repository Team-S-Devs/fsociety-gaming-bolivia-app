import React, { useEffect, useState } from "react";
import { FormControl, Typography, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tournament } from "../../../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import styles from "../../../assets/styles/buttons.module.css";
import Grid from "@mui/material/Grid2";

export interface Rankings {
  firstTeamId: string | "none";
  secondTeamId: string | "none";
  thirdTeamId: string | "none";
  fourthTeamId: string | "none";
}

interface RankingSetterProps {
  tournament: Tournament;
  error: string | null;
  success: string | null;
  submit: (e: React.FormEvent<HTMLFormElement>, t: Tournament) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const RankingSetter: React.FC<RankingSetterProps> = ({
  tournament,
  error,
  success,
  submit,
  setError,
}) => {
  const paidTeams = tournament.teams.filter((team) =>
    team.members.every((player) =>
      tournament.paidUsersId.some(
        (paidUser) => paidUser.userId === player.memberId
      )
    )
  );

  const [rankings, setRankings] = useState<Rankings>({
    firstTeamId: "none",
    secondTeamId: "none",
    thirdTeamId: "none",
    fourthTeamId: "none",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRankings(tournament.rankings)
  }, [tournament])

  const handleRankingChange =
    (position: keyof Rankings) => (value: string | null) => {
      setRankings((prevRankings) => ({
        ...prevRankings,
        [position]: value || "none",
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let tournmt = { ...tournament };
    tournmt.rankings = rankings;
    try {
      await submit(e, tournmt);
    } catch (error) {
      setError("Error al enviar el formulario. Inténtalo de nuevo.");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
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
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Establecer Rankings de Equipos
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 6}}>
            <FormControl fullWidth>
              <Autocomplete
                options={paidTeams}
                getOptionLabel={(option) => option.name}
                onChange={(_event, value) =>
                  handleRankingChange("firstTeamId")(value?.id || "none")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Primer Lugar" />
                )}
                value={
                  paidTeams.find((team) => team.id === rankings.firstTeamId) ||
                  null
                }
              />
            </FormControl>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <FormControl fullWidth>
              <Autocomplete
                options={paidTeams}
                getOptionLabel={(option) => option.name}
                onChange={(_event, value) =>
                  handleRankingChange("secondTeamId")(value?.id || "none")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Segundo Lugar" />
                )}
                value={
                  paidTeams.find((team) => team.id === rankings.secondTeamId) ||
                  null
                }
              />
            </FormControl>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <FormControl fullWidth>
              <Autocomplete
                options={paidTeams}
                getOptionLabel={(option) => option.name}
                onChange={(_event, value) =>
                  handleRankingChange("thirdTeamId")(value?.id || "none")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tercer Lugar" />
                )}
                value={
                  paidTeams.find((team) => team.id === rankings.thirdTeamId) ||
                  null
                }
              />
            </FormControl>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <FormControl fullWidth>
              <Autocomplete
                options={paidTeams}
                getOptionLabel={(option) => option.name}
                onChange={(_event, value) =>
                  handleRankingChange("fourthTeamId")(value?.id || "none")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Cuarto Lugar" />
                )}
                value={
                  paidTeams.find((team) => team.id === rankings.fourthTeamId) ||
                  null
                }
              />
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginTop: 3 }}>
          Rankings Actuales:
        </Typography>
        <Typography>
          1er Lugar:{" "}
          {paidTeams.find((team) => team.id === rankings.firstTeamId)?.name}
        </Typography>
        <Typography>
          2do Lugar:{" "}
          {paidTeams.find((team) => team.id === rankings.secondTeamId)?.name}
        </Typography>
        <Typography>
          3er Lugar:{" "}
          {paidTeams.find((team) => team.id === rankings.thirdTeamId)?.name}
        </Typography>
        <Typography>
          4to Lugar:{" "}
          {paidTeams.find((team) => team.id === rankings.fourthTeamId)?.name}
        </Typography>
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
    </Box>
  );
};

export default RankingSetter;
