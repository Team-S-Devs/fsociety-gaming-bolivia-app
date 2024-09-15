import { Timestamp } from "firebase/firestore";
import { Tournament, TournamentModality } from "../interfaces/interfaces";

export const getEmptyTournament = (): Tournament => {
  const dateObj = new Date();
  dateObj.setHours(23, 59, 59, 999);
  dateObj.setDate(dateObj.getDate() + 1);

  return {
    fakeId: new Date().toISOString(),
    name: "",
    description: {
      blocks: [],
      entityMap: {},
    },
    rules: {
      blocks: [],
      entityMap: {},
    },
    awards: [],
    inscriptionPrice: 0,
    imagePath: {
      ref: `tournaments/banners/${Date.now().toString()}`,
      url: "",
    },
    previewImagePath: {
      ref: `tournaments/previews/${Date.now().toString()}`,
      url: "",
    },
    participants: 0,
    teamLimit: 0,
    modality: TournamentModality.ELIMINATION,
    startDate: Timestamp.now(),
    endDate: Timestamp.fromDate(dateObj),
    teams: [],
    createdAt: Timestamp.now(),
    deleted: false,
    active: true,
  };
};
