import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tournament, Team } from "../../interfaces/interfaces";
import { getTournamentByFakeId } from "../../utils/authUtils";
import styles from '../../assets/styles/teamsParticipants.module.css';
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Splash from "../Splash";
import PrincipalContainer from "../../components/PrincipalContainer";

const TeamView: React.FC = () => {
  const { fakeId, captainId } = useParams<{ fakeId: string; captainId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournamentAndTeam = async () => {
      if (!fakeId || !captainId) {
        toast.error("No tournament or team ID provided");
        setLoading(false);
        return;
      }

      const fetchedTournament = await getTournamentByFakeId(fakeId);
      if (!fetchedTournament) {
        toast.error("Tournament not found");
        setLoading(false);
        return;
      }

      setTournament(fetchedTournament);

      const foundTeam = fetchedTournament.teams.find((t: Team) => t.captainId === captainId);
      console.log("queeee")
      setTeam(foundTeam || null);
      setLoading(false);
    };

    fetchTournamentAndTeam();
  }, [fakeId, captainId]);

  if (loading) {
    return <Splash />;
  }

  if (!team) {
    return <div style={{marginTop: '200px'}}>Team not found.</div>;
  }

  return (
    <PrincipalContainer>
        <div className={styles.teamViewContainer}>
            <h1>{team.name}</h1>
            <h2>Members:</h2>
            <ul>
            {team.members.map((member) => (
                <li key={member.memberId}>{member.memberName}</li>
            ))}
            </ul>
        </div>
    </PrincipalContainer>
  );
};

export default TeamView;
