import { Timestamp } from "firebase/firestore";

export enum UserType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum TournamentUserType {
  CAPTAIN = "CAPTAIN",
  PLAYER_NO_TEAM = "PLAYER NO TEAM",
  PLAYER_WITH_TEAM = "PLAYER WITH TEAM",
}

export enum RangeUser {
  WARRIOR = "Warrior",
  ELITE = "Elite",
  MASTER = "Master",
  GRANDMASTER = "Grandmaster",
  EPIC = "Epic",
  LEGEND = "Legend",
  MYTHIC = "Mythic"
}


export enum TournamentModality {
  ELIMINATION = "Eliminación",
}

export interface Banner {
  id?: string;
  redirectUrl: string;
  position: number;
  image: ImageRefPath;
  hidden: boolean;
}

export interface AdminSettingsInterface {
  twitchChannel: string;
  paymentQR: ImageRefPath;
}

export interface UserInterface {
  id?: string;
  userId: string;
  nickname: string;
  nicknameLowerCase: string;
  email: string;
  phone: number;
  range?: RangeUser;
  teamId?: string;
  type: UserType;
  imagePath: ImageRefPath;
  bio: string;
}

export interface ImageRefPath {
  ref: string;
  url: string;
}

export interface RawContent {
  blocks: [];
  entityMap: {};
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  scoreA: string;
  scoreB: string;
  played: boolean;
}

export interface Tournament {
  id?: string;
  fakeId: string;
  name: string;
  description: RawContent;
  rules: RawContent;
  awards: string[];
  inscriptionPrice: number | "";
  imagePath: ImageRefPath;
  previewImagePath: ImageRefPath;
  participants: number | "";
  teamLimit: number | "";
  fakeTeamLimit: number | "";
  modality: TournamentModality;
  startDate: Timestamp;
  endDate: Timestamp;
  teams: Team[];
  matches: Record<string, Match[]>;
  usersNoTeam: TeamMember[]; 
  createdAt: Timestamp;
  deleted: boolean;
  active: boolean;
  teamWinnerId?: string;
  rankings: {
    firstTeamId: string | "none";
    secondTeamId: string | "none";
    thirdTeamId: string | "none";
    fourthTeamId: string | "none";
  };
  paidUsersId: {
    paidAt: Timestamp;
    userId: string;
  }[];
  paidUsersJustId: string[];
  registeredUsers: string[];
}

export interface TeamMember {
  memberId: string;
  user: UserInterface;
  paidAt: Timestamp | "not-paid";
  joinedAt: Timestamp;
}

export interface Team {
  id?: string;
  name: string;
  captainId: string;
  code: string;
  banner: ImageRefPath;
  members: TeamMember[];
}

/* Slider */

export interface SliderItem {
  id: number;
  isBanner: boolean;
  dual: boolean;
  title: string;
  desc: string;
  cover: string;
}

export interface Category {
  id: number;
  value: string;
  component: React.ReactNode;
}
