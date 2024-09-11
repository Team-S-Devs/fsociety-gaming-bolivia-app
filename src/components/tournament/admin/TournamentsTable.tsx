import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Paper,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Tournament } from "../../../interfaces/interfaces";
import { db } from "../../../utils/firebase-config";
import { CollectionNames } from "../../../utils/collectionNames";
import { BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import BlurBoxContainer from "../../BlurBoxContainer";
import Loader from "../../Loader";
import { PagesNames } from "../../../utils/constants";
import styles from "../../../assets/styles/buttons.module.css"

const TournamentsTable: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTournaments = async () => {
      setError(false);
      setLoading(true);
      try {
        const q = query(
          collection(db, CollectionNames.TOURNAMENTS),
          where("deleted", "==", false),
          orderBy("startDate", "desc")
        );
        const querySnapshot = await getDocs(q);
        const tournamentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tournament[];
        setTournaments(tournamentsData);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };

    fetchTournaments();
  }, []);

  const handleDelete = async (id: string) => {
    const tournamentRef = doc(db, CollectionNames.TOURNAMENTS, id);
    await updateDoc(tournamentRef, { deleted: true });
    setTournaments((prev) => prev.filter((tournament) => tournament.id !== id));
  };

  const handleEdit = (id: string) => {
    navigate(`${PagesNames.AdminUpdateTournament}/${id}`);
  };

  const handleAdd = () => {
    navigate(PagesNames.AdminAddTournament);
  };

  return (
    <div>
      <BlurBoxContainer>
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
            variant="h5"
            textAlign={"center"}
            mt={4}
            mb={3}
          >
            Eror obteniendo los torneos. Por favor, recarga la página.
          </Typography>
        ) : tournaments.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Fecha de inicio</TableCell>
                  <TableCell>Fecha de fin</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>
                      <img
                        src={tournament.imagePath.url}
                        alt={tournament.name}
                        width="100"
                      />
                    </TableCell>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>
                      {tournament.startDate.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {tournament.endDate.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(tournament.id!)}>
                        <BiEdit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(tournament.id!)}>
                        <BiTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h5" textAlign={"center"} mt={4} mb={3}>
            No hay torneos creados.
          </Typography>
        )}
      </BlurBoxContainer>
    </div>
  );
};

export default TournamentsTable;
