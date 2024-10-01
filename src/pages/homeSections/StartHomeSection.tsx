import React from 'react';
import { FaTrophy, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/home.module.css';

interface StartHomeSectionProps {
  user: any;
}

const StartHomeSection: React.FC<StartHomeSectionProps> = ({ user }) => {
  const navigate = useNavigate();

  const scrollToTournaments = () => {
    const tournamentSection = document.getElementById('tournaments-section');
    if (tournamentSection) {
      tournamentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegister = () => {
    navigate('/autenticar');
  };

  return ( 
    <div className={`${styles.sectionHomePrincipalContainer} container`}>
      <div className={styles.startTextContainer}>
        <h1>Transforma tu habilidad en Mobile Legends en recompensas reales</h1>
        <h2>Pagos instantáneos y seguros</h2>
        <h4>¡DOMINA EL CAMPO DE BATALLA DE MOBILE LEGENDS Y CONVIÉRTETE EN EL CAMPEÓN QUE TODOS ADMIRAN!</h4>
        {user ? (
          <button onClick={scrollToTournaments}>VER TORNEO</button>
        ) : (
          <button onClick={handleRegister}>REGISTRARSE</button>
        )}
      </div>
      
      <div className={styles.informativeBoxStartContainer}>
        <div className={styles.informativeBox}>
          <FaTrophy className={styles.icon} />
          <h3>ÚNETE, COMPITE, GANA</h3>
          <p>Torneos con pagos reales y variedad de recompensas</p>
        </div>
        <div className={styles.informativeBox}>
          <FaUsers className={styles.icon} />
          <h3>ORGANIZA TU EQUIPO A TU MANERA</h3>
          <p>Consigue un equipo o conseguimos uno para ti de acuerdo a tus habilidades</p>
        </div>
        <div className={styles.informativeBox}>
          <FaMoneyBillWave className={styles.icon} />
          <h3>RECOMPENSAS EN EFECTIVO Y RECARGAS</h3>
          <p>Miles de Bs otorgados en premios</p>
        </div>
      </div>
    </div>
  );
}

export default StartHomeSection;
