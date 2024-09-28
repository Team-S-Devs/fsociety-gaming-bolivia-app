import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Category, Tournament } from "../interfaces/interfaces";
import styles from "../assets/styles/tournamentDetails.module.css";
import Splash from "./Splash";
import { getTournamentByFakeId } from "../utils/authUtils";
import CategoriesSlider from "../components/tournament/details/CategoriesSlider";
import OverViewSection from "./tournamentView/OverViewSection";
import { toast, ToastContainer } from "react-toastify";
import RulesViewSection from "./tournamentView/RulesViewSection";
import Footer from "../components/Footer";
import JoinTeamModal from "../components/tournament/tourForm/JoinTeamModal";
import { auth } from "../utils/firebase-config";
import Loader from "../components/Loader";
import ParticipantsViewSection from "./tournamentView/ParticipantsViewSection";

const TournamentDetails: React.FC = () => {
  const { fakeId } = useParams<{ fakeId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [actualCategory, setActualCategory] = useState(1);
  const [actualPrevView, setActualPrevView] = useState<React.ReactNode | null>(
    null
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [userHasTeam, setUserHasTeam] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!fakeId) {
      toast.error("El Fake ID del torneo no está definido");
      return;
    }
  
    const fetchTournament = async () => {
      const fetchedTournament = await getTournamentByFakeId(fakeId);
      setTournament(fetchedTournament);
  
      const user = auth.currentUser;
      if (user && fetchedTournament?.teams) {
        const hasTeam = fetchedTournament.teams.some((team) =>
          team.members.some((member: any) => member.memberId === user.uid)
        );
        setUserHasTeam(hasTeam);
      }
    };
  
    fetchTournament();
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
        component: <RulesViewSection tournament={tournament} />,
      },
      {
        id: 3,
        value: "PARTICIPANTES",
        component: <ParticipantsViewSection tournament={tournament}/>,
      },
      {
        id: 4,
        value: "PREMIOS",
        component: <RulesViewSection tournament={tournament} />,
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

  if (!tournament) {
    return <Splash />;
  }

  return (
    <div>
      <div className={styles.bannerTourDetails}>
        {!isImageLoaded && 
        <div className={styles.splashBannerContainer}>
          <Loader />
        </div>

        }
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
          <button className={styles.joinButtonTourDetails} onClick={openModal}>
            {!userHasTeam ? "Unirme al Torneo" : "Ver Equipo"}
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
      {!userHasTeam &&
          <JoinTeamModal
          tournament={tournament}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          setUserHasTeam={setUserHasTeam}
        />
      }
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
    </div>
  );
};

export default TournamentDetails;
