import React from 'react';
import { Tournament } from '../../interfaces/interfaces';
import styles from '../../assets/styles/tournamentCard.module.css';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const startDate = tournament.startDate.toDate();
  const endDate = tournament.endDate.toDate();
  
  return (
    <div className={styles.tournamentCard}>
      <img src={tournament.imagePath} alt={tournament.name} className={styles.tournamentCoverImage} />
      <div className={styles.tournamentContent}>
        <h2 className={styles.tournamentTitle}>{tournament.name}</h2>
        <p className={styles.tournamentDates}>
          {`Inicio: ${startDate.toLocaleDateString()} - Fin: ${endDate.toLocaleDateString()}`}
        </p>
        <p className={styles.tournamentTeams}>
          Equipos participantes: {tournament.teams.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default TournamentCard;
