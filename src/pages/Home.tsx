import React from 'react';
import bannerApp from '../assets/backgroundSplash.jpg';
import styles from "../assets/styles/home.module.css";
import SliderHome from '../components/slider/SliderHome';
import TournamentList from '../components/tournament/TournamentList';
import {Tournaments} from '../utils/data';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <main className={styles.homeContainer}>
      <img src={bannerApp} alt="banner app" className={styles.backgroundImage} />
      <div className={styles.homeContent}>
        <SliderHome />
        <h2 className={styles.subtitleHome}>Torneo Actual</h2>
        <TournamentList tournaments={Tournaments} />
      </div>
      <Footer/>
    </main>
  );
};

export default Home;
