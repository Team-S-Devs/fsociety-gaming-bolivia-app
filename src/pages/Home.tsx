import React, { useEffect, useState } from 'react';
import bannerApp from '../assets/backgroundSplash.jpg';
import styles from "../assets/styles/home.module.css";
import SliderHome from '../components/slider/SliderHome';
import TournamentList from '../components/tournament/TournamentList';
import Footer from '../components/Footer';
import { fetchTournaments } from '../contexts/TournamentContext';
import { Tournament } from '../interfaces/interfaces';
import Splash from './Splash';

const Home: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchTournaments();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  if (loading) {
    return <Splash/>;
  }

  return (
    <main className={styles.homeContainer}>
      <img src={bannerApp} alt="banner app" className={styles.backgroundImage} />
      <div className={styles.homeContent}>
        <SliderHome />
        <h2 className={styles.subtitleHome}>TORNEOS ACTUALES</h2>
        <TournamentList tournaments={tournaments} />
      </div>
      <Footer/>
    </main>
  );
};

export default Home;
