import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Category, Tournament, TournamentUserType } from "../interfaces/interfaces";
import styles from "../assets/styles/tournamentDetails.module.css";
import Splash from "./Splash";
import { getTournamentByFakeId } from "../utils/authUtils";
import CategoriesSlider from "../components/tournament/details/CategoriesSlider";
import OverViewSection from "./tournamentView/OverViewSection";
import { toast, ToastContainer } from "react-toastify";
import RulesViewSection from "./tournamentView/RulesViewSection";
import Footer from "../components/Footer";
import JoinModal from "../components/tournament/tourForm/JoinModal";
import ItemInfoText from "../components/tournament/ItemInfoText";
import { FaCodeBranch } from "react-icons/fa";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import Loader from "../components/Loader";
import { useUserContext } from "../contexts/UserContext";

const TournamentDetails: React.FC = () => {
  const { fakeId } = useParams<{ fakeId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [actualCategory, setActualCategory] = useState(1);
  const [actualPrevView, setActualPrevView] = useState<React.ReactNode | null>(
    null
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<
    "default" | "createTeam" | "joinTeam"
  >("default");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [inputTeamCode, setInputTeamCode] = useState("");
  const [isTeamSaved, setIsTeamSaved] = useState(false);
  const [isTeamSaving, setIsTeamSaving] = useState(false);
  const [error, setError] = useState("");
  const [userHasTeam, setUserHasTeam] = useState(false);
  const { userInfo } = useUserContext();

  useEffect(() => {
    if (!fakeId) {
      toast.error("El Fake ID del torneo no está definido");
      return;
    }

    const fetchTournament = async () => {
      const fetchedTournament = await getTournamentByFakeId(fakeId);
      setTournament(fetchedTournament);

      const user = auth.currentUser;
      if (user && fetchedTournament?.teams) {
        const hasTeam = fetchedTournament.teams.some(
          (team) =>
            team.captainId === user.uid ||
            team.members.filter((member) => member.memberId === user.uid)
              .length > 0
        );
        setUserHasTeam(hasTeam);
      }
    };

    fetchTournament();
  }, [fakeId]);

  const SliderCategories: Category[] = useMemo(
    () => [
      {
        id: 1,
        value: "OVERVIEW",
        component: <OverViewSection tournament={tournament} />,
      },
      {
        id: 2,
        value: "ENFRENTAMIENTOS",
        component: <RulesViewSection tournament={tournament} />,
      },
      {
        id: 3,
        value: "PARTICIPANTES",
        component: <RulesViewSection tournament={tournament} />,
      },
      {
        id: 4,
        value: "PREMIOS",
        component: <RulesViewSection tournament={tournament} />,
      },
    ],
    [tournament]
  );

  useEffect(() => {
    const selectedCategory = SliderCategories.find(
      (category) => category.id === actualCategory
    );
    if (selectedCategory) {
      setActualPrevView(selectedCategory.component);
    }
  }, [actualCategory, SliderCategories]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalView("default");
    setTeamCode("");
    setTeamName("");
    setError("");
    setIsTeamSaved(false);
  };

  const validateTeamName = (name: string): boolean => {
    const regex = /^[a-zA-Z0-9 ]{3,}$/;
    return regex.test(name);
  };

  const handleCreateTeam = () => {
    if (!teamName) {
      setError("El nombre del equipo es obligatorio");
      return;
    }

    if (!validateTeamName(teamName)) {
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

    if (!validateTeamName(teamName)) {
      setError(
        "El nombre del equipo debe tener al menos 3 letras y no puede incluir símbolos."
      );
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
        members: [
          {
            memberId: user.uid,
            payment: false,
            user: userInfo,
            paidAt: "not-paid",
            type: TournamentUserType.CAPTAIN
          },
        ],
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
          return;
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

  const handleJoinTeam = () => {
    console.log(`Uniéndose al equipo con código: ${inputTeamCode}`);
  };

  if (!tournament) {
    return <Splash />;
  }

  return (
    <div>
      <div className={styles.bannerTourDetails}>
        {!isImageLoaded && <Splash />}
        <img
          src={tournament.imagePath.url}
          alt={`${tournament.name} banner`}
          className={styles.bannerImageTourDetails}
          onLoad={handleImageLoad}
          style={{ display: isImageLoaded ? "block" : "none" }}
        />
      </div>

      <div className={styles.tournamentInfoDetails}>
        <div className={`${styles.actionsTourDetails} container`}>
          {!userHasTeam ? (
            <button
              className={styles.joinButtonTourDetails}
              onClick={openModal}
            >
              Unirme al Torneo
            </button>
          ) : (
            <button
              className={styles.joinButtonTourDetails}
              onClick={openModal}
            >
              Ver Equipo
            </button>
          )}
        </div>
        <h1 className={styles.titleTourDetails}>{tournament.name}</h1>
        <CategoriesSlider
          categories={SliderCategories}
          categoryNum={actualCategory}
          setCategoryNum={setActualCategory}
        />
        {actualPrevView}
      </div>
      {!userHasTeam && (
        <JoinModal show={isModalOpen} onClose={closeModal}>
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
              {/* Mostrar error */}
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
                    <button
                      onClick={handleSaveTeam}
                      className={styles.modalButton}
                    >
                      Guardar Equipo
                    </button>
                  ) : (
                    <p style={{ color: "green" }}>
                      Equipo guardado exitosamente
                    </p>
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
              <button onClick={handleJoinTeam} className={styles.modalButton}>
                Unirme
              </button>
              <button onClick={closeModal} className={styles.modalButtonClose}>
                Cerrar
              </button>
            </div>
          )}
        </JoinModal>
      )}

      <Footer />
      <ToastContainer
        style={{ marginTop: "4rem" }}
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TournamentDetails;
