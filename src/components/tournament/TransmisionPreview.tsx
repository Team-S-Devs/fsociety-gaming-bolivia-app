import React from "react";
import { Typography, Box } from "@mui/material";
import { Tournament, Team, MatchProgramSet } from "../../interfaces/interfaces";
import styles from "../../assets/styles/transmisionPreview.module.css";

interface Props {
  tournament: Tournament;
  matchesProgram: MatchProgramSet[][];
  roundDate: Date;
  roundName: string;
  selectedRound: number;
}

interface MatchProgramDisplayProps {
  matchProgram: MatchProgramSet;
  matchNumber: number;
  teamA: Team;
  teamB: Team;
}

const MatchProgramDisplay: React.FC<MatchProgramDisplayProps> = ({
  matchProgram,
  matchNumber,
  teamA,
  teamB,
}) => {
  const matchDate = matchProgram.dateTime?.toDate() || new Date();

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <tr className={styles.matchRow}>
      <td className={styles.matchCell}>{matchNumber}</td>
      <td className={`${styles.matchCell} ${styles.teamCell}`}>
        {teamA.name} <strong>vs</strong> {teamB.name}
      </td>
      <td className={styles.matchCell}>{formatTime(matchDate)}</td>
      <td className={styles.matchCell}>
        <Typography className={styles.matchStatus}>
          {matchProgram.online ? "TRANS." : "OFFLINE"}
        </Typography>
      </td>
    </tr>
  );
};

const TransmisionPreview: React.FC<Props> = ({
  tournament,
  matchesProgram,
  roundDate,
  roundName,
  selectedRound,
}) => {
  const matchPrograms = matchesProgram[selectedRound];

  const calculateStartingMatchNumber = (roundIdx: number) => {
    let matchCounter = 1;
    for (let i = 0; i < roundIdx; i++) {
      matchCounter += matchesProgram[i]?.length || 0;
    }
    return matchCounter;
  };

  function formatDate(date: Date): string {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  return (
    <div className={styles.principalContainer}>
      <Box className={styles.boxContainer}>
        <Typography variant="h6" className={styles.roundTitle}>
          {roundName} : {formatDate(roundDate)}
        </Typography>

        <table className={styles.matchesTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>N°</th>
              <th className={styles.tableHeader}>Equipos</th>
              <th className={styles.tableHeader}>Hora</th>
              <th className={styles.tableHeader}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {matchPrograms?.map((matchProgram, matchIdx) => {
              const matchNumber =
                calculateStartingMatchNumber(selectedRound) + matchIdx;
              const match = tournament.matches[roundName]?.[matchIdx];

              const teamA =
                match?.teamA ||
                ({
                  name: `Ganador Partida ${
                    matchNumber - matchPrograms.length * 2 + matchIdx
                  }`,
                } as Team);
              const teamB =
                match?.teamB ||
                ({
                  name: `Ganador Partida ${
                    matchNumber - matchPrograms.length * 2 + matchIdx + 1
                  }`,
                } as Team);

              return (
                <MatchProgramDisplay
                  key={`${selectedRound}-${matchIdx}`}
                  matchProgram={matchProgram}
                  matchNumber={matchNumber}
                  teamA={teamA}
                  teamB={teamB}
                />
              );
            })}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default TransmisionPreview;
