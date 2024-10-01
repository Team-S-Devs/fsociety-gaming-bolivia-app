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
import Avatar from "@mui/material/Avatar";
import "bootstrap/dist/css/bootstrap.min.css";
import useWindowSize from "../../hooks/useWindowSize";
import { auth } from "../../utils/firebase-config";
import "react-toastify/dist/ReactToastify.css";

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
      }

      setLoading(false);
    };

    fetchTournamentAndTeam();
  }, [fakeId, captainId]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleCopyCode = () => {
    if (team?.code) {
      navigator.clipboard
        .writeText(team.code)
        .then(() => {
          toast.success("Código copiado", {
            className: "custom-toast-success",
            bodyClassName: "custom-toast-body",
            icon: false,
          });
        })
        .catch(() => {
          toast.error("Error al copiar el código", {
            className: "custom-toast-error",
            bodyClassName: "custom-toast-body",
            icon: false,
          });
        });
    }
  };

  if (loading) {
    return <Splash />;
  }

  if (!team) {
    return <div style={{ marginTop: "200px" }}>Team not found.</div>;
  }

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
            <Avatar
              alt="Team Captain"
              src={team?.banner.url || "/defaultProfile.png"}
              sx={{ width: 140, height: 140 }}
              className={styles.profileImage}
            />
          </div>
          {width >= 600 && isMember && (
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
          )}
          <h1
            className={stylesDetails.titleTourDetails}
            style={{ marginTop: width < 600 || !isMember ? "70px" : "" }}
          >
            {team.name}
          </h1>
          <div className={`container ${styles.teamViewInfoContainer}`}>
            {width < 600 && isMember && (
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
            )}
            <h3>Miembros</h3>
            <div
              className={`table-responsive container ${styles.tableTeamView}`}
            >
              <table
                className={`${styles.participantsTable} table table-striped`}
              >
                <thead>
                  <tr>
                    <th>Nickname</th>
                    <th>Role</th>
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
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={3}>No participants found</td>
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
