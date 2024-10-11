import React from "react";
import { convertFromRaw, RawDraftContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { Tournament } from "../../interfaces/interfaces";
import styles from "../../assets/styles/tournamentDetails.module.css";
import InfoContainerStyled from "../../components/tournament/details/InfoContainerStyled";
import {
  FaCodeBranch,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import { Container } from "react-bootstrap";
import TourDetailsSubtitle from "../../components/texts/TourDetailsSubtitle";

interface OverViewSectionProps {
  tournament: Tournament | null;
}

const OverViewSection: React.FC<OverViewSectionProps> = ({ tournament }) => {
  const convertDescriptionToHtml = (description: RawDraftContentState) => {
    const contentState = convertFromRaw(description);
    return stateToHTML(contentState);
  };

  return (
    <Container>
      {tournament != null && (
        <>
          <div className={styles.detailsTourDetails}>
            <InfoContainerStyled
              leftText="Participantes:"
              rightText={`${tournament.participants}`}
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

          <div className={styles.textInfoSection}>
            <div>
              <TourDetailsSubtitle text="Descripción" />
              <div
                className={styles.descriptionTourDetails}
                dangerouslySetInnerHTML={{
                  __html: convertDescriptionToHtml(tournament.description),
                }}
              />
            </div>

            <div>
              <TourDetailsSubtitle text="Reglas" />
              <div
                className={styles.descriptionTourDetails}
                dangerouslySetInnerHTML={{
                  __html: convertDescriptionToHtml(tournament.rules),
                }}
              />
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default OverViewSection;
