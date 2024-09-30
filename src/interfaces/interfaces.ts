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
  RANGE_1 = "RANGE 1",
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
  userId: string; // length 8, user id of mobile legends
  nickname: string;
  nicknameLowerCase: string; // This attribute will be used just for nickname unique validation
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
  blocks: [],
  entityMap: {}
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  winner: Team | "no-winner";  
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
  modality: TournamentModality;
  startDate: Timestamp;
  endDate: Timestamp;
  teams: Team[];
  matches: Match[][]; 
  createdAt: Timestamp;
  deleted: boolean;
  active: boolean;
  teamWinnerId?: string;
}

export interface TeamMember {
  memberId: string;
  payment: boolean;
  user: UserInterface;
  paidAt: Timestamp | "not-paid";
}

export interface Team {
  id?: string;
  name: string;
  captainId: string;
  code: string;
  banner: ImageRefPath;
  payment: boolean;
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
