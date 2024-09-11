import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  startAfter,
  limit,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button, useMediaQuery, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Tournament } from "../../../interfaces/interfaces";
import { db } from "../../../utils/firebase-config";
import { CollectionNames } from "../../../utils/collectionNames";
import { BiPlus } from "react-icons/bi";
import BlurBoxContainer from "../../BlurBoxContainer";
import Loader from "../../Loader";
import { PagesNames } from "../../../utils/constants";
import styles from "../../../assets/styles/buttons.module.css";
import TournamentsTable from "./TournamentsTable";

const ViewTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTournaments = async () => {
      setError(false);
      setLoading(true);
      try {
        const countSnapshot = await getDocs(
          query(
            collection(db, CollectionNames.TOURNAMENTS),
            where("deleted", "==", false)
          )
        );
        setTotalDocs(countSnapshot.size);

        const q = query(
          collection(db, CollectionNames.TOURNAMENTS),
          where("deleted", "==", false),
          orderBy("startDate", "desc"),
          limit(rowsPerPage),
          ...(lastDoc ? [startAfter(lastDoc)] : [])
        );
        const querySnapshot = await getDocs(q);
        const tournamentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tournament[];

        setTournaments(tournamentsData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };

    fetchTournaments();
  }, [page, rowsPerPage]);

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
          style={{ marginBottom: "16px" }}
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
            totalDocs={totalDocs}
            setTournaments={setTournaments}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setPage={setPage}
            page={page}
            setLastDoc={setLastDoc}
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
