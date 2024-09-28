// mockData.ts
import { Tournament, Team, ImageRefPath, TournamentModality } from "../../interfaces/interfaces";
import { Timestamp } from "firebase/firestore"; // Import Timestamp

const generateMockTeams = (numTeams: number): Team[] => {
  const teams: Team[] = [];

  for (let i = 1; i <= numTeams; i++) {
    teams.push({
      id: `team-${i}`,
      name: `Team ${i}`,
      captainId: `captain-${i}`,
      code: `CODE${i}`,
      banner: { 
        ref: `/images/banner${i}.png`, // Correctly using 'ref'
        url: `https://example.com/images/banner${i}.png` // Providing a mock URL
      } as ImageRefPath,
      members: Array.from({ length: 4 }, (_, j) => ({
        memberId: `member-${j + 1}`,
        memberName: `Member ${j + 1} of Team ${i}`,
        payment: Math.random() < 0.5, // Random payment status
      })),
    });
  }

  return teams;
};

// Create a mock tournament data
const createMockTournament = (): Tournament => {
  const now = Timestamp.fromDate(new Date()); // Get current timestamp
  const oneWeekLater = Timestamp.fromDate(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)); // Timestamp for one week later

  return {
    id: "tournament-1",
    fakeId: "tournament-fake-1", // Add a fakeId property
    name: "Mock Tournament",
    description: { blocks: [], entityMap: {} }, // Add a valid description
    rules: { blocks: [], entityMap: {} }, // Add a valid rules object
    awards: ["Trophy", "Medals"], // Add mock awards
    inscriptionPrice: 100, // Add a mock price
    imagePath: { 
      ref: "/images/tournament.png", 
      url: "https://example.com/images/tournament.png" 
    } as ImageRefPath, // Mock ImageRefPath for tournament image
    previewImagePath: { 
      ref: "/images/tournament-preview.png", 
      url: "https://example.com/images/tournament-preview.png" 
    } as ImageRefPath, // Mock ImageRefPath for preview
    participants: 28, // Add participants count
    teamLimit: 4, // Add team limit
    modality: TournamentModality.ELIMINATION, // Use the correct modality
    startDate: now, // Use current timestamp for mock
    endDate: oneWeekLater, // End date one week later
    teams: generateMockTeams(48), // Generate 28 teams
    createdAt: now, // Current timestamp for createdAt
    deleted: false,
    active: true,
  };
};

export { createMockTournament };
