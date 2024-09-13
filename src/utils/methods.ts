import { Timestamp } from "firebase/firestore";
import { Tournament, TournamentModality } from "../interfaces/interfaces";

export const getEmptyTournament = (): Tournament => {
  return {
    fakeId: new Date().toISOString(),
    name: "",
    description: "",
    awards: [],
    inscriptionPrice: 0,
    imagePath: {
      ref: `tournaments/${Date.now().toString()}`,
      url: ""
    },
    participants: 0,
    teamLimit: 0,
    modality: TournamentModality.ELIMINATION,
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    teams: [],
    createdAt: Timestamp.now(),
    deleted: false
  };
};
