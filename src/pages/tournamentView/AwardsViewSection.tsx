import React from "react";
import { Tournament } from "../../interfaces/interfaces";
import styles from "../../assets/styles/tournamentDetails.module.css";

interface AwardsViewSectionProps {
  tournament: Tournament | null;
}

const AwardsViewSection: React.FC<AwardsViewSectionProps> = ({
  tournament,
}) => {
  return (
    <div>
      {" "}
      {tournament != null && (
        <>
          <div>Premios</div>
        </>
      )}
    </div>
  );
};

export default AwardsViewSection;
