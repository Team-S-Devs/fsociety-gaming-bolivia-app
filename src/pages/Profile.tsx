import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { GiTrophyCup } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import ProfileImage from "../components/profile/ProfileImage";
import ProfileDetailsEdit from "../components/profile/ProfileDetailsEdit";
import TournamentsList from "../components/tournament/user/TournamentsList";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase-config";
import { LoadingButton } from "@mui/lab";
import styles from "../assets/styles/profile.module.css";
import PrincipalContainer from "../components/PrincipalContainer";
import { ToastContainer } from "react-toastify";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const isMdOrUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgOrUp = useMediaQuery(theme.breakpoints.up("lg"));
  const { userInfo } = useUserContext();
  const navigate = useNavigate();

  const [selectedAction, setSelectedAction] = useState<string>("");
  const [loggingOut, setLogOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setLogOut(true);
      await signOut(auth);
      setLogOut(false);
      navigate("/");
    } catch (error) {
      setError("Error al cerrar sesión.");
    }
  };
  return (
    <PrincipalContainer>
      <Container>
        <br />
        <br />
        <br />
        <Box
          sx={{
            display: "flex",
            flexDirection: isMdOrUp ? "row" : "column",
            padding: "32px 0",
          }}
        >
          <Card
            sx={{
              width: isLgOrUp ? "20%" : isMdOrUp ? "30%" : "100%",
              maxHeight: 480,
              marginRight: 3,
              // padding: 2,
              paddingBottom: 5,
              position: isMdOrUp ? "fixed" : "initial",
              background: "linear-gradient(to top right, #0e1f48, #191955)",
            }}
          >
            <ProfileImage edit={false} />
            <Typography variant="h5" mb={3} textAlign={"center"} gutterBottom>
              {userInfo?.nickname}
            </Typography>
            <Button
              variant="contained"
              startIcon={<FiEdit />}
              fullWidth
              onClick={() => setSelectedAction("details")}
              sx={{ borderRadius: 0 }}
            >
              Editar Perfil
            </Button>
            <Button
              variant="contained"
              startIcon={<GiTrophyCup />}
              fullWidth
              onClick={() => setSelectedAction("tournaments")}
              sx={{ borderRadius: 0 }}
            >
              Mis Torneos
            </Button>
            <br />
            <br />
            {error && <Typography color="error">{error}</Typography>}
            <LoadingButton
              variant="text"
              startIcon={<FiLogOut />}
              fullWidth
              loading={loggingOut}
              onClick={handleLogout}
              sx={{ borderColor: "#f00", color: "#f00" }}
            >
              Cerrar Sesión
            </LoadingButton>
          </Card>

          <div
            style={{
              marginLeft: isLgOrUp ? 500 : isMdOrUp ? 400 : 0,
              marginTop: isMdOrUp ? 0 : 24,
            }}
          >
            <div className={styles.profileContainer}>
              {selectedAction === "tournaments" ? (
                <TournamentsList />
              ) : (
                <ProfileDetailsEdit />
              )}
            </div>
          </div>
          {!isMdOrUp && (
            <>
              <br />
              <br />
              <br />
            </>
          )}
        </Box>
      </Container>
      <ToastContainer
        style={{ marginTop: "5rem" }}
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </PrincipalContainer>
  );
};

export default ProfilePage;
