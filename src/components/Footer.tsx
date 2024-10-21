import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { logoFacebook, logoWhatsapp } from "ionicons/icons";
import logoImg from "../assets/logoFsociety3.png";
import styles from "../assets/styles/footer.module.css";
import { IonIcon } from "@ionic/react";
import { WPP_NUMBER } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToServices = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      const tournamentSection = document.getElementById("start-home-section");
      if (tournamentSection) {
        tournamentSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToInformation = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      const tournamentSection = document.getElementById(
        "information-home-section"
      );
      if (tournamentSection) {
        tournamentSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <Container>
          <Row>
            <Col lg={4} md={6} className={styles.footerInfo}>
              <h3>
                <img src={logoImg} alt="Logo" title="Logo" />
              </h3>
              <p>
                En FSOCIETY GAMING BOLIVIA, nuestra misión es abrir puertas para
                que los jugadores puedan destacar y prosperar en el mundo de los
                deportes electrónicos. Nuestra visión es ser el puente que
                conecta a los jugadores con oportunidades reales, desarrollando
                una plataforma accesible y eficiente.
              </p>
            </Col>

            <Col lg={4} md={6} className={styles.footerLinks}>
              <h4>Links</h4>
              <ul>
                <li>
                  <i className="ion-ios-arrow-right"></i>{" "}
                  <a onClick={scrollToInformation} className={styles.ionRight}>
                    Info
                  </a>
                </li>
                <li>
                  <i className="ion-ios-arrow-right"></i>{" "}
                  <a onClick={scrollToServices} className={styles.ionRight}>
                    Servicios
                  </a>
                </li>
                <li>
                  <i className="ion-ios-arrow-right"></i>{" "}
                  <a href="/politica_privacidad">Politicas</a>
                </li>
              </ul>
            </Col>

            <Col lg={4} md={6} className={styles.footerContact}>
              <h4>Contáctanos</h4>
              <p>
                Fsociety Gaming Bolivia <br />
                <strong>Redes: </strong>
              </p>

              <div className={styles.socialLinks}>
                <a
                  title="facebook"
                  href="https://www.facebook.com/profile.php?id=100088001102232&locale=es_LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="facebook"
                >
                  <IonIcon className={styles.smaller} icon={logoFacebook} />
                </a>
                <a
                  title="WhatsApp"
                  href={`https://wa.me/${WPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="facebook"
                >
                  <IonIcon className={styles.smaller} icon={logoWhatsapp} />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
