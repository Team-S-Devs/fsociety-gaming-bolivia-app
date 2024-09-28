import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "../../../assets/styles/tournamentDetails.module.css";
import { toast } from "react-toastify";
import { FaCodeBranch } from "react-icons/fa";
import { auth, db } from "../../../utils/firebase-config";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import ItemInfoText from "../../tournament/ItemInfoText";
import JoinModal from "../../tournament/tourForm/JoinModal";
import Loader from "../../Loader";
import { Tournament } from "../../../interfaces/interfaces";

interface JoinTeamModalProps {
  tournament: Tournament | null;
  isModalOpen: boolean;
  closeModal: () => void;
  setUserHasTeam: Dispatch<SetStateAction<boolean>>; 
}

const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  tournament,
  isModalOpen,
  closeModal,
  setUserHasTeam
}) => {
  const [modalView, setModalView] = useState<
    "default" | "createTeam" | "joinTeam"
  >("default");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [inputTeamCode, setInputTeamCode] = useState("");
  const [isTeamSaved, setIsTeamSaved] = useState(false);
  const [isTeamSaving, setIsTeamSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreateTeam = () => {
    if (!teamName) {
      setError("El nombre del equipo es obligatorio");
      return;
    }

    const regex = /^[a-zA-Z0-9 ]{3,}$/;
    if (!regex.test(teamName)) {
      setError(
        "El nombre del equipo debe tener al menos 3 letras y no puede incluir símbolos."
      );
      return;
    }

    setError("");
    const generatedCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setTeamCode(generatedCode);
  };

  const handleSaveTeam = async () => {
    setIsTeamSaving(true);

    if (!teamName) {
      setError("El nombre del equipo es obligatorio");
      return;
    }

    if (teamCode) {
      const user = auth.currentUser;
      if (!user) {
        setError("Usuario no autenticado");
        return;
      }

      const newTeam = {
        id: user.uid,
        name: teamName,
        captainId: user.uid,
        code: teamCode,
        members: [{ memberId: user.uid, payment: false }],
        banner: "",
        payment: false,
      };

      try {
        if (tournament != null) {
          const tournamentRef = doc(db, "tournaments", tournament.id!);

          await updateDoc(tournamentRef, {
            teams: arrayUnion(newTeam),
          });

          setError("");
          setIsTeamSaving(false);
          setIsTeamSaved(true);
          setUserHasTeam(true);
          toast.success("Equipo guardado exitosamente");
        } else {
          setError("El torneo no existe");
        }
      } catch (error) {
        setError(
          "Ocurrió un error al guardar el equipo. Inténtalo nuevamente."
        );
        setIsTeamSaving(false);
      }
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
      if (tournament != null) {
        const tournamentRef = doc(db, "tournaments", tournament.id!);
        const tournamentSnap = await getDoc(tournamentRef);

        if (tournamentSnap.exists()) {
          const teams = tournamentSnap.data().teams || [];

          const team = teams.find((team: any) => team.code === inputTeamCode);

          console.log(team.name);

          if (team) {
            const isAlreadyMember = team.members.some(
              (member: any) => member.memberId === user.uid
            );

            if (isAlreadyMember) {
              setError("Ya eres miembro de este equipo");
              setIsTeamSaving(false);
              return;
            }

            const updatedMembers = [
              ...team.members,
              { memberId: user.uid, payment: false },
            ];

            const updatedTeam = {
              ...team,
              members: updatedMembers,
            };

            const updatedTeams = teams.map((t: any) =>
              t.code === team.code ? updatedTeam : t
            );

            await updateDoc(tournamentRef, { teams: updatedTeams });

            setError("");
            setIsTeamSaving(false);
            setIsTeamSaved(true);
            setUserHasTeam(true);
            toast.success("Te has unido al equipo");
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

  const closeHandler = () => {
    closeModal();
    setModalView("default");
    setTeamCode("");
    setTeamName("");
    setInputTeamCode("");
    setError("");
    setIsTeamSaved(false);
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
          <ItemInfoText text="Entrar sin equipo" icon={<FaCodeBranch />} />
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
          <button onClick={handleCreateTeam} className={styles.modalButton}>
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
          <button onClick={closeModal} className={styles.modalButtonClose}>
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
          <button onClick={closeModal} className={styles.modalButtonClose}>
            Cerrar
          </button>
        </div>
      )}
    </JoinModal>
  );
};

export default JoinTeamModal;
