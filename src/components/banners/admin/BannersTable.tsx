import React, { useState } from "react";
import { Banner } from "../../../interfaces/interfaces";
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
import DeleteConfirmationDialog from "../../dialog/DeleteConfirmationDialog";

interface BannersTableProps {
  banners: Banner[];
  totalDocs: number;
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  rowsPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setDirection: React.Dispatch<
    React.SetStateAction<"prev" | "next" | undefined>
  >;
  pages: number;
}

const BannersTable: React.FC<BannersTableProps> = ({
  banners: banners,
  totalDocs,
  setBanners,
  rowsPerPage,
  setPage,
  page,
  setDirection,
  pages,
}) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

  const handleToggleHidden = async (banner: Banner) => {
    if (!banner.id) return;

    const bannerRef = doc(db, CollectionNames.Banners, banner.id);
    const newHiddenStatus = !banner.hidden;

    try {
      await updateDoc(bannerRef, { hidden: newHiddenStatus });
      setBanners((prev) =>
        prev.map((t) =>
          t.id === banner.id ? { ...t, hidden: newHiddenStatus } : t
        )
      );
    } catch (error) {
      alert("Error al actualizar la visibilidad del torneo.");
    }
  };

  const handleDelete = (id: string) => {
    setSelectedBannerId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBannerId(null);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedBannerId) return;
      const BannerRef = doc(db, CollectionNames.Banners, selectedBannerId);
      setLoadingDelete(true);
      await updateDoc(BannerRef, { deleted: true });
      setBanners((prev) =>
        prev.filter((Banner) => Banner.id !== selectedBannerId)
      );
      setOpenDialog(false);
      setSelectedBannerId(null);
      setLoadingDelete(false);
    } catch (error) {
      alert("No se pudo eliminar el banner");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`${PagesNames.AdminUpdateBanner}/${id}`);
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
              <Th>Redirección</Th>
              <Th>Posición</Th>
              <Th>Mostrar</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {banners.map((banner) => (
              <Tr key={banner.id}>
                <Td>
                  <img
                    src={banner.image.url}
                    alt={banner.redirectUrl}
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
                    {banner.redirectUrl}
                  </Typography>
                </Td>
                <Td>{banner.position}</Td>
                <Td>
                  <Switch
                    checked={!banner.hidden}
                    onChange={() => handleToggleHidden(banner)}
                    color="secondary"
                  />
                </Td>
                <Td>
                  <IconButton onClick={() => handleEdit(banner.id!)}>
                    <BiEdit color="#fff" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(banner.id!)}>
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
        title="Eliminar Banner"
        description="¿Estás seguro que deseas eliminar este banner?. \nEsta acción no se puede deshacer."
      />
    </Box>
  );
};

export default BannersTable;
