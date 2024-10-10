import React from 'react';
import { Tournament } from '../../interfaces/interfaces'; 
import styles from '../../assets/styles/tournamentCard.module.css';
import TournamentCard from './TournamentCard';

interface TournamentListProps {
  tournaments: Tournament[];
}

const TournamentListComponent: React.FC<TournamentListProps> = ({ tournaments }) => {
  return (
    <div className={styles.tournamentList}>
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
};

export default TournamentListComponent;
