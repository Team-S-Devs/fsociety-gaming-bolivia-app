import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { Tournament, TournamentModality } from "../interfaces/interfaces";
import imageTour from '../assets/bannerFsociety.jpg';
import imageBlank from '../assets/blanckImg.png';

export const fetchTournaments = async (): Promise<{ currentTournaments: Tournament[]; pastTournaments: Tournament[] }> => {
  const tournamentsRef = collection(db, "tournaments");
  const snapshot = await getDocs(tournamentsRef);
  
  const now = Timestamp.now();
  
  const tournaments = snapshot.docs.map((doc) => {
    const data = doc.data();

    const tournament: Tournament = {
      id: doc.id,
      fakeId: data.fakeId || '',
      name: data.name || '',
      description: data.description || { blocks: [], entityMap: {} },
      rules: data.rules || { blocks: [], entityMap: {} },
      awards: data.awards || [],
      inscriptionPrice: data.inscriptionPrice || 0,
      imagePath: data.imagePath || imageTour,
      previewImagePath: data.previewImagePath || imageBlank,
      participants: data.participants || 0,
      teamLimit: data.teamLimit || 0,
      modality: data.modality || TournamentModality.ELIMINATION,
      startDate: data.startDate || now,
      endDate: data.endDate || now,
      teams: data.teams || [],
      usersNoTeam: data.usersNoTeam || [],
      matches: data.matches || {},
      createdAt: data.createdAt || now,
      deleted: data.deleted || false,
      active: data.active || false,
      teamWinnerId: data.teamWinnerId || undefined,
      rankings: data.rankings || {
        firstTeamId: "none",
        secondTeamId: "none",
        thirdTeamId: "none",
        fourthTeamId: "none",
      },
      paidUsersId: data.paidUsersId || undefined
    };

    return tournament;
  });

  const currentTournaments = tournaments.filter(tournament => tournament.endDate.seconds >= now.seconds && !tournament.deleted);
  const pastTournaments = tournaments.filter(tournament => tournament.endDate.seconds < now.seconds && !tournament.deleted);

  return { currentTournaments, pastTournaments };
};
