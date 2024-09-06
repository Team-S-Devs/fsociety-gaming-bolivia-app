import { Timestamp } from "firebase/firestore";

export enum UserType {
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum TournamentUserType {
    CAPTAIN = "CAPTAIN",
    PLAYER_NO_TEAM = "PLAYER NO TEAM",
    PLAYER_WITH_TEAM = "PLAYER WITH TEAM"
}

export enum RangeUser {
    RANGE_1 = "RANGE 1"
}

export interface UserInterface {
    id?: string;
    name: string;
    email: string;
    phone: number;
    range?: RangeUser;
    teamId?: string;
    type: UserType;
}

export interface TournamentUserInterface {
    id?: string;
    user: UserInterface; 
    payment: boolean;
    type: TournamentUserType;
}

export interface Tournament {
    id?: string;
    name: string;
    startDate: Timestamp;
    endDate: Timestamp;
    teams: string[];
    createdAt: Timestamp;
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
