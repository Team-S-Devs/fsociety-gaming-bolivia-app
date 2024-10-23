import React, { useEffect, useMemo, useState } from "react";
import { Category, Match, Tournament } from "../../interfaces/interfaces";
import { Typography } from "@mui/material";
import { Bracket, IRoundProps, Seed, SeedItem, SeedTeam } from "react-brackets";
import CategoriesSlider from "../../components/tournament/details/CategoriesSlider";
import FinalView from "../../components/tournament/FinalView";

interface MatchesViewSectionProps {
  tournament: Tournament | null;
}

const MatchesViewSection: React.FC<MatchesViewSectionProps> = ({
  tournament,
}) => {
  const [rounds, setRounds] = useState<Match[][]>([]);
  const [rounds2, setRounds2] = useState<Match[][]>([]);
  const [roundKeys, setRoundKeys] = useState<string[]>([]);

  const [leagueType, setLeagueType] = useState<number>(0);

  useEffect(() => {
    const generateMatchesProgram = () => {
      if (tournament === null) return;

      const selectedProgram =
        leagueType === 0
          ? tournament.matchesProgram
          : tournament.matchesLeagueTwoProgram;

      const selectedLeague =
        leagueType === 0 ? tournament.matches : tournament.matchesLeagueTwo;

      const matchesNamesInProgram = Object.keys(selectedProgram ?? {}).sort(
        (a, b) => selectedProgram[b].length - selectedProgram[a].length
      );

      const selectedProcess =
        Object.keys(selectedLeague).length > Object.keys(selectedProgram).length
          ? selectedLeague
          : selectedProgram;

      const processArr = Object.keys(selectedProcess ?? {}).sort(
        (a, b) => selectedProcess[b].length - selectedProcess[a].length
      );

      setRoundKeys(
        processArr.length > matchesNamesInProgram.length
          ? processArr
          : matchesNamesInProgram
      );
    };

    generateMatchesProgram();
  }, [tournament?.matches, tournament?.matchesProgram, leagueType]);

  useEffect(() => {
    if (tournament?.finalMatch && tournament?.finalProgram) setLeagueType(2);
  }, [tournament?.finalMatch, tournament?.finalProgram]);

  useEffect(() => {
    if (tournament == null) return;
    setRounds(
      Object.keys(tournament.matches)
        .sort(
          (a, b) => tournament.matches[b].length - tournament.matches[a].length
        )
        .map((key) => tournament.matches[key])
    );

    setRounds2(
      Object.keys(tournament.matchesLeagueTwo)
        .sort(
          (a, b) =>
            tournament.matchesLeagueTwo[b].length -
            tournament.matchesLeagueTwo[a].length
        )
        .map((key) => tournament.matchesLeagueTwo[key])
    );
  }, [tournament?.matches, tournament?.matchesLeagueTwo]);

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

    const winnerStyle = {
      backgroundColor: "#2fb2b2",
      color: "white",
    };
    const loserStyle = { backgroundColor: "#262b3e", color: "white" };
    const neutralStyle = { backgroundColor: "#131533", color: "white" };

    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 15 }}>
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

  const renderRoundsBrackets = (rounds: Match[][]) => {
    if (rounds.length === 0) {
      return (
        <Typography py={12}>Aún no se jugó ningún enfrentamiento.</Typography>
      );
    }

    const bracketRounds: IRoundProps[] = rounds.map((round, roundIndex) => ({
      title: roundKeys[roundIndex],
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
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <Bracket
          rounds={bracketRounds}
          renderSeedComponent={renderCustomSeed}
        />
      </div>
    );
  };

  const leagueCategories: Category[] = useMemo(() => {
    const baseCategories = [
      {
        id: 0,
        value: "LIGA 1",
        component: <div>{renderRoundsBrackets(rounds)}</div>,
      },
      {
        id: 1,
        value: "LIGA 2",
        component: <>{renderRoundsBrackets(rounds2)}</>,
      },
    ];

    if (tournament?.finalMatch && tournament.finalProgram) {
      baseCategories.push({
        id: 2,
        value: "FINAL",
        component: <FinalView tournament={tournament} />,
      });
    }

    return baseCategories;
  }, [tournament, rounds, rounds2]);

  return (
    <div>
      {tournament != null && (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <CategoriesSlider
            categories={leagueCategories}
            categoryNum={leagueType}
            setCategoryNum={setLeagueType}
          />
          {leagueCategories[leagueType]?.component ?? <></>}
        </div>
      )}
    </div>
  );
};

export default MatchesViewSection;
