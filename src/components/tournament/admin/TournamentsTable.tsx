import React, { useState } from "react";
import { Tournament } from "../../../interfaces/interfaces";
import {
  IconButton,
  Paper,
  TablePagination,
  Box,
  Switch,
  Typography,
} from "@mui/material";
import { BiEdit, BiTrash } from "react-icons/bi";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { CollectionNames } from "../../../utils/collectionNames";
import { useNavigate } from "react-router-dom";
import { PagesNames } from "../../../utils/constants";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface TournamentsTableProps {
  tournaments: Tournament[];
  totalDocs: number;
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  rowsPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setDirection: React.Dispatch<
    React.SetStateAction<"prev" | "next" | undefined>
  >;
  pages: number;
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({
  tournaments,
  totalDocs,
  setTournaments,
  rowsPerPage,
  setPage,
  page,
  setDirection,
  pages,
}) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(null);

  const handleToggleActive = async (tournament: Tournament) => {
    if (new Date() > tournament.endDate.toDate()) {
      alert("No puedes activar un torneo cuyo fecha de fin ha pasado.");
      return;
    }

    if (!tournament.id) return;

    const tournamentRef = doc(db, CollectionNames.Tournaments, tournament.id);
    const newActiveStatus = !tournament.active;

    try {
      await updateDoc(tournamentRef, { active: newActiveStatus });
      setTournaments((prev) =>
        prev.map((t) =>
          t.id === tournament.id ? { ...t, active: newActiveStatus } : t
        )
      );
    } catch (error) {
      alert("Error al actualizar el estado del torneo.");
    }
  };

  const handleDelete = (id: string) => {
    setSelectedTournamentId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTournamentId(null);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedTournamentId) return;
      const tournamentRef = doc(
        db,
        CollectionNames.Tournaments,
        selectedTournamentId
      );
      setLoadingDelete(true);
      await updateDoc(tournamentRef, { deleted: true });
      setTournaments((prev) =>
        prev.filter((tournament) => tournament.id !== selectedTournamentId)
      );
      setOpenDialog(false);
      setSelectedTournamentId(null);
      setLoadingDelete(false);
    } catch (error) {
      alert("No se pudo eliminar el torneo");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`${PagesNames.AdminUpdateTournament}/${id}`);
  };

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

  return (
    <Box width="100%">
      <Paper>
        <Table className="dark-table">
          <Thead>
            <Tr>
              <Th>Banner</Th>
              <Th>Nombre</Th>
              <Th>Fecha de inicio</Th>
              <Th>Fecha de fin</Th>
              <Th>Activo</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tournaments.map((tournament) => (
              <Tr key={tournament.id}>
                <Td>
                  <img
                    src={tournament.imagePath.url}
                    alt={tournament.name}
                    width="100"
                    style={{ maxWidth: "100%" }}
                  />
                </Td>
                <Td>
                  <Typography
                    style={{
                      wordWrap: "break-word",
                      maxWidth: 220,
                    }}
                  >
                    {tournament.name}
                  </Typography>
                </Td>
                <Td>{tournament.startDate.toDate().toLocaleDateString()}</Td>
                <Td>{tournament.endDate.toDate().toLocaleDateString()}</Td>
                <Td>
                  <Switch
                    checked={
                      tournament.active &&
                      new Date() < tournament.endDate.toDate()
                    }
                    onChange={() => handleToggleActive(tournament)}
                    color="secondary"
                    disabled={new Date() > tournament.endDate.toDate()}
                  />
                </Td>
                <Td>
                  <IconButton onClick={() => handleEdit(tournament.fakeId!)}>
                    <BiEdit color="#fff" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tournament.id!)}>
                    <BiTrash color="#fff" />
                  </IconButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Paper>

      <TablePagination
        component="div"
        count={totalDocs}
        page={page - 1}
        style={{ justifyContent: "center", marginTop: 24 }}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        labelRowsPerPage="Torneos por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        getItemAriaLabel={(type) => {
          if (type === "previous") {
            return "Página anterior";
          }
          if (type === "next") {
            return "Página siguiente";
          }
          return "";
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          ".MuiTablePagination-spacer": {
            marginBottom: 0,
          },
          ".MuiTablePagination-selectLabel": {
            marginBottom: 0,
          },
          ".MuiTablePagination-displayedRows": {
            marginBottom: 0,
          },
          [`@media (max-width: 600px)`]: {
            ".MuiTablePagination-toolbar": {
              flexWrap: "wrap",
              justifyContent: "center",
            },
            ".MuiTablePagination-spacer": {
              display: "none",
            },
            ".MuiTablePagination-selectLabel": {
              display: "none",
            },
            ".MuiTablePagination-displayedRows": {
              fontSize: "0.8rem",
              marginBottom: 0,
            },
            ".MuiTablePagination-select": {
              fontSize: "0.8rem",
            },
          },
        }}
      />
      <DeleteConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={confirmDelete}
        loadingDelete={loadingDelete}
      />
    </Box>
  );
};

export default TournamentsTable;
