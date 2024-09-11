import React, { useState } from "react";
import { Tournament } from "../../../interfaces/interfaces";
import {
  IconButton,
  Paper,
  TablePagination,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { BiEdit, BiTrash } from "react-icons/bi";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { CollectionNames } from "../../../utils/collectionNames";
import { useNavigate } from "react-router-dom";
import { PagesNames } from "../../../utils/constants";
import { useTheme } from "@mui/material/styles";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface TournamentsTableProps {
  tournaments: Tournament[];
  totalDocs: number;
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setLastDoc: React.Dispatch<any>;
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({
  tournaments,
  totalDocs,
  setTournaments,
  rowsPerPage,
  setRowsPerPage,
  setPage,
  page,
  setLastDoc,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(null);

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
        CollectionNames.TOURNAMENTS,
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
    setPage(newPage);
    setLastDoc(null);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={isSmallScreen ? 1 : 3} width="100%">
      <Paper>
        <Table>
          <Thead>
            <Tr>
              <Th>Banner</Th>
              <Th>Nombre</Th>
              <Th>Fecha de inicio</Th>
              <Th>Fecha de fin</Th>
              <Th>Estado</Th>
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
                <Td>{tournament.name}</Td>
                <Td>{tournament.startDate.toDate().toLocaleDateString()}</Td>
                <Td>{tournament.endDate.toDate().toLocaleDateString()}</Td>
                <Td>
                  <Typography
                    color={
                      new Date() < tournament.endDate.toDate()
                        ? "success"
                        : "error"
                    }
                  >
                    {new Date() < tournament.endDate.toDate()
                      ? "Activo"
                      : "Disactivo"}
                  </Typography>
                </Td>
                <Td>
                  <IconButton onClick={() => handleEdit(tournament.id!)}>
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
        page={page}
        style={{ justifyContent: "center", marginTop: 24 }}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
