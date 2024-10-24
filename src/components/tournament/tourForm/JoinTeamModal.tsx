import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "../../../assets/styles/tournamentDetails.module.css";
import { toast } from "react-toastify";
import { FaCodeBranch } from "react-icons/fa";
import { auth, db } from "../../../utils/firebase-config";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import ItemInfoText from "../../tournament/ItemInfoText";
import JoinModal from "../../tournament/tourForm/JoinModal";
import Loader from "../../Loader";
import {
  Tournament,
  Team,
  UserInterface,
  TeamMember,
  RangeUser,
} from "../../../interfaces/interfaces";
import { useUserContext } from "../../../contexts/UserContext";
import { CollectionNames } from "../../../utils/collectionNames";
import CustomDropdown from "./CustomDropDown";
import { v4 } from "uuid";

interface JoinTeamModalProps {
  tournament: Tournament | null;
  isModalOpen: boolean;
  closeModal: () => void;
  setUserNoTeam: Dispatch<SetStateAction<boolean>>;
  setUserTeam: Dispatch<SetStateAction<Team | null>>;
  view?: "default" | "createTeam" | "joinTeam" | "enterWithoutTeam";
  setTournament?: React.Dispatch<React.SetStateAction<Tournament>>;
}

const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  tournament,
  isModalOpen,
  closeModal,
  setUserTeam,
  setUserNoTeam,
  view = "default",
  setTournament,
}) => {
  const [modalView, setModalView] = useState<
    "default" | "createTeam" | "joinTeam" | "enterWithoutTeam"
  >(view);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [inputTeamCode, setInputTeamCode] = useState("");
  const [isTeamSaved, setIsTeamSaved] = useState(false);
  const [isTeamSaving, setIsTeamSaving] = useState(false);
  const [error, setError] = useState("");
  const { userInfo } = useUserContext();
  const [selectedRange, setSelectedRange] = useState<RangeUser | null>(null);

  const handleSaveTeam = async () => {
    setIsTeamSaving(true);

    if (!teamName) {
      setError("El nombre del equipo es obligatorio");
      setIsTeamSaving(false);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("Usuario no autenticado");
      setIsTeamSaving(false);
      return;
    }

    try {
      if (!userInfo) {
        setError("Usuario no encontrado en la base de datos.");
        setIsTeamSaving(false);
        return;
      }

      const generatedCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setTeamCode(generatedCode);

      const newTeam: Team = {
        id: v4(),
        name: teamName,
        captainId: user.uid,
        code: generatedCode,
        deleted: false,
        members: [
          {
            memberId: user.uid,
            user: userInfo,
            paidAt: "not-paid",
            joinedAt: Timestamp.now(),
          },
        ],
        banner: { ref: "Team Banner", url: "" },
      };

      if (view === "createTeam") {
        newTeam.members = [];
        newTeam.captainId = "";
      }

      if (tournament) {
        if (view !== "createTeam") {
          const tournamentRef = doc(
            db,
            CollectionNames.Tournaments,
            tournament.id!
          );
          await updateDoc(tournamentRef, {
            teams: arrayUnion(newTeam),
            participants: tournament.participants + 1,
          });
        }

        const updatedTournament = { ...tournament };
        updatedTournament.teams.push(newTeam);

        if (setTournament) {
          console.log(updatedTournament);
          setTournament(updatedTournament);
        }

        setError("");
        setIsTeamSaving(false);
        setIsTeamSaved(true);
        setUserTeam(newTeam);
        toast.success("Equipo guardado exitosamente");
      } else {
        setError("El torneo no existe");
      }
    } catch (error) {
      setError("Ocurrió un error al guardar el equipo. Inténtalo nuevamente.");
      console.log(error);
      setIsTeamSaving(false);
    }
  };

  const handleJoinTeam = async () => {
    setIsTeamSaving(true);
    const user = auth.currentUser;

    if (!user) {
      setError("Usuario no autenticado");
      setIsTeamSaving(false);
      return;
    }

    if (!inputTeamCode) {
      setError("El código del equipo es obligatorio");
      setIsTeamSaving(false);
      return;
    }

    try {
      if (tournament) {
        const tournamentRef = doc(
          db,
          CollectionNames.Tournaments,
          tournament.id!
        );
        const tournamentSnap = await getDoc(tournamentRef);

        if (tournamentSnap.exists()) {
          const teams = tournamentSnap.data().teams || [];
          const team = teams.find((team: any) => team.code === inputTeamCode);

          if (team) {
            const isAlreadyMember = team.members.some(
              (member: TeamMember) => member.memberId === user.uid
            );

            if (isAlreadyMember) {
              setError("Ya eres miembro de este equipo");
              setIsTeamSaving(false);
              return;
            }

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data() as UserInterface;

              const updatedMembers: TeamMember[] = [
                ...team.members,
                {
                  memberId: user.uid,
                  paidAt: "not-paid",
                  user: userData,
                  joinedAt: Timestamp.now(),
                },
              ];

              const updatedTeam = {
                ...team,
                members: updatedMembers,
              };

              const updatedTeams = teams.map((t: any) =>
                t.code === team.code ? updatedTeam : t
              );

              await updateDoc(tournamentRef, {
                teams: updatedTeams,
                participants: tournament.participants + 1,
              });

              setError("");
              setIsTeamSaving(false);
              setIsTeamSaved(true);
              setUserTeam(updatedTeam);
              toast.success("Te has unido al equipo");
            } else {
              setError("Usuario no encontrado en la base de datos.");
              setIsTeamSaving(false);
            }
          } else {
            setError("No se encontró un equipo con ese código");
            setIsTeamSaving(false);
          }
        } else {
          setError("El torneo no existe");
          setIsTeamSaving(false);
        }
      }
    } catch (error) {
      setError("Ocurrió un error al unirse al equipo. Inténtalo nuevamente.");
      setIsTeamSaving(false);
    }
  };

  const handleJoinWithoutTeam = async () => {
    setIsTeamSaving(true);
    const user = auth.currentUser;

    if (!user) {
      setError("Usuario no autenticado");
      setIsTeamSaving(false);
      return;
    }

    if (!selectedRange) {
      setError("Debes escoger un rango");
      setIsTeamSaving(false);
      return;
    }

    try {
      if (tournament) {
        const tournamentRef = doc(
          db,
          CollectionNames.Tournaments,
          tournament.id!
        );
        const tournamentSnap = await getDoc(tournamentRef);

        if (tournamentSnap.exists()) {
          const usersNoTeam = tournamentSnap.data().usersNoTeam || [];

          const isAlreadyJoined = usersNoTeam.some(
            (member: any) => member.memberId === user.uid
          );

          if (isAlreadyJoined) {
            setError("Ya te has registrado sin equipo");
            setIsTeamSaving(false);
            return;
          }

          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data() as UserInterface;

            const newUserWithoutTeam = {
              memberId: user.uid,
              payment: false,
              paidAt: "not-paid",
              user: {
                ...userData,
                range: selectedRange,
              },
              joinedAt: Timestamp.now(),
            };

            await updateDoc(tournamentRef, {
              usersNoTeam: arrayUnion(newUserWithoutTeam),
            });

            setError("");
            setIsTeamSaving(false);
            setIsTeamSaved(true);
            setUserNoTeam(true);
            closeHandler();
            toast.success("Te has registrado sin equipo");
          } else {
            setError("Usuario no encontrado en la base de datos.");
            setIsTeamSaving(false);
          }
        } else {
          setError("El torneo no existe");
          setIsTeamSaving(false);
        }
      }
    } catch (error) {
      setError(
        "Ocurrió un error al registrarte sin equipo. Inténtalo nuevamente."
      );
      setIsTeamSaving(false);
    }
  };

  const closeHandler = () => {
    closeModal();
    setModalView(view);
    setTeamCode("");
    setTeamName("");
    setInputTeamCode("");
    setError("");
    setIsTeamSaved(false);
    setSelectedRange(null);
  };

  return (
    <JoinModal show={isModalOpen} onClose={closeHandler}>
      {modalView === "default" && (
        <div className={styles.modalOption}>
          <ItemInfoText
            text="Crear Equipo"
            icon={<FaCodeBranch />}
            onClick={() => setModalView("createTeam")}
          />
          <ItemInfoText
            text="Ingresar a Equipo"
            icon={<FaCodeBranch />}
            onClick={() => setModalView("joinTeam")}
          />
          <ItemInfoText
            text="Entrar sin equipo"
            icon={<FaCodeBranch />}
            onClick={() => setModalView("enterWithoutTeam")}
          />
        </div>
      )}

      {modalView === "createTeam" && (
        <div className={styles.modalForm}>
          <h3 className={styles.modalTitle}>Crear Equipo</h3>
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className={styles.modalInput}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          <button onClick={handleSaveTeam} className={styles.modalButton}>
            Generar Código
          </button>
          {teamCode && (
            <div>
              <p>
                Código del equipo: <br /> <strong>{teamCode}</strong>
              </p>
              {isTeamSaving ? (
                <div className="mb-3">
                  <Loader />
                </div>
              ) : !isTeamSaved ? (
                <button onClick={handleSaveTeam} className={styles.modalButton}>
                  Guardar Equipo
                </button>
              ) : (
                <p style={{ color: "green" }}>Equipo guardado exitosamente</p>
              )}
            </div>
          )}
          <button onClick={closeHandler} className={styles.modalButtonClose}>
            Cerrar
          </button>
        </div>
      )}

      {modalView === "joinTeam" && (
        <div className={styles.modalForm}>
          <h3 className={styles.modalTitle}>Ingresar a Equipo</h3>
          <input
            type="text"
            placeholder="Código del equipo"
            value={inputTeamCode}
            onChange={(e) => setInputTeamCode(e.target.value)}
            className={styles.modalInput}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {isTeamSaving && (
            <div className="mb-4">
              <Loader />
            </div>
          )}
          <button onClick={handleJoinTeam} className={styles.modalButton}>
            Unirme
          </button>
          <button onClick={closeHandler} className={styles.modalButtonClose}>
            Cerrar
          </button>
        </div>
      )}

      {modalView === "enterWithoutTeam" && (
        <div className={styles.modalForm}>
          <h3 className={styles.modalTitle}>Entrar sin equipo</h3>
          <CustomDropdown
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            onClick={handleJoinWithoutTeam}
            className={styles.modalButton}
          >
            Unirme sin equipo
          </button>
          <button onClick={closeHandler} className={styles.modalButtonClose}>
            Cerrar
          </button>
        </div>
      )}
    </JoinModal>
  );
};

export default JoinTeamModal;
