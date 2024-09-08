import React, { useEffect, useState } from 'react';
import logo from '../assets/logoFsociety3.png';
import styles from "../assets/styles/splashScreen.module.css";
import stylesHome from "../assets/styles/home.module.css";
import bannerApp from '../assets/backgroundSplash.jpg';

const Splash: React.FC = () => {
  const loading = true;

  if (!loading) {
    return null;
  }


  return (
    <main className={stylesHome.homeContainer}>
      <img src={bannerApp} alt="banner app" className={stylesHome.backgroundImage} />
      <div className={styles.splashContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <div className={styles.loader}></div>
        </div>
      </div>
    </main>
  );
};

export default Splash;
