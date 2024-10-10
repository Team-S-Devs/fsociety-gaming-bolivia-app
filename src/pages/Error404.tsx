import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/errorStyle.module.css";
import stylesHome from "../assets/styles/home.module.css";
import bannerApp from '../assets/backgroundSplash.jpg';
import MainButton from "../components/buttons/MainButton";

const Error: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <main className={stylesHome.homeContainer}>
      <img src={bannerApp} alt="banner app" className={stylesHome.backgroundImage} />
        <div className={styles.generalBackground}>
          <div className={styles.containerErrorPage}>
            <h1 className={styles.textCenter}>404</h1>
            <div className={styles.fourZeroFourBg}>
              <img src="https://i.gifer.com/45Ra.gif" alt="error img" />
            </div>
            <h3>¿Te Perdiste?</h3>
            <p>La Página que buscas no está disponible!</p>
            <MainButton title="Volver al Inicio" onClick={goHome}/>
          </div>
      </div>
    </main>
  );
};

export default Error;
