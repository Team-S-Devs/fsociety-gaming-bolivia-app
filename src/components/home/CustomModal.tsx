import React from 'react';
import styles from '../../assets/styles/homeModal.module.css';
import modalImage from '../../assets/backgroundSplash.jpg';
import modalImage2 from '../../assets/modalBan3v2.png';
import { useNavigate } from 'react-router-dom';

interface CustomModalProps {
  show: boolean;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ show, onClose }) => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/autenticar');
  };

  const scrollToTournaments = () => {
    const tournamentSection = document.getElementById('tournaments-section');
    if (tournamentSection) {
      onClose();
      tournamentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>¡ÚNETE A LOS TORNEOS DE MOBILE LEGENDS Y GANA DINERO REAL!</h2>
        <div className={styles.promotionCard}>
          <img src={modalImage} alt="Torneo" className={styles.promoImage} />
          <div className={styles.promoText}>
            <h3>TORNEOS PARA LOS MÁS COMPETITIVOS</h3>
            <p>Convierte tu pasión por los juegos en ganancias reales. ¡Únete ahora para mejorar tu juego y reclamar tus recompensas!</p>
            <button className={styles.registerButton} onClick={handleRegisterClick}>
              REGÍSTRATE AHORA
            </button>
          </div>
        </div>
        <div className={styles.infoLastCard}>
          <img src={modalImage2} alt="Torneo modal" className={styles.promoImage} />
          <div className={styles.extraInfo}>
            <p>¡INSCRÍBETE CON TUS AMIGOS Y ADQUIERE EXPERIENCIA Y MUCHAS RECOMPENSAS!</p>
            <button className={styles.infoButton} onClick={scrollToTournaments}>Ver Torneo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
