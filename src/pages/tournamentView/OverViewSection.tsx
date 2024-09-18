import React from "react";
import { Tournament } from "../../interfaces/interfaces";
import styles from "../../assets/styles/tournamentDetails.module.css";
import InfoContainerStyled from "../../components/tournament/details/InfoContainerStyled";
import {
  FaCodeBranch,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";

interface OverViewSectionProps {
  tournament: Tournament | null;
}

const OverViewSection: React.FC<OverViewSectionProps> = ({ tournament }) => {
  return (
    <div> {tournament != null &&
      <>
      <div className={styles.detailsTourDetails}>
        <InfoContainerStyled
          leftText="Participantes:"
          rightText={`${tournament.participants}/64`}
          icon={<FaUsers />}
        />
        <InfoContainerStyled
          leftText="Modalidad:"
          rightText={tournament.modality}
          icon={<FaCodeBranch />}
        />
        <InfoContainerStyled
          leftText="Fecha de inicio:"
          rightText={new Date(
            tournament.startDate.seconds * 1000
          ).toLocaleDateString()}
          icon={<FaCalendarAlt />}
        />
        <InfoContainerStyled
          leftText="Fecha de finalización:"
          rightText={new Date(
            tournament.endDate.seconds * 1000
          ).toLocaleDateString()}
          icon={<FaCalendarAlt />}
        />
        <InfoContainerStyled
          leftText="Precio de inscripción:"
          rightText={
            tournament.inscriptionPrice
              ? `${tournament.inscriptionPrice}Bs.`
              : "Gratis"
          }
          icon={<FaDollarSign />}
        />
      </div>

      <div className={styles.awardsTourDetails}>
        <h2>Premios</h2>
        <ul>
          {tournament.awards.map((award, index) => (
            <li key={index} className={styles.awardItemTourDetails}>
              {award}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actionsTourDetails}>
        <button className={styles.joinButtonTourDetails}>
          Unirme al Torneo
        </button>
        <button className={styles.shareButtonTourDetails}>Compartir</button>
      </div>
      </>
    }
    </div>
  );
};

export default OverViewSection;
