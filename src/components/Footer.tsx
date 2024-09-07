import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { logoFacebook, logoWhatsapp } from 'ionicons/icons';
import logoImg from '../assets/logoFsociety3.png';
import styles from '../assets/styles/footer.module.css';
import { IonIcon } from "@ionic/react";

const Footer: React.FC = () => {
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
              En FSOCIETY GAMING BOLIVIA, nuestra misión es abrir puertas para que los jugadores de toda América Latina puedan destacar y prosperar en el mundo de los deportes electrónicos. Nuestra visión es ser el puente que conecta a los jugadores con oportunidades reales, desarrollando una plataforma accesible y eficiente que elimine las barreras económicas y técnicas que a menudo limitan a los gamers en la región. Nos comprometemos a democratizar el acceso a los torneos de esports, ofreciendo a los jugadores y organizadores herramientas que les permitan competir, ganar y crecer, independientemente de su ubicación o recursos.
              </p>
            </Col>

            <Col lg={4} md={6} className={styles.footerLinks}>
              <h4>Links</h4>
              <ul>
                <li><i className="ion-ios-arrow-right"></i> <a href="#">Inicio</a></li>
                <li><i className="ion-ios-arrow-right"></i> <a href="#about">Info</a></li>
                <li><i className="ion-ios-arrow-right"></i> <a href="#services">Servicios</a></li>
                <li><i className="ion-ios-arrow-right"></i> <a href="#clients">Clientes</a></li>
                <li><i className="ion-ios-arrow-right"></i> <a href="/portafolios/">Portafolios</a></li>
              </ul>
            </Col>

            <Col lg={4} md={6} className={styles.footerContact}>
              <h4>Contáctanos</h4>
              <p>
                Fsociety <br />
                <strong>Email: </strong>
                <a href="mailto: fsociety@gmail.com" className={styles.footerEmail}>Fsociety@gmail.com</a>
              </p>

              <div className={styles.socialLinks}>
                <a href="https://www.facebook.com/profile.php?id=100092883290236" target="_blank" rel="noopener noreferrer" className="facebook">
                  <IonIcon className={styles.smaller} icon={logoFacebook} />
                </a>
                <a href="https://wa.me/59162744049" target="_blank" rel="noopener noreferrer" className="facebook">
                  <IonIcon className={styles.smaller} icon={logoWhatsapp} /> 
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
