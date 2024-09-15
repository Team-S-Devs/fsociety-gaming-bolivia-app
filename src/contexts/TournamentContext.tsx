import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { Tournament, TournamentModality } from "../interfaces/interfaces";
import imageTour from '../assets/bannerFsociety.jpg';
import { Timestamp } from "firebase/firestore";

export const fetchTournaments = async (): Promise<Tournament[]> => {
  const tournamentsRef = collection(db, "tournaments");
  const snapshot = await getDocs(tournamentsRef);
  
  const now = Timestamp.now();
  
  const tournaments = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      
      const tournament: Tournament = {
        id: doc.id,
        name: data.name || '',
        fakeId: data.fakeId || '',
        description: data.description || '',
        imagePath: data.imagePath || imageTour,
        previewImagePath: data.previewImagePath || "imageTour",
        active: data.active || false,
        awards: data.awards || [],
        inscriptionPrice: data.inscriptionPrice || 0,
        participants: data.participants || 0,
        teamLimit: data.teamLimit || 0,
        modality: data.modality || TournamentModality.ELIMINATION,
        startDate: data.startDate || now,
        endDate: data.endDate || now,
        teams: data.teams || [],
        createdAt: data.createdAt || now,
        deleted: data.deleted || false,
      };

      return tournament;
    })
    .filter(tournament => tournament.endDate.seconds >= now.seconds && !tournament.deleted);


  return tournaments;
};
