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

interface RulesViewSectionProps {
  tournament: Tournament | null;
}

const RulesViewSection: React.FC<RulesViewSectionProps> = ({ tournament }) => {
  return (
    <div> {tournament != null &&
      <>
        <div>
            Reglasss
        </div>
      </>
    }
    </div>
  );
};

export default RulesViewSection;
