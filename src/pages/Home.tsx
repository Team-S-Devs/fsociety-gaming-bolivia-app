import React, { useEffect, useState } from 'react';
import bannerApp from '../assets/backgroundSplash.jpg';
import styles from "../assets/styles/home.module.css";
import SliderHome from '../components/slider/SliderHome';
import TournamentList from '../components/tournament/TournamentList';
import Footer from '../components/Footer';
import { fetchTournaments } from '../contexts/TournamentContext';
import { Tournament } from '../interfaces/interfaces';
import Splash from './Splash';
import { ToastContainer, toast } from 'react-toastify';
import CustomModal from '../components/home/CustomModal';

const Home: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(true);

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchTournaments();
        setTournaments(data);
      } catch (error) {
        toast.error("Error al cargar los torneos. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowModal(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Splash />;
  }

  return (
    <main className={styles.homeContainer}>
      <CustomModal show={showModal} onClose={() => setShowModal(false)} />
      <img src={bannerApp} alt="banner app" className={styles.backgroundImage} />
      <div className={styles.homeContent}>
        <SliderHome />
        <h2 className={styles.subtitleHome}>TORNEOS ACTUALES</h2>
        <TournamentList tournaments={tournaments} />
      </div>
      <Footer />
      <ToastContainer
        style={{marginTop: '4rem'}}
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
