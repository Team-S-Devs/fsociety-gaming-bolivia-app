import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  Pagination,
  Box,
  CardMedia,
} from "@mui/material";
import { Tournament } from "../../../interfaces/interfaces";
import Grid from "@mui/material/Grid2";
import { useUserContext } from "../../../contexts/UserContext";
import {
  getNumPagesForUserTournaments,
  getPaginatedTournamentsHistory,
} from "../../../utils/firebaseMethods";
import Loader from "../../Loader";
import ItemInfoText from "../ItemInfoText";
import { FaCalendar, FaCodeBranch, FaUsers } from "react-icons/fa";
import { timestampToDate } from "../../../utils/methods";
import { Link } from "react-router-dom";
import { PagesNames } from "../../../utils/constants";

const TOURNAMENTS_PER_PAGE = 6;

const TournamentsList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(
    undefined
  );
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalTournaments, setTotalTournaments] = useState(0);
  const [direction, setDirection] = useState<"prev" | "next" | undefined>(
    undefined
  );
  const [error, setError] = useState<boolean>(false);
  const { userInfo } = useUserContext();

  useEffect(() => {
    if (!userInfo?.id) return;
    getNumPagesForUserTournaments(userInfo.id, TOURNAMENTS_PER_PAGE).then(
      (result) => {
        setPages(result.numPages);
        setTotalTournaments(result.totalDocs);
      }
    );
  }, []);

  useEffect(() => {
    if (!userInfo?.id) return;
    const startAfterDoc = direction === "next" ? lastDoc : undefined;
    const endBeforeDoc = direction === "prev" ? firstDoc : undefined;

    setLoading(true);
    getPaginatedTournamentsHistory(
      userInfo.id,
      direction,
      startAfterDoc,
      endBeforeDoc
    )
      .then((data) => {
        setTournaments(data.result);
        setFirstDoc(data.firstDoc);
        setLastDoc(data.lastDoc);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
        setLoading(false);
      });
  }, [userInfo?.id, page, direction]);

  const handleChangePage = (_event: any, newPage: number) => {
    if (newPage > page - 1) handleNextClick();
    else handlePreviousClick();
  };

  const handlePreviousClick = () => {
    if (page === 1) return;
    setDirection("prev");
    setPage((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (page === pages) return;
    setDirection("next");
    setPage((prev) => prev + 1);
  };

  const getTeamLimit = (tournament: Tournament) => {
    return tournament.fakeTeamLimit == null
      ? tournament.teamLimit
      : tournament.fakeTeamLimit;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: tournaments.length > 0 ? "flex-start" : "center",
          minHeight: "50vh",
          width: "100%",
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {loading ? (
            <Loader />
          ) : error ? (
            <Typography color="error">
              Hubo un error cargando los torneos del usuario. Intenta de nuevo.
            </Typography>
          ) : tournaments.length === 0 ? (
            <Typography>No hay registro de torneos</Typography>
          ) : (
            <Grid
              container
              spacing={3}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {tournaments.map((tournament, index) => (
                <Grid sx={{ xs: 12, md: 6 }} key={index}>
                  <Link
                    to={`${PagesNames.TournamentDetails}/${tournament.fakeId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card sx={{ background: "#102646", width: 350 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        width="350"
                        sx={{ objectFit: "cover", width: "350" }}
                        image={tournament.previewImagePath.url}
                        alt={tournament.name}
                      />
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          style={{
                            color: "#ffd700",
                            fontWeight: 600,
                          }}
                        >
                          {tournament.name}
                        </Typography>
                        <Grid container mb={1} spacing={2}>
                          <Grid sx={{ sm: 6 }}>
                            <ItemInfoText
                              text={tournament.modality}
                              icon={<FaCodeBranch />}
                            />
                          </Grid>
                          <Grid sx={{ sm: 6 }}>
                            <ItemInfoText
                              text={`${getTeamLimit(tournament)}v${getTeamLimit(tournament)}`}
                              icon={<FaUsers />}
                            />
                          </Grid>
                        </Grid>

                        <ItemInfoText
                          text={`${timestampToDate(
                            tournament.startDate
                          )} - ${timestampToDate(tournament.endDate)}`}
                          icon={<FaCalendar />}
                        />
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(totalTournaments / TOURNAMENTS_PER_PAGE)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          disabled={loading}
        />
      </Box>
    </Box>
  );
};

export default TournamentsList;
