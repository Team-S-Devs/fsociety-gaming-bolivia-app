import React from 'react';
import { Tournament } from '../../interfaces/interfaces';
import styles from '../../assets/styles/tournamentCard.module.css';
import image from '../../assets/bannerFsociety.jpg';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  return (
    <div className={styles.tournamentCard}>
      <img src={image} alt={tournament.name} className={styles.tournamentCoverImage} />
      <div className={styles.tournamentContent}>
        <h2 className={styles.tournamentTitle}>{tournament.name}</h2>
        <p className={styles.tournamentDates}>
          {`Inicio: ${tournament.startDate.toLocaleDateString()} - Fin: ${tournament.endDate.toLocaleDateString()}`}
        </p>
        <p className={styles.tournamentTeams}>
          Equipos participantes: {tournament.teams.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default TournamentCard;
