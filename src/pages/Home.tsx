import React, { useEffect, useState } from "react";
import bannerApp from "../assets/backgroundSplash.jpg";
import styles from "../assets/styles/home.module.css";
import SliderHome from "../components/slider/SliderHome";
import TournamentList from "../components/tournament/TournamentList";
import Footer from "../components/Footer";
import { fetchTournaments } from "../contexts/TournamentContext";
import { Tournament } from "../interfaces/interfaces";
import Splash from "./Splash";
import { ToastContainer, toast } from "react-toastify";
import CustomModal from "../components/home/CustomModal";
import { useUserContext } from "../contexts/UserContext";
import StartHomeSection from "./homeSections/StartHomeSection";
import InformationHomeSection from "./homeSections/InformationHomeSection";
import PastTournamentsSlider from "../components/home/PastTournamentsSlider";

const Home: React.FC = () => {
  const [currentTournaments, setCurrentTournaments] = useState<Tournament[]>(
    []
  );
  const [pastTournaments, setPastTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { user, isAdmin } = useUserContext();

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const { currentTournaments, pastTournaments } =
          await fetchTournaments();
        setCurrentTournaments(currentTournaments);
        setPastTournaments(pastTournaments);
      } catch (error) {
        toast.error(
          "Error al cargar los torneos. Por favor, inténtelo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  useEffect(() => {
    if (!user && !isAdmin) {
      setShowModal(true);
    }

    const interval = setInterval(() => {
      if (!user && !isAdmin) {
        setShowModal(true);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isAdmin]);

  if (loading) {
    return <Splash />;
  }

  return (
    <main className={styles.homeContainer}>
      <CustomModal show={showModal} onClose={() => setShowModal(false)} />
      <img
        src={bannerApp}
        alt="banner app"
        className={styles.backgroundImage}
      />
      <div id="tournaments-section" className={styles.homeContent}>
        <SliderHome />
        <div id="list-tournaments">
          <h2 className={styles.subtitleHome}>TORNEOS ACTUALES</h2>
          <TournamentList tournaments={currentTournaments} />
        </div>
      </div>
      <div id="information-home-section">
        <InformationHomeSection />

        {pastTournaments.length > 0 && (
          <div
            id="past-tournaments-section"
            className={`${styles.homeContent} ${styles.pastToursContent}`}
          >
            <h2 className={styles.subtitleHome}>TORNEOS PASADOS</h2>
            <PastTournamentsSlider tournaments={pastTournaments} />
          </div>
        )}
      </div>
      <div id="start-home-section">
        <StartHomeSection user={user} />
      </div>
      <Footer />
      <ToastContainer
        style={{ marginTop: "4rem" }}
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
    </main>
  );
};

export default Home;
