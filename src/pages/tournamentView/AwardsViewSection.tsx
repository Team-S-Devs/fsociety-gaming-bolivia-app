import React, { useState, useEffect } from "react";
import { Tournament } from "../../interfaces/interfaces";
import { FaTrophy } from "react-icons/fa";
import styles from "../../assets/styles/tournamentDetails.module.css";
import { Link } from "react-router-dom";
import { PagesNames } from "../../utils/constants";
import { FaUserGroup } from "react-icons/fa6";

interface AwardsViewSectionProps {
  tournament: Tournament | null;
}

const AwardsViewSection: React.FC<AwardsViewSectionProps> = ({ tournament }) => {
  const [teamNames, setTeamNames] = useState<{ first?: string; second?: string; third?: string; fourth?: string }>({});

  const getTeamName = (teamId: string | "none"): string | null => {
    console.log(tournament)
    console.log(teamId);
    if (teamId === "none") return null;
    const team = tournament?.teams.find((team) => team.id === teamId);
    return team ? team.name : "Equipo desconocido";
  };

  useEffect(() => {
    if (tournament) {
      setTeamNames({
        first: getTeamName(tournament.rankings?.firstTeamId || "none") || undefined,
        second: getTeamName(tournament.rankings?.secondTeamId || "none") || undefined,
        third: getTeamName(tournament.rankings?.thirdTeamId || "none") || undefined,
        fourth: getTeamName(tournament.rankings?.fourthTeamId || "none") || undefined,
      });
    }
  }, [tournament]);

  const getTeamUrl = (teamId: string): string => {
    return `${PagesNames.Tournaments}/${tournament?.fakeId}${PagesNames.Teams}/${teamId}`;
  };

  return (
    <div className={styles.awardsContainer}>
      {tournament?.awards && (
        <>
          <h3 className={styles.awardsTitle}>Premios</h3>

          {/* Primeros 3 puestos */}
          <div className={styles.topThreeAwards}>
            {tournament.awards.slice(0, 3).map((award, index) => {
              const teamName =
                index === 0
                  ? teamNames.first
                  : index === 1
                  ? teamNames.second
                  : teamNames.third;

              const teamId =
                index === 0
                  ? tournament.rankings?.firstTeamId
                  : index === 1
                  ? tournament.rankings?.secondTeamId
                  : tournament.rankings?.thirdTeamId;

              return (
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
                    <div className={styles.teamAndAwardCont}>
                      <span className={styles.amount}>{award}</span>
                      {teamName && (
                        <div className={styles.lineWinnerTeam}>
                          <span>
                           {'Ganadores: '} 
                          </span>
                          <Link
                            to={getTeamUrl(teamId!)}
                            className={styles.teamName}
                          >
                            <FaUserGroup style={{marginRight: '.2rem'}}/>
                            {teamName}
                          </Link>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Otros puestos */}
          {tournament.awards.length > 3 && (
            <div className={styles.otherAwards}>
              {tournament.awards.slice(3).map((award, index) => {
                const teamName = teamNames.fourth;
                const teamId = tournament.rankings?.fourthTeamId || "none";

                return (
                  <div key={index + 3} className={styles.awardItemOther}>
                    <span className={styles.position}>#{index + 4}</span>
                    <span className={styles.amount}>{award}</span>
                    {teamName && (
                      <Link
                        to={getTeamUrl(teamId!)}
                        className={styles.teamName}
                      >
                        {teamName}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AwardsViewSection;
