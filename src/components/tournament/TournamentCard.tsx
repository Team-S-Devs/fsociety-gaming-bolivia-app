import React from "react";
import { useNavigate } from "react-router-dom";
import { Tournament } from "../../interfaces/interfaces";
import styles from "../../assets/styles/tournamentCard.module.css";
import ItemInfoText from "./ItemInfoText";
import {
  FaCodeBranch,
  FaUsers,
  FaUserPlus,
  FaDollarSign,
  FaTrophy,
} from "react-icons/fa";

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const startDate = tournament.startDate.toDate();
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/torneo/${tournament.fakeId}`);
  };
  const teamLimit =
    tournament.fakeTeamLimit == null ? tournament.teamLimit : tournament.fakeTeamLimit;

  return (
    <div className={styles.tournamentCard} onClick={handleCardClick}>
      <img
        src={tournament.previewImagePath.url}
        alt={tournament.previewImagePath.ref}
        className={styles.tournamentCoverImage}
      />
      <div className={styles.tournamentContent}>
        <h2 className={styles.tournamentTitle}>{tournament.name}</h2>
        <div className="mb-1">
          <div className="d-flex flex-wrap justify-content-between mb-1">
            <ItemInfoText text={tournament.modality} icon={<FaCodeBranch />} />
            <ItemInfoText
              text={`${teamLimit.toString()}v${teamLimit.toString()}`}
              icon={<FaUsers />}
            />
          </div>
          <div>
            <ItemInfoText
              text={`Participantes: ${tournament.participants}`}
              icon={<FaUserPlus />}
            />
          </div>
          <div className="mt-1">
            <ItemInfoText
              backColor="transparent"
              textColor="aqua"
              text={`1er Lugar: ${tournament.awards[0]}`}
              icon={<FaTrophy />}
            />
          </div>
        </div>
      </div>
      <div
        className={`${styles.bottomTournCard} d-flex flex-wrap justify-content-between align-items-center`}
      >
        <ItemInfoText
          text={`Inicio: ${startDate.toLocaleDateString()}`}
          backColor="transparent"
        />
        <ItemInfoText
          text={`${tournament.inscriptionPrice}Bs.`}
          icon={<FaDollarSign />}
          textColor="var(--third-color)"
        />
      </div>
        <div className={styles.getInTourButton} onClick={handleCardClick}>
          Inscribirse
        </div>
    </div>
  );
};

export default TournamentCard;
