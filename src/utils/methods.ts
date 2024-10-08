import { Timestamp } from "firebase/firestore";
import { AdminSettingsInterface, Banner, Tournament, TournamentModality } from "../interfaces/interfaces";
import { nanoid } from "nanoid";
import { StoragePaths } from "./collectionNames";

export const getEmptyTournament = (): Tournament => {
  const dateObj = new Date();
  dateObj.setHours(23, 59, 59, 999);
  dateObj.setDate(dateObj.getDate() + 1);

  const fakeId = nanoid();

  return {
    fakeId,
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
      ref: `${StoragePaths.TournamentsBanners}/${fakeId}`,
      url: "",
    },
    previewImagePath: {
      ref: `${StoragePaths.TournamentsBanners}/${fakeId}`,
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
    matches: {},
    paidUsersId: [],
    ranking: {
      firstTeamId: "none",
      secondTeamId: "none",
      thirdTeamId: "none",
      fourthTeamId: "none"
    },
    usersNoTeam: []
  };
};

export const getEmptyBanner = () : Banner => {
  const fakeId = nanoid();

  return(
    {
      image: {
        url: "",
        ref: `${StoragePaths.Banners}/${fakeId}`
      },
      redirectUrl: "",
      position: 1,
      hidden: false,
    }
  )
}

export const getEmptyAdminSettings = () : AdminSettingsInterface => {
  return (
    {
      twitchChannel: "",
      paymentQR: {
        url: "",
        ref: `${StoragePaths.Admin}/pay_qr_code`
      }
    }
  )
}

export const calculateRoundsNumber = (teamsLength: number): number => {
  if ((teamsLength & (teamsLength - 1)) !== 0) {
    return -1;
  }
  return Math.log2(teamsLength);
}
