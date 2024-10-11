import React from "react";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { EMAIL } from "../../utils/constants";
import { BsDot } from "react-icons/bs";

const ResponsibleDisclosurePolicy: React.FC = () => {
  return (
    <ContainerWithBackground urlImage="/assets/bannerFsociety.jpg">
      <Box
        sx={{
          padding: "16px",
          lineHeight: "1.5",
          fontFamily: "Aptos",
          fontSize: "12pt",
        }}
      >
        <Box mb={2} mt={6}>
          <Typography variant="h3">
            Política de Divulgación Responsable de FSOCIETY GAMING BOLIVIA
          </Typography>
        </Box>

        <Box sx={{ marginBottom: "16px" }}>
          <Typography>
            En FSOCIETY GAMING BOLIVIA, la seguridad de nuestros datos y
            servicios es de suma importancia. Valoramos la colaboración con
            investigadores de seguridad que pueden ayudarnos a identificar y
            solucionar vulnerabilidades. Si descubres alguna posible
            vulnerabilidad en nuestros sistemas, te invitamos a que nos lo
            comuniques para que podamos abordar el problema de manera oportuna.
          </Typography>
        </Box>

        <Typography variant="h4" mb={2} mt={3}>
          Nuestra Política de Divulgación
        </Typography>

        <Typography sx={{ marginTop: "8px" }}>
          Si crees haber encontrado una vulnerabilidad de seguridad, por favor
          envíanos un correo electrónico a{" "}
          <Link to="mailto:fsocietyseagm@gmail.com">
            fsocietyseagm@gmail.com
          </Link>
          . Apreciamos tu esfuerzo y trabajaremos contigo para resolver la
          situación lo más rápido posible.
        </Typography>

        <List style={{ listStyleType: "disc" }}>
          <ListItem>
            <ListItemIcon>
              <BsDot color="#fff" size={32} />
            </ListItemIcon>
            <ListItemText
              primary="Por favor, otórganos un tiempo razonable para corregir la
          vulnerabilidad antes de hacerla pública o compartirla con terceros."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BsDot color="#fff" size={32} />
            </ListItemIcon>
            <ListItemText
              primary="Nos comprometemos a valorar tu tiempo y esfuerzo, y aunque no
          ofrecemos recompensas monetarias, siempre estaremos dispuestos a
          reconocer tu contribución."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BsDot color="#fff" size={32} />
            </ListItemIcon>
            <ListItemText
              primary="Pedimos que, durante tu investigación, evites comprometer la
          privacidad de los usuarios, destruir datos, o interrumpir nuestros
          servicios. Interactúa solo con cuentas que te pertenezcan o para las
          que tengas el permiso del titular."
            />
          </ListItem>
        </List>

        <Typography variant="h4" mb={2} mt={3}>
          Exclusiones
        </Typography>

        <Typography sx={{ marginTop: "8px" }}>
          Para garantizar la seguridad y estabilidad de nuestra plataforma, los
          usuarios que participen en las siguientes actividades durante la
          investigación serán excluidos de cualquier colaboración:
        </Typography>
        <List style={{ listStyleType: "disc" }}>
          <ListItem>
            <ListItemIcon>
              <BsDot color="#fff" size={32} />
            </ListItemIcon>
            <ListItemText primary="Ataques de denegación de servicio (DoS)." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BsDot color="#fff" size={32} />
            </ListItemIcon>
            <ListItemText primary="Envío de spam." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BsDot color="#fff" size={32} />
            </ListItemIcon>
            <ListItemText
              primary="Phishing o ingeniería social dirigida a nuestros empleados o
          colaboradores."
            />
          </ListItem>
        </List>

        <Typography sx={{ marginTop: "16px" }}>
          Esta política se aplica a todos los servicios de FSOCIETY GAMING
          BOLIVIA relacionados con la plataforma de torneos de Mobile Legends.
          No consideramos reportes de vulnerabilidades que afecten únicamente a
          nuestro sitio web informativo o de blogs, ya que no contienen datos
          sensibles.
        </Typography>

        <Typography sx={{ marginTop: "16px" }}>
          ¡Gracias por contribuir a la seguridad de FSOCIETY GAMING BOLIVIA y de
          nuestros usuarios!
        </Typography>

        <Typography variant="h4" mb={2} mt={3}>
          Contacto
        </Typography>

        <Typography>
          Estamos siempre disponibles para recibir tus comentarios, preguntas y
          sugerencias. Puedes comunicarte con nosotros a través de{" "}
          <Link to={`mailto:${EMAIL}`}>{EMAIL}</Link>
        </Typography>
      </Box>
    </ContainerWithBackground>
  );
};

export default ResponsibleDisclosurePolicy;
