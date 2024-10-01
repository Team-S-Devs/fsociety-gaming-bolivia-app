import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tournament, Team, TeamMember } from "../../interfaces/interfaces";
import { getTournamentByFakeId } from "../../utils/authUtils";
import styles from "../../assets/styles/teamsParticipants.module.css";
import imageBanner from "../../assets/bannerTeam5.png";
import stylesDetails from "../../assets/styles/tournamentDetails.module.css";
import Loader from "../../components/Loader";
import { toast, ToastContainer } from "react-toastify";
import Splash from "../Splash";
import PrincipalContainer from "../../components/PrincipalContainer";
import Footer from "../../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import useWindowSize from "../../hooks/useWindowSize";
import { auth } from "../../utils/firebase-config";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
// import TeamImageUpload from "../../components/teams/TeamImageUploader";

const TeamView: React.FC = () => {
  const { fakeId, captainId } = useParams<{
    fakeId: string;
    captainId: string;
  }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { width } = useWindowSize();
  const [isMember, setIsMember] = useState(false);
  const [isCaptain, setIsCaptain] = useState(false);

  useEffect(() => {
    const fetchTournamentAndTeam = async () => {
      try {
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

        const foundTeam = fetchedTournament.teams.find(
          (t: Team) => t.captainId === captainId
        );
        setTeam(foundTeam || null);

        const user = auth.currentUser;
        if (user && foundTeam) {
          const member = foundTeam.members.find(
            (member: TeamMember) => member.memberId === user.uid
          );
          setIsMember(!!member);
          setIsCaptain(user.uid === captainId);
        }

        setLoading(false);
      } catch (error) {
        toast.error("Error fetching tournament or team data");
        setLoading(false);
      }
    };

    fetchTournamentAndTeam();
  }, [fakeId, captainId]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleCopyCode = () => {
    if (team?.code) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(team.code)
          .then(() => toast.success("Código copiado"))
          .catch(() => toast.error("Error al copiar el código"));
      } else {
        toast.error("Clipboard API not supported");
      }
    }
  };

  const functionHola = () => {
    toast.error("watafak")
  }
  
  if (loading) {
    return <Splash />;
  }

  if (!team) {
    return <div style={{ marginTop: "200px" }}>Team not found.</div>;
  }
  const getCodeView = (
    <div
      className={`${styles.codeAction} container ${styles.teamCodeContainer}`}
    >
      <h4>Code:</h4>
      <div
        className={styles.teamCodeFigure}
        onClick={handleCopyCode}
        style={{ cursor: "pointer" }}
      >
        {team.code}
      </div>
    </div>
  );

  return (
    <PrincipalContainer>
      <div className={styles.teamViewContainer}>
        <div className={styles.bannerTeam}>
          {!isImageLoaded && (
            <div className={stylesDetails.splashBannerContainer}>
              <Loader />
            </div>
          )}
          <img
            src={imageBanner}
            alt={`${team.name} banner`}
            className={styles.bannerImageTeam}
            onLoad={handleImageLoad}
          />
        </div>

        <div className={styles.teamInfoDetails}>
          <div className={styles.profileContainer}>
            {/* <TeamImageUpload
              tournamentId={fakeId || ""} 
              team={team}
              onUpdate={(updatedTeam) => setTeam(updatedTeam)}
            /> */}
          </div>

          {width >= 600 && isMember && getCodeView}

          <h1
            className={stylesDetails.titleTourDetails}
            style={{ marginTop: width < 600 || !isMember ? "70px" : "" }}
          >
            {team.name}
          </h1>

          <div className={`container ${styles.teamViewInfoContainer}`}>
            {width < 600 && isMember && getCodeView}

            <h3>Miembros</h3>
          <div><button onClick={functionHola}>holaa</button></div>

            <div className={`table-responsive container ${styles.tableTeamView}`}>
              <table
                className={`${styles.participantsTable} table table-striped`}
              >
                <thead>
                  <tr>
                    <th>Nickname</th>
                    <th>Role</th>
                    {isCaptain && <th>Edit</th>}
                  </tr>
                </thead>
                <tbody>
                  {team.members && team.members.length > 0 ? (
                    team.members.map(
                      (participant: TeamMember, index: number) => (
                        <tr key={participant.memberId}>
                          <td>{participant.user.nickname}</td>
                          <td>
                            {participant.memberId === captainId
                              ? "Capitán"
                              : "Miembro"}
                          </td>
                          {isCaptain && (
                            <td>
                              <FaEdit
                                style={{ cursor: "pointer", marginRight: "10px" }}
                              />
                              <FaTrash style={{ cursor: "pointer" }} />
                            </td>
                          )}
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={isCaptain ? 3 : 2}>No participants found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          className="custom-toast-container"
        />
      </div>
      <Footer />
    </PrincipalContainer>
  );
};

export default TeamView;
