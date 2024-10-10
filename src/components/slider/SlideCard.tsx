import { Col, Container, Row } from "react-bootstrap";
import styles from "../../assets/styles/sliderCard.module.css";

interface SlideCardProps {
  title: string;
  desc: string;
  cover: string;
}

const SlideCard: React.FC<SlideCardProps> = ({ title, desc, cover }) => {
  return (
    <Container
      className={`${styles.box} ${styles.isBannerStyle}`}
      style={{
        backgroundImage: `url(${cover})`,
      }}
    >
      <Row>
        <Col md={6}>
          <div className={styles.descContainer}>
            <h1>{title}</h1>
            <p>{desc}</p>
          </div>
          <button className={styles.btnPrimary}>Ver Mas</button>
        </Col>
      </Row>
    </Container>
  );
};

export default SlideCard;
