import React from 'react';
import Header from '../components/Header';
import bannerApp from '../assets/backgroundSplash.png';
import styles from "../assets/styles/splashScreen.module.css";

const Splash: React.FC = () => {
  return (
    <main className={styles.splashContainer}>
      <Header />
      <img src={bannerApp} alt="banner app" className={styles.backgroundImage} />
      <div className={styles.splashContent}>
        <h1>Welcome to the Home Page</h1>
      </div>
    </main>
  );
};

export default Splash;
