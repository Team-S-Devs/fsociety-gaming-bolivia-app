import { Timestamp } from "firebase/firestore";
import { Tournament, TournamentModality } from "../interfaces/interfaces";

export const getEmptyTournament = (): Tournament => {
  return {
    name: "",
    description: "",
    awards: [],
    inscriptionPrice: 0,
    imagePath: {
      ref: "",
      url: ""
    },
    participants: 0,
    teamLimit: 0,
    modality: TournamentModality.ELIMINATION,
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    teams: [],
    createdAt: Timestamp.now(),
  };
};
