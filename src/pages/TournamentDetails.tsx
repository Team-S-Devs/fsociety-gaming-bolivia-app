import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tournament } from "../interfaces/interfaces";
import styles from "../assets/styles/tournamentDetails.module.css";
import Splash from "./Splash";
import { getTournamentByFakeId } from '../utils/authUtils';
import InfoContainerStyled from "../components/tournament/details/InfoContainerStyled";
import {
  FaCodeBranch,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";

const TournamentDetails: React.FC = () => {
  const { fakeId } = useParams<{ fakeId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    if (!fakeId) {
      console.error("El Fake ID del torneo no está definido");
      return;
    }

    const fetchTournament = async () => {
      const fetchedTournament = await getTournamentByFakeId(fakeId);
      setTournament(fetchedTournament);
    };

    fetchTournament();
  }, [fakeId]);

  if (!tournament) {
    return <Splash />;
  }

  return (
    <div>
      <div className={styles.bannerTourDetails}>
        <img
          src={tournament.imagePath.url}
          alt={`${tournament.name} banner`}
          className={styles.bannerImageTourDetails}
        />
      </div>

      <div className={styles.tournamentInfoDetails}>
        <h1 className={styles.titleTourDetails}>{tournament.name}</h1>
        {/* <p className={styles.descriptionTourDetails}>
          {tournament.description}
        </p> */}
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
            rightText={new Date(tournament.startDate.seconds * 1000).toLocaleDateString()}
            icon={<FaCalendarAlt />}
          />
          <InfoContainerStyled
            leftText="Fecha de finalización:"
            rightText={new Date(tournament.endDate.seconds * 1000).toLocaleDateString()}
            icon={<FaCalendarAlt />}
          />
          <InfoContainerStyled
            leftText="Precio de inscripción:"
            rightText={tournament.inscriptionPrice ? `${tournament.inscriptionPrice}Bs.` : "Gratis"}
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
      </div>
    </div>
  );
};

export default TournamentDetails;
