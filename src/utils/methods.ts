import { Timestamp } from "firebase/firestore";
import {
  AdminSettingsInterface,
  Banner,
  PaymentQRData,
  Tournament,
  TournamentModality,
} from "../interfaces/interfaces";
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
    fakeTeamLimit: 0,
    modality: TournamentModality.ELIMINATION,
    startDate: Timestamp.now(),
    endDate: Timestamp.fromDate(dateObj),
    teams: [],
    leagueTwoTeamsIds: [],
    createdAt: Timestamp.now(),
    deleted: false,
    active: true,
    matches: {},
    matchesProgram: {},
    matchesLeagueTwo: {},
    matchesLeagueTwoProgram: {},
    paidUsersId: [],
    rankings: {
      firstTeamId: "none",
      secondTeamId: "none",
      thirdTeamId: "none",
      fourthTeamId: "none",
    },
    usersNoTeam: [],
    registeredUsers: [],
    paidUsersJustId: [],
  };
};

export const getEmptyBanner = (): Banner => {
  const fakeId = nanoid();

  return {
    image: {
      url: "",
      ref: `${StoragePaths.Banners}/${fakeId}`,
    },
    redirectUrl: "",
    position: 1,
    hidden: false,
  };
};

export const getEmptyPayment = (): PaymentQRData => {
  return { accountNumber: "", accountName: "", bank: "" };
};

export const getEmptyAdminSettings = (): AdminSettingsInterface => {
  return {
    twitchChannel: "",
    paymentQR: {
      url: "",
      ref: `${StoragePaths.Admin}/pay_qr_code`,
    },
    paymentQRData: getEmptyPayment(),
    paymentQRTwo: {
      url: "",
      ref: `${StoragePaths.Admin}/pay_qr_code2`,
    },
    paymentQRDataTwo: getEmptyPayment(),
  };
};

const nearestPowerOfTwo = (teamsLength: number) => {
  const lowerPower = Math.pow(2, Math.floor(Math.log2(teamsLength)));
  const higherPower = Math.pow(2, Math.ceil(Math.log2(teamsLength)));

  // Return the one that is closer to the original number
  return (teamsLength - lowerPower < higherPower - teamsLength) ? lowerPower : higherPower;
};

export const calculateRoundsNumber = (teamsLength: number): number => {
  const nearest = nearestPowerOfTwo(teamsLength);
  console.log(nearest)
  return Math.log2(nearest);
};

export const timestampToDate = (firebaseTimestamp: Timestamp): string => {
  try {
    const date = firebaseTimestamp.toDate();
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
};

export const timestampToDateTime = (firebaseTimestamp: Timestamp): string => {
  try {
    const date = firebaseTimestamp.toDate();
    return (
      date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " - " +
      date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch (e) {
    return "";
  }
};
