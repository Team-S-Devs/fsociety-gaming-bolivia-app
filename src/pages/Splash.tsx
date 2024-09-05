import React from 'react';
import bannerApp from '../assets/backgroundSplash.jpg';
import styles from "../assets/styles/splashScreen.module.css";

const Splash: React.FC = () => {
  return (
    <main className={styles.splashContainer}>
      <img src={bannerApp} alt="banner app" className={styles.backgroundImage} />
      <div className={styles.splashContent}>
        <h1>CARGANDO....</h1>
      </div>
    </main>
  );
};

export default Splash;
