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

  useEffect(() => {
    if (tournament.finalMatch && tournament.finalProgram) setLeagueType(2);
  }, [tournament.finalMatch, tournament.finalProgram]);

  useEffect(() => {
    const generateMatchesProgram = () => {
      const roundNames: string[] = [];
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

    if (leagueType === 2 && tournament.finalProgram) {
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

    if (tournament.finalProgram) {
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

  const getClosestDateIndex = (dates: Date[]) => {
    const today = new Date();

    return dates.reduce((closestIndex, currentDate, currentIndex, array) => {
      const diffCurrent = Math.abs(currentDate.getTime() - today.getTime());
      const diffClosest = Math.abs(
        array[closestIndex].getTime() - today.getTime()
      );

      return diffCurrent < diffClosest ? currentIndex : closestIndex;
    }, 0);
  };

  useEffect(() => {
    const idx = getClosestDateIndex(
      matchesProgram.map((matchProgram) => {
        return matchProgram[0]?.dateTime.toDate() ?? new Date();
      })
    );
    setSelectedRound(idx);
  }, [roundKeys]);

  const finalMathProgram = tournament.finalProgram;

  return (
    <>
      <CategoriesSlider
        categories={leagueCategories}
        categoryNum={leagueType}
        setCategoryNum={setLeagueType}
      />
      {leagueType != 2 && (
        <CategoriesSlider
          categories={roundsCategories}
          categoryNum={selectedRound}
          setCategoryNum={setSelectedRound}
        />
      )}
      {leagueType === 2 ? (
        <>
          {finalMathProgram && (
            <TransmisionPreview
              matchesProgram={[[finalMathProgram]]}
              tournament={tournament}
              roundDate={finalMathProgram.dateTime.toDate()}
              roundName={"FINAL"}
              selectedRound={0}
              isFinal
            />
          )}
        </>
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
