import styles from "../../assets/styles/sliderCard.module.css";

interface SlideCardProps {
  title: string;
  cover: string;
}

const SlideCard: React.FC<SlideCardProps> = ({ title, cover }) => {
  return (
    <div className={`${styles.box} ${styles.isBannerStyle}`}>
      <img src={cover} alt={title} className={styles.coverImage} />
    </div>
  );
};

export default SlideCard;
