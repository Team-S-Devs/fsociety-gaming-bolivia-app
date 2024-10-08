import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Category, Tournament, Team, TeamMember } from "../interfaces/interfaces";
import styles from "../assets/styles/tournamentDetails.module.css";
import Splash from "./Splash";
import { getTournamentByFakeId } from "../utils/authUtils";
import CategoriesSlider from "../components/tournament/details/CategoriesSlider";
import OverViewSection from "./tournamentView/OverViewSection";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import JoinTeamModal from "../components/tournament/tourForm/JoinTeamModal";
import { auth } from "../utils/firebase-config";
import Loader from "../components/Loader";
import ParticipantsViewSection from "./tournamentView/ParticipantsViewSection";
import AwardsViewSection from "./tournamentView/AwardsViewSection";
import MatchesViewSection from "./tournamentView/MatchesViewSection";
import PaymentStepsDialog from "../components/dialog/PaymentStepsDialog";
import { Box, Typography } from "@mui/material";
import { useUserContext } from "../contexts/UserContext";
import { WPP_NUMBER } from "../utils/constants";
import ConfirmationModal from "../components/tournament/tourForm/ConfirmationModal";

const TournamentDetails: React.FC = () => {
  const { fakeId } = useParams<{ fakeId: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [actualCategory, setActualCategory] = useState(1);
  const [actualPrevView, setActualPrevView] = useState<React.ReactNode | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLogged, setIsUserLogged] = useState<boolean>(false);
  const [openModalPayment, setOpenModalPayment] = useState<boolean>(true);
  const { user } = useUserContext();

  function hasUserPaid(userId: string): boolean {
    return tournament != null && tournament.paidUsersId.some(paidUser => paidUser.userId === userId);
  }  

  useEffect(() => {
    setOpenModalPayment(
      (userTeam &&
        user?.uid &&
        tournament &&
        tournament.paidUsersId &&
        !hasUserPaid(user.uid) ||
        false)
    );
  }, [userTeam, tournament]);
  const [userInNoTeam, setUserInNoTeam] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isTournamentEnded, setIsTournamentEnded] = useState<boolean>(false);

  useEffect(() => {
    const checkUserLoggedIn = () => {
      const user = auth.currentUser;
      setIsUserLogged(!!user);
    };

    if (!fakeId) {
      toast.error("El Fake ID del torneo no está definido");
      return;
    }

    const fetchTournament = async () => {
      const fetchedTournament = await getTournamentByFakeId(fakeId);
      setTournament(fetchedTournament);
      const isTournamentEnded = fetchedTournament?.endDate?.toDate() ? fetchedTournament.endDate.toDate() < new Date() : false;

      setIsTournamentEnded(isTournamentEnded);


      const user = auth.currentUser;
      if (user && fetchedTournament?.teams) {
        const team = fetchedTournament.teams.find((team) =>
          team.members.some((member: TeamMember) => member.memberId === user.uid)
        );
        setUserTeam(team || null);

        const isUserInNoTeam = Array.isArray(fetchedTournament.usersNoTeam)
          ? fetchedTournament.usersNoTeam.some((member) => member.memberId === user.uid)
          : false;

        setUserInNoTeam(isUserInNoTeam);
      }
    };

    fetchTournament();
    checkUserLoggedIn();
  }, [fakeId]);

  const SliderCategories: Category[] = useMemo(
    () => [
      {
        id: 1,
        value: "OVERVIEW",
        component: <OverViewSection tournament={tournament} />,
      },
      {
        id: 2,
        value: "ENFRENTAMIENTOS",
        component: <MatchesViewSection tournament={tournament} />,
      },
      {
        id: 3,
        value: "PARTICIPANTES",
        component: <ParticipantsViewSection tournament={tournament} />,
      },
      {
        id: 4,
        value: "PREMIOS",
        component: <AwardsViewSection tournament={tournament} />,
      },
    ],
    [tournament]
  );

  useEffect(() => {
    const selectedCategory = SliderCategories.find(
      (category) => category.id === actualCategory
    );
    if (selectedCategory) {
      setActualPrevView(selectedCategory.component);
    }
  }, [actualCategory, SliderCategories]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openTournament = () => {
    if (userTeam) {
      navigate(`/torneos/${tournament?.fakeId}/equipos/${userTeam.captainId}`);
    }
  };

  const handleJoinButtonClick = () => {
    if (!isUserLogged) {
      navigate("/autenticar");
    } else {
      if (!userTeam) {
        openModal();
      } else {
        openTournament();
      }
    }
  };

  const handleShowContactBox = () => {
    setShowConfirmation(true);
    setIsModalOpen(true);
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
    setIsModalOpen(false);
    const user = auth.currentUser;
    if (user) {
      const message = `Hola, soy ${user.email || "Usuario Nuevo"} y me uní a la lista de jugadores sin equipo en el torneo actual.`;
      window.open(`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  if (!tournament) {
    return <Splash />;
  }

  return (
    <div>
      <div className={styles.bannerTourDetails}>
        {!isImageLoaded && (
          <div className={styles.splashBannerContainer}>
            <Loader />
          </div>
        )}
        <img
          src={tournament.imagePath.url}
          alt={`${tournament.name} banner`}
          className={styles.bannerImageTourDetails}
          onLoad={handleImageLoad}
          style={{ display: isImageLoaded ? "block" : "none" }}
        />
      </div>

      <div className={styles.tournamentInfoDetails}>
        <div className={`${styles.actionsTourDetails} container`}>
          {userTeam &&
            user?.uid &&
            tournament.paidUsersId &&
            !hasUserPaid(user.uid) && (
              <Box
                sx={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: 4,
                }}
              >
                <Box sx={{ marginRight: 4 }}>
                  <Typography variant="subtitle1" color="warning" gutterBottom>
                    No has completado el pago para unirte al torneo.
                  </Typography>
                </Box>
                <button
                  className={styles.warningButton}
                  onClick={() => setOpenModalPayment(true)}
                >
                  Verificar Pago
                </button>
              </Box>
            )}
          <button
            className={styles.joinButtonTourDetails}
            onClick={userInNoTeam ? handleShowContactBox : handleJoinButtonClick}
            disabled={isTournamentEnded}
          >
            {isTournamentEnded
              ? "Torneo terminado"
              : userInNoTeam
              ? "Unido"
              : !userTeam
              ? "Unirme al Torneo"
              : "Ver Equipo"}
          </button>
        </div>
        <h1 className={styles.titleTourDetails}>{tournament.name}</h1>
        <CategoriesSlider
          categories={SliderCategories}
          categoryNum={actualCategory}
          setCategoryNum={setActualCategory}
        />
        {actualPrevView}
      </div>
      {!userTeam && !userInNoTeam && (
        <JoinTeamModal
          tournament={tournament}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          setUserTeam={setUserTeam}
          setUserNoTeam={setUserInNoTeam}
        />
      )}
      {showConfirmation && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmation}
          title="Confirmación"
          message="Te uniste a la lista de usuarios sin equipo. El administrador te asignará a un equipo que se adecue a tu rango."
          confirmText="Contactar"
        />
      )}
      <Footer />
      <ToastContainer
        style={{ marginTop: "4rem" }}
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <PaymentStepsDialog
        open={openModalPayment}
        setOpen={setOpenModalPayment}
      />
    </div>
  );
};

export default TournamentDetails;
