import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { Tournament, TournamentModality } from "../interfaces/interfaces";
import imageTour from '../assets/bannerFsociety.jpg';

export const fetchTournaments = async (): Promise<Tournament[]> => {
  const tournamentsRef = collection(db, "tournaments");
  const snapshot = await getDocs(tournamentsRef);
  const tournaments = snapshot.docs.map((doc) => {
    const data = doc.data();
    
    const tournament: Tournament = {
      id: doc.id,
      name: data.name || '',
      description: data.description || '',
      imagePath: data.imagePath || imageTour,
      awards: data.awards || [],
      inscriptionPrice: data.inscriptionPrice || 0,
      participants: data.participants || 0,
      teamLimit: data.teamLimit || 0,
      modality: data.modality || TournamentModality.ELIMINATION,
      startDate: data.startDate,
      endDate: data.endDate,
      teams: data.teams || [],
      createdAt: data.createdAt,
    };

    return tournament;
  });

  return tournaments;
};
