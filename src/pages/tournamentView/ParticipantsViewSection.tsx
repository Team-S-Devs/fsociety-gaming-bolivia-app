import React, { useState } from "react";
import { Tournament, Team } from "../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/styles/teamsParticipants.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface ParticipantsViewSectionProps {
  tournament: Tournament | null;
}

const ParticipantsViewSection: React.FC<ParticipantsViewSectionProps> = ({
  tournament,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const paginatedTeams = () => {
    return (
      tournament?.teams.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ) || []
    );
  };

  const totalTeams = tournament?.teams.length || 0;
  const totalPages = Math.ceil(totalTeams / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const getPaginationNumbers = () => {
    const paginationNumbers: number[] = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else {
      if (currentPage > 1) paginationNumbers.push(currentPage - 1);
      paginationNumbers.push(currentPage);
      if (currentPage < totalPages) paginationNumbers.push(currentPage + 1);
    }
    return paginationNumbers;
  };

  const handleTeamSelect = (team: Team) => {
    navigate(`/torneos/${tournament?.fakeId}/equipos/${team.captainId}`);
  };

  return (
    <div className={styles.participantsSection}>
      <h2>Teams</h2>
      <div className="table-responsive container mt-3">
        <table className={`${styles.participantsTable} table table-striped`}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {tournament ? (
              paginatedTeams().map((team: Team) => (
                <tr
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{team.name}</td>
                  <td>
                    {team.members.length}/{tournament.teamLimit}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>Loading teams...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        <div
          className={`${styles.paginationItem} ${
            currentPage === 1 ? styles.disabledButton : ""
          }`}
          onClick={handlePrevious}
          style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
        >
          {"<"}
        </div>

        {getPaginationNumbers().map((page) => (
          <div
            key={page}
            className={`${styles.paginationItem} ${
              currentPage === page ? styles.activePageButton : ""
            }`}
            onClick={() => setCurrentPage(page)}
            style={{ cursor: "pointer" }}
          >
            {page}
          </div>
        ))}

        <div
          className={`${styles.paginationItem} ${
            currentPage === totalPages ? styles.disabledButton : ""
          }`}
          onClick={handleNext}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          {">"}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsViewSection;
