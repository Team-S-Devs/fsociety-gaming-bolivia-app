import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import TournamentsTable from "./TournamentsTable";
import { Tournament } from "../../../interfaces/interfaces";
import {
  getNumPages,
  getPaginatedTournaments,
} from "../../../utils/firebaseMethods";
import Loader from "../../Loader";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import BlurBoxContainer from "../../BlurBoxContainer";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PagesNames } from "../../../utils/constants";
import styles from "../../../assets/styles/buttons.module.css";

const ViewTournaments: React.FC = () => {
  const numPerPage = 10;
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(
    undefined
  );
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined
  );
  const [pages, setPages] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [direction, setDirection] = useState<"prev" | "next" | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getNumPages("tournaments", numPerPage).then((result) => {
      setPages(result.numPages);
      setTotalDocs(result.totalDocs);
    });
  }, []);

  useEffect(() => {
    const startAfterDoc = direction === "next" ? lastDoc : undefined;
    const endBeforeDoc = direction === "prev" ? firstDoc : undefined;

    setLoading(true);
    getPaginatedTournaments(direction, startAfterDoc, endBeforeDoc, numPerPage)
      .then((data) => {
        setTournaments(data.result);
        setFirstDoc(data.firstDoc);
        setLastDoc(data.lastDoc);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [page, direction]);

  const handleAdd = () => {
    navigate(PagesNames.AdminAddTournament);
  };

  return (
    <div>
      <BlurBoxContainer>
        <Typography variant="h5">Torneos creados</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BiPlus />}
          onClick={handleAdd}
          fullWidth={isSmallScreen}
          style={{ marginBottom: "28px" }}
          className={styles.continueButton}
        >
          Añadir Torneo
        </Button>
        {loading ? (
          <Loader />
        ) : error ? (
          <Typography
            color="error"
            variant="h6"
            textAlign={"center"}
            mt={4}
            mb={3}
          >
            Error obteniendo los torneos. Por favor, recarga la página.
          </Typography>
        ) : tournaments.length > 0 ? (
          <TournamentsTable
            tournaments={tournaments}
            page={page}
            totalDocs={totalDocs}
            setTournaments={setTournaments}
            rowsPerPage={numPerPage}
            setPage={setPage}
            setDirection={setDirection}
            pages={pages ?? 0}
          />
        ) : (
          <Typography variant="h6" textAlign={"center"} mt={4} mb={3}>
            No hay torneos creados.
          </Typography>
        )}
      </BlurBoxContainer>
    </div>
  );
};

export default ViewTournaments;
