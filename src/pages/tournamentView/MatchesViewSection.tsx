import React, { useEffect, useState } from "react";
import { Match, Tournament } from "../../interfaces/interfaces";
import { Typography } from "@mui/material";
import { Bracket, IRoundProps, Seed, SeedItem, SeedTeam } from "react-brackets";

interface MatchesViewSectionProps {
  tournament: Tournament | null;
}

const MatchesViewSection: React.FC<MatchesViewSectionProps> = ({
  tournament,
}) => {
  const [rounds, setRounds] = useState<Match[][]>([]);

  useEffect(() => {
    if (tournament == null) return;
    setRounds(
      Object.keys(tournament.matches)
        .sort()
        .map((key) => tournament.matches[key])
    );
  }, [tournament?.matches]);

  const id = "1";

  const renderCustomSeed = ({
    seed,
    breakpoint,
  }: {
    seed: any;
    breakpoint: number;
  }) => {
    const teamA = seed.teams[0];
    const teamB = seed.teams[1];

    const isTeamAWinner =
      teamA.score !== "" && teamB.score !== "" && teamA.score > teamB.score;
    const isTeamBWinner =
      teamA.score !== "" && teamB.score !== "" && teamB.score > teamA.score;

    const winnerTeam = isTeamAWinner ? teamA : teamB;

    const winnerStyle = {
      backgroundColor: id === winnerTeam.id ? "#43c1c1" : "#279090",
      color: "white",
    };
    const loserStyle = { backgroundColor: "#262b3e", color: "white" };
    const neutralStyle = { backgroundColor: "#131533", color: "white" };

    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 18 }}>
        <SeedItem>
          <SeedTeam
            style={
              isTeamAWinner
                ? winnerStyle
                : isTeamBWinner
                ? loserStyle
                : neutralStyle
            }
          >
            <span>{teamA.name}</span>
            <span>{teamA.score}</span>
          </SeedTeam>

          <SeedTeam
            style={
              isTeamBWinner
                ? winnerStyle
                : isTeamAWinner
                ? loserStyle
                : neutralStyle
            }
          >
            <span>{teamB.name}</span>
            <span>{teamB.score}</span>
          </SeedTeam>
        </SeedItem>
      </Seed>
    );
  };

  const renderRoundsBrackets = () => {
    if (rounds.length === 0) {
      return <Typography>Aún no se jugó ningún enfrentamiento.</Typography>;
    }

    const bracketRounds: IRoundProps[] = rounds.map((round, roundIndex) => ({
      title: round.length === 1 ? "FINAL" : `Ronda ${roundIndex + 1}`,
      seeds: round.map((match) => ({
        id: match.id,
        teams: [
          {
            id: match.teamA.id,
            name: match.teamA.name,
            score: match.scoreA || "",
          },
          {
            id: match.teamA.id,
            name: match.teamB.name,
            score: match.scoreB || "",
          },
        ],
      })),
    }));

    return (
      <Bracket rounds={bracketRounds} renderSeedComponent={renderCustomSeed} />
    );
  };

  return (
    <div>
      {tournament != null && (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          {renderRoundsBrackets()}
        </div>
      )}
    </div>
  );
};

export default MatchesViewSection;
