import React from "react";
import { Tournament } from "../../interfaces/interfaces";
import { FaTrophy } from "react-icons/fa";
import styles from "../../assets/styles/tournamentDetails.module.css";

interface AwardsViewSectionProps {
  tournament: Tournament | null;
}

const AwardsViewSection: React.FC<AwardsViewSectionProps> = ({
  tournament,
}) => {
  return (
    <div className={styles.awardsContainer}>
      {tournament?.awards && (
        <>
          <h3 className={styles.awardsTitle}>Premios</h3>

          {/* Primeros 3 puestos */}
          <div className={styles.topThreeAwards}>
            {tournament.awards.slice(0, 3).map((award, index) => (
              <div
                key={index}
                className={`${styles.awardItem} ${
                  index === 0
                    ? styles.gold
                    : index === 1
                    ? styles.silver
                    : styles.bronze
                }`}
              >
                <div className={styles.awardIcon}>
                  <FaTrophy className={styles.trophyIcon} />
                </div>
                <div className={styles.awardDetails}>
                  <span className={styles.position}>#{index + 1}</span>
                  <span className={styles.amount}>{award}</span>
                </div>
              </div>
            ))}
          </div>

          {tournament.awards.length > 3 && (
            <div className={styles.otherAwards}>
              {tournament.awards.slice(3).map((award, index) => (
                <div key={index + 3} className={styles.awardItemOther}>
                  <span className={styles.position}>#{index + 4}</span>
                  <span className={styles.amount}>{award}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AwardsViewSection;
