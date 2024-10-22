import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tournament, Team, TeamMember, RangeUser } from "../../interfaces/interfaces";
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
import { FaTrash } from "react-icons/fa";
import TeamImageUpload from "../../components/teams/TeamImageUploader";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../../contexts/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase-config";
import Error from "../Error404";
import DeleteMemberModal from "../../components/teams/DeleteMemberModal";
import CustomDropdown from "../../components/tournament/tourForm/CustomDropDown";

const TeamView: React.FC = () => {
  const { fakeId, captainId } = useParams<{ fakeId: string; captainId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { width } = useWindowSize();
  const [isMember, setIsMember] = useState(false);
  const { user, isAdmin, loading: userLoading } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<RangeUser | null>(null);
  const [disabledRange, setDisableRange] = useState<boolean>();
  const navigate = useNavigate();


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

        if (user && foundTeam) {
          const member = foundTeam.members.find(
            (member: TeamMember) => member.memberId === user.uid
          );
          setIsMember(!!member);

          if (foundTeam.range !== "") {
            setSelectedRange(foundTeam.range as RangeUser);
          }
          setDisableRange(!member);
          
        }

        setLoading(false);
      } catch (error) {
        toast.error("Error fetching tournament or team data");
        setLoading(false);
      }
    };

    fetchTournamentAndTeam();
  }, [fakeId, captainId, user]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleSaveRange = async () => {
    if (!selectedRange || !tournament || !team || !tournament.id) return;
  
    if (team.range === selectedRange) {
      toast.info("El rango ya está establecido");
      return;
    }
  
    try {
      const tournamentDocRef = doc(db, "tournaments", tournament.id);
      const updatedTeams = tournament.teams.map((t: Team) =>
        t.captainId === team.captainId ? { ...t, range: selectedRange } : t
      );
  
      await updateDoc(tournamentDocRef, {
        teams: updatedTeams,
      });
  
      setTeam((prevTeam) => prevTeam ? { ...prevTeam, range: selectedRange } : null);
  
      toast.success("Rango actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el rango");
    }
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

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member.memberId);
    setShowModal(true);
  };

  const confirmDeleteMember = async (memberId: string) => {
    setDeleteLoading(true);
  
    if (tournament && team && memberId) {
      try {
        if (!tournament.id) {
          toast.error("Tournament ID is undefined");
          return;
        }
  
        const tournamentDocRef = doc(db, "tournaments", tournament.id);
  
        const updatedTeams = tournament.teams.map((t: Team) =>
          t.captainId === team.captainId
            ? {
                ...t,
                members: t.members.filter(
                  (member: TeamMember) => member.memberId !== memberId
                ),
              }
            : t
        );
  
        await updateDoc(tournamentDocRef, {
          teams: updatedTeams,
          participants : tournament.participants - 1
        });
  
        setTeam({
          ...team,
          members: team.members.filter(
            (member: TeamMember) => member.memberId !== memberId
          ),
        });
  
        toast.success(`Jugador eliminado`);
  
        setShowModal(false);
      } catch (error) {
        toast.error("Hubo un error al eliminar el miembro. Inténtalo de nuevo.");
      } finally {
        setDeleteLoading(false);
      }
    } else {
      toast.error("No pudo salir");
      setDeleteLoading(false);
    }
  };
  

  const handleLeaveTeam = () => {
    const user = auth.currentUser;
  
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }

    setMemberToDelete(user.uid);
  
    try {
      confirmDeleteMember(user.uid);
    } catch (error) {
      toast.error("Hubo un error al salir del equipo. Inténtalo de nuevo.");
    } finally {
      setDeleteLoading(false);
      setIsMember(false);
    }
  };
  
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (loading || userLoading) {
    return <Splash />;
  }

  if (!team) {
    return <Error/>;
  }

  const getCodeView = (
    <div
      className={`${styles.codeAction} container ${styles.teamCodeContainer}`}
    >
      <h4>Código:</h4>
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
            <TeamImageUpload
              tournamentId={tournament?.id || ""}
              team={team}
              isMember={isMember}
              isAdmin={isAdmin}
              onUpdate={(updatedTeam) => setTeam(updatedTeam)}
            />
        <div className={styles.navigationButtons}>
        <button onClick={handleGoBack} className={styles.backButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M15.41 7L14 5.59 8.59 11 14 16.41 15.41 15 11.83 11.41z" />
          </svg>
          <p>
            volver
            </p>
      </button>
        </div>
          </div>
          

          {width >= 600 && isMember && getCodeView}

          <h1
            className={stylesDetails.titleTourDetails}
            style={{ marginTop: width < 600 || !isMember ? "70px" : "" }}
          >
            {team.name}
          </h1>
          {(selectedRange != null || isMember ) &&
            <div className={`${styles.rangeSelection} container`}>
                <h4>Rango de equipo:</h4>
                <div className={styles.containerRangeOptions}>
                  <CustomDropdown
                    disabled={disabledRange}
                    selectedRange={selectedRange}
                    setSelectedRange={setSelectedRange}
                  />
                  {isMember &&
                    <div className={styles.saveRangeTeam} onClick={handleSaveRange}>Cambiar</div>
                  }
                </div>
              </div>
          }

          <div className={`container ${styles.teamViewInfoContainer}`}>
            {width < 600 && isMember && getCodeView}

            <h3>Miembros</h3>
            <div className={`table-responsive container ${styles.tableTeamView}`}>
              <table
                className={`${styles.participantsTable} table table-striped`}
              >
                <thead>
                  <tr>
                    <th>Nickname</th>
                    <th>Rol</th>
                    {(user?.uid === captainId || isAdmin) && <th>Editar</th>}
                  </tr>
                </thead>
                <tbody>
                  {team.members && team.members.length > 0 ? (
                    team.members.map(
                      (participant: TeamMember) => (
                        <tr key={participant.memberId}>
                          <td>{participant.user.nickname}</td>
                          <td>
                            {participant.memberId === captainId
                              ? "Capitán"
                              : "Miembro"}
                          </td>
                          {(user?.uid === captainId || isAdmin) && (
                            <td>
                                <button
                                  title="button erase"
                                  className={`${styles.actionButton} ${styles.deleteButtonTeam}`}
                                  onClick={() => handleDeleteClick(participant)}
                                >
                                  <FaTrash />
                                </button>
                            
                            </td>
                          )}
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={3}>No hay miembros en este equipo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className={`container ${styles.outTeamContainer}`}>
            {isMember && <span onClick={handleLeaveTeam}>Salir</span> }
          </div>
        </div>
      </div>

      <DeleteMemberModal
        showModal={showModal}
        handleModalClose={handleModalClose}
        confirmDeleteMember={confirmDeleteMember}
        loading={deleteLoading}
        memberId={memberToDelete}
      />

      <ToastContainer style={{marginTop: '70px'}}
         position="top-right"
         autoClose={1500}
         hideProgressBar
         newestOnTop
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
      />
      <Footer />
    </PrincipalContainer>
  );
};

export default TeamView;
