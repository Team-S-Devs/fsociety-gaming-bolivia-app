import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Banner } from "../../../interfaces/interfaces";
import {
  getNumPages,
  getPaginatedBanners,
} from "../../../utils/firebaseMethods";
import Loader from "../../Loader";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import BlurBoxContainer from "../../BlurBoxContainer";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PagesNames } from "../../../utils/constants";
import styles from "../../../assets/styles/buttons.module.css";
import { CollectionNames } from "../../../utils/collectionNames";
import BannersTable from "./BannersTable";

const ViewBanners: React.FC = () => {
  const numPerPage = 10;
  const [banners, setBanners] = useState<Banner[]>([]);
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
    getNumPages(CollectionNames.Banners, numPerPage).then((result) => {
      setPages(result.numPages);
      setTotalDocs(result.totalDocs);
    });
  }, []);

  useEffect(() => {
    const startAfterDoc = direction === "next" ? lastDoc : undefined;
    const endBeforeDoc = direction === "prev" ? firstDoc : undefined;

    setLoading(true);
    getPaginatedBanners(direction, startAfterDoc, endBeforeDoc, numPerPage)
      .then((data) => {
        setBanners(data.result);
        setFirstDoc(data.firstDoc);
        setLastDoc(data.lastDoc);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e)
        setError(true);
        setLoading(false);
      });
  }, [page, direction]);

  const handleAdd = () => {
    navigate(PagesNames.AdminAddBanner);
  };

  return (
    <div>
      <BlurBoxContainer>
        <Typography variant="h5">Banners creados</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BiPlus />}
          onClick={handleAdd}
          fullWidth={isSmallScreen}
          style={{ marginBottom: "28px" }}
          className={styles.continueButton}
        >
          Añadir Banner
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
            Error obteniendo los banners. Por favor, recarga la página.
          </Typography>
        ) : banners.length > 0 ? (
          <BannersTable
            banners={banners}
            setBanners={setBanners}
            page={page}
            setPage={setPage}
            pages={pages ?? 0}
            totalDocs={totalDocs}
            rowsPerPage={numPerPage}
            setDirection={setDirection}
          />
        ) : (
          <Typography variant="h6" textAlign={"center"} mt={4} mb={3}>
            No hay banners creados.
          </Typography>
        )}
      </BlurBoxContainer>
    </div>
  );
};

export default ViewBanners;
