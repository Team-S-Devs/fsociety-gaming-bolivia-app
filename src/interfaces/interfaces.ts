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

export interface UserInterface {
  id?: string;
  nickname: string;
  nicknameLowerCase: string; // This attribute will be used just for nickname unique validation
  email: string;
  phone: number;
  range?: RangeUser;
  teamId?: string;
  type: UserType;
  imagePath: ImageRefPath;
}

export interface TournamentUserInterface {
  id?: string;
  user: UserInterface;
  payment: boolean;
  type: TournamentUserType;
}

export interface ImageRefPath {
    ref: string;
    url: string;
}

export interface Tournament {
  id?: string;
  name: string;
  description: string;
  awards: string[];
  inscriptionPrice: number | "";
  imagePath: ImageRefPath;
  participants: number | "";
  teamLimit: number | "";
  modality: TournamentModality;
  startDate: Timestamp;
  endDate: Timestamp;
  teams: string[];
  createdAt: Timestamp;
  deleted: boolean;
}

export interface Team {
  id?: string;
  name: string;
  captainId: string;
  captainNickname: string;
  captainEmail: string;
  captainPhone: string;
  members: string[];
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
