import React from "react";
import styles from "../../assets/styles/home.module.css";
import imageLeft from "../../assets/leftBanAbout.png";
import imageRight from "../../assets/backgroundSplash.jpg";
import imageRightFirst from "../../assets/bannRight1.png";
import imageRightSec from "../../assets/bannRight2.png";

const InformationHomeSection: React.FC = () => {

  const scrollToTournaments = () => {
    const tournamentSection = document.getElementById('tournaments-section');
    if (tournamentSection) {
      tournamentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`${styles.containerTextSection} container`}>
      <div className={styles.informationLeftSection}>
        <img
          src={imageLeft}
          alt="Sobre nosotros"
          className={styles.informationLeftImage}
        />
        <div className={styles.informationTextContent}>
          <h2>SOBRE NOSOTROS</h2>
          <p>
            Descubra cómo nuestra plataforma de deportes electrónicos revoluciona
            los torneos de juegos en línea. <strong>fsociety</strong> cuenta con
            amplia experiencia en la organización de torneos de esports, siendo
            reconocida por su fiabilidad y profesionalismo en eventos competitivos.
          </p>
          <div className={styles.linkFromAbout}>
            <a href="#" className={styles.informationLinkText}>
              MÁS INFORMACIÓN &gt;
            </a>
          </div>
        </div>
      </div>

      <div className={styles.informationRightSection}>
        <div className={styles.informationInfoBox}>
          <img
            src={imageRightFirst}
            alt="Twitch Icon"
            className={styles.coverImagediscord}
          />
          <div className={styles.informationIconContainer}>
            <img
              src={imageRight}
              alt="Twitch Icon"
              className={styles.informationLeftImage}
            />
          </div>
          <div className={styles.textCardHomeSection}>
            <h3>ÚNETE A NUESTRO TWITCH</h3>
            <p>
              ¡Únete a nuestro canal de Twitch para interactuar con nuestra comunidad y
              mantenerte actualizado sobre los últimos torneos y transmisiones en vivo!
            </p>
            <a href="https://www.twitch.tv/fsocietygamingtorneos" target="_blank" rel="noopener noreferrer" className={styles.informationLinkText}>
              ÚNETE A NUESTRO TWITCH &gt;
            </a>
          </div>
        </div>

        <div className={styles.informationInfoBox}>
          <img
            src={imageRightSec}
            alt="Mobile Legends Icon"
            className={styles.coverImagediscord}
          />
          <div className={styles.informationIconContainer}>
            <img
              src={imageRight}
              alt="Mobile Legends Background"
              className={styles.informationLeftImage}
            />
          </div>
          <div className={styles.textCardHomeSection}>
            <h3>Mobile Legends Tournaments</h3>
            <p>
              ¡Únete a nuestros emocionantes torneos de <strong>Mobile Legends</strong> y demuestra tus habilidades
              estratégicas! Compite con jugadores de todo el mundo y lleva tu equipo a la gloria en la arena.
            </p>
            <a onClick={scrollToTournaments} className={styles.informationLinkText}>
              PARTICIPA EN NUESTRO PRÓXIMO TORNEO &gt;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationHomeSection;
