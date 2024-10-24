import React from "react";
import { Tournament } from "../../interfaces/interfaces";
import { Box, Card, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MdSports } from "react-icons/md";
import { BiCheckCircle } from "react-icons/bi";

interface FinalViewProps {
  tournament: Tournament | null;
}

const FinalView: React.FC<FinalViewProps> = ({ tournament }) => {
  return (
    <div>
      {tournament?.finalMatch && tournament?.finalProgram && (
        <Card elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Final del Torneo
          </Typography>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Grid size={{ xs: 5 }}>
              <Box textAlign="center">
                <Typography variant="h6">
                  {tournament.finalMatch.teamA.name}
                </Typography>
                <MdSports fontSize="large" />
                <Typography variant="h4">
                  {tournament.finalMatch.played
                    ? tournament.finalMatch.scoreA
                    : "-"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 2 }}>
              <Typography variant="h6" align="center">
                vs
              </Typography>
            </Grid>

            <Grid size={{ xs: 5 }}>
              <Box textAlign="center">
                <Typography variant="h6">
                  {tournament.finalMatch.teamB.name}
                </Typography>
                <MdSports fontSize="large" />
                <Typography variant="h4">
                  {tournament.finalMatch.played
                    ? tournament.finalMatch.scoreB
                    : "-"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box textAlign="center" mt={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <BiCheckCircle color="success" fontSize="large" />

              <Typography variant="h5">
                {tournament.finalMatch.scoreA > tournament.finalMatch.scoreB
                  ? `${tournament.finalMatch.teamA.name} es el Campeón`
                  : `${tournament.finalMatch.teamB.name} es el Campeón`}
              </Typography>
            </Box>
          </Box>
        </Card>
      )}
    </div>
  );
};

export default FinalView;
