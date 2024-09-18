import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Category, Tournament } from "../interfaces/interfaces";
import styles from "../assets/styles/tournamentDetails.module.css";
import Splash from "./Splash";
import { getTournamentByFakeId } from "../utils/authUtils";
import CategoriesSlider from "../components/tournament/details/CategoriesSlider";
import OverViewSection from "./tournamentView/OverViewSection";
import { toast } from "react-toastify";
import RulesViewSection from "./tournamentView/RulesViewSection";
import Footer from "../components/Footer";

const TournamentDetails: React.FC = () => {
  const { fakeId } = useParams<{ fakeId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [actualCategory, setActualCategory] = useState(1);
  const [actualPrevView, setActualPrevView] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    if (!fakeId) {
      toast.error("El Fake ID del torneo no está definido");
      return;
    }

    const fetchTournament = async () => {
      const fetchedTournament = await getTournamentByFakeId(fakeId);
      setTournament(fetchedTournament);
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

  if (!tournament) {
    return <Splash />;
  }

  return (
    <div>
      <div className={styles.bannerTourDetails}>
        <img
          src={tournament.imagePath.url}
          alt={`${tournament.name} banner`}
          className={styles.bannerImageTourDetails}
        />
      </div>

      <div className={styles.tournamentInfoDetails}>
        <div className={`${styles.actionsTourDetails} container`}>
          <button className={styles.joinButtonTourDetails}>
            Unirme al Torneo
          </button>
        </div>
        <h1 className={styles.titleTourDetails}>{tournament.name}</h1>
        <CategoriesSlider
          categories={SliderCategories}
          categoryNum={actualCategory}
          setCategoryNum={setActualCategory}
        />
        {actualPrevView}
      </div>
      <Footer />
    </div>
  );
};

export default TournamentDetails;
