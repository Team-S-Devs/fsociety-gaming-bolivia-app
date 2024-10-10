import React, { useState, useRef } from "react";
import { Container, Carousel } from "react-bootstrap";
import TournamentCard from "../tournament/TournamentCard";
import { Tournament } from '../../interfaces/interfaces';
import styles from "../../assets/styles/tournamentCard.module.css";
import useWindowSize from "../../hooks/useWindowSize";

interface PastTournamentsSliderProps {
  tournaments: Tournament[];
}

const PastTournamentsSlider: React.FC<PastTournamentsSliderProps> = ({ tournaments }) => {
  const { width } = useWindowSize();
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const touch = (e as React.TouchEvent).touches ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
    startX.current = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startX.current) return;
    const touch = (e as React.TouchEvent).touches ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
    const deltaX = touch.clientX - startX.current;

    if (deltaX < -50) {
      setIndex((prevIndex) => (prevIndex + 1) % tournaments.length);
    }

    if (deltaX > 50) {
      setIndex((prevIndex) => (prevIndex - 1 + tournaments.length) % tournaments.length);
    }

    startX.current = null;
  };

  return (
    <section className={styles.pastTournamentsSlider}>
      <Container
        className={styles.sliderGenContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
      >
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          indicators={true}
          interval={2500}
          controls={width >= 450}
          className={styles.carouselPastTours}
        >
          {tournaments.map((tournament, index) => (
            <Carousel.Item key={index} className={styles.pastTournamentsSlide}>
              <div className={styles.tournamentCardContainer}>
                <TournamentCard tournament={tournament} />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default PastTournamentsSlider;
