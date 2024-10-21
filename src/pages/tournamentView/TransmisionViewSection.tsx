import React, { useEffect, useMemo, useState } from "react";
import {
  Category,
  MatchProgramSet,
  Tournament,
} from "../../interfaces/interfaces";
import TransmisionPreview from "../../components/tournament/TransmisionPreview";
import { Timestamp } from "firebase/firestore";
import CategoriesSlider from "../../components/tournament/details/CategoriesSlider";
import { Typography } from "@mui/material";

interface TransmisionViewProps {
  tournament: Tournament;
}

const TransmisionViewSection: React.FC<TransmisionViewProps> = ({
  tournament,
}) => {
  const [leagueType, setLeagueType] = useState(0);
  const [selectedRound, setSelectedRound] = useState(0);

  const [roundKeys, setRoundKeys] = useState<string[]>([]);
  const [matchesProgram, setMatchesProgram] = useState<MatchProgramSet[][]>([]);

  const [roundDates, setRoundDates] = useState<Date[]>([]);

  const selectedLeague =
    leagueType === 0 ? tournament.matches : tournament.matchesLeagueTwo;

  const selectedProgram =
    leagueType === 0
      ? tournament.matchesProgram
      : tournament.matchesLeagueTwoProgram;

  useEffect(() => {
    if (tournament.finalMatch && tournament.finalProgram) setLeagueType(3);
  }, [tournament.finalMatch, tournament.finalProgram]);

  useEffect(() => {
    const generateMatchesProgram = () => {
      const roundNames: string[] = [];
      const matchesNamesInProgram = Object.keys(selectedProgram ?? {}).sort(
        (a, b) => selectedProgram[b].length - selectedProgram[a].length
      );

      const selectedProcess =
        Object.keys(selectedLeague) > Object.keys(selectedProgram)
          ? selectedLeague
          : selectedProgram;

      const generatedProgram: MatchProgramSet[][] = Object.keys(
        selectedProcess ?? {}
      )
        .sort((a, b) => selectedProcess[b].length - selectedProcess[a].length)
        .map((roundKey) => {
          roundNames.push(roundKey);
          return selectedProcess[roundKey]?.map((_match, idx: number) => {
            const existingProgram = selectedProgram?.[roundKey]?.[idx];

            return {
              dateTime:
                existingProgram?.dateTime || Timestamp.fromDate(new Date()),
              online: existingProgram?.online || false,
              id: existingProgram?.id || "",
            };
          });
        });

      setMatchesProgram(generatedProgram);
      setRoundKeys(
        roundNames.length > matchesNamesInProgram.length
          ? roundNames
          : matchesNamesInProgram
      );
    };

    if (leagueType === 3 && tournament.finalProgram) {
      setMatchesProgram([[tournament.finalProgram]]);
      setRoundKeys(["Final"]);
    } else generateMatchesProgram();

    setSelectedRound(0);
  }, [tournament.matches, tournament.matchesProgram, leagueType]);

  useEffect(() => {
    setRoundDates(
      matchesProgram.map((round) => round[0].dateTime.toDate() || new Date())
    );
  }, [matchesProgram]);

  const leagueCategories: Category[] = useMemo(() => {
    const baseCategories = [
      {
        id: 0,
        value: "LIGA 1",
        component: <></>,
      },
      {
        id: 1,
        value: "LIGA 2",
        component: <></>,
      },
    ];

    if (tournament.finalMatch && tournament.finalProgram) {
      baseCategories.push({
        id: 2,
        value: "FINAL",
        component: <></>,
      });
    }

    return baseCategories;
  }, [tournament]);

  const roundsCategories: Category[] = useMemo(
    () =>
      roundKeys.map((key, index) => ({
        id: index,
        value: key,
        component: <></>,
      })),
    [tournament, roundKeys, leagueType]
  );

  return (
    <>
      <CategoriesSlider
        categories={leagueCategories}
        categoryNum={leagueType}
        setCategoryNum={setLeagueType}
      />
      <CategoriesSlider
        categories={roundsCategories}
        categoryNum={selectedRound}
        setCategoryNum={setSelectedRound}
      />
      {leagueType === 3 ? (
        <></>
      ) : roundKeys.length === 0 ? (
        <Typography>Aún no hay partidas programadas.</Typography>
      ) : (
        <TransmisionPreview
          selectedRound={selectedRound}
          tournament={tournament}
          roundName={roundKeys[selectedRound]}
          roundDate={roundDates[selectedRound] ?? new Date()}
          matchesProgram={matchesProgram}
        />
      )}
      <br />
    </>
  );
};

export default TransmisionViewSection;
