import ContainerWithBackground from "../../components/ContainerWithBackground";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  List,
} from "@mui/material";
import { Link } from "react-router-dom";
import { EMAIL } from "../../utils/constants";
import { BsDot } from "react-icons/bs";

const PrivacyPolicy: React.FC = () => {
  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Box
        sx={{
          padding: "16px",
          lineHeight: "1.5",
        }}
      >
        <Box mb={2} mt={6}>
          <Typography variant="h3">
            Política de Privacidad de FSOCIETY GAMING BOLIVIA
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography>
            En FSOCIETY GAMING BOLIVIA, valoramos y protegemos tu privacidad.
            Esta política explica cómo recopilamos, utilizamos y compartimos tu
            información personal.
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h4" mb={1}>
            Información que Recopilamos
          </Typography>
          <List style={{ listStyleType: "disc" }}>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Registro de cuenta: Recopilamos tu nombre e información de contacto cuando te registras. Utilizamos estos datos para administrar tu cuenta y ofrecerte nuestros servicios." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Interacciones en el sitio: Monitoreamos tu actividad en la página para mejorar tu experiencia de usuario." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Cookies: Utilizamos cookies para optimizar el funcionamiento de nuestro sitio y personalizar tu experiencia." />
            </ListItem>
          </List>
        </Box>

        <Box mb={3}>
          <Typography variant="h4" mb={1}>
            Uso de la Información
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Proporcionar y mejorar nuestros servicios." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Procesar pagos y gestionar tu cuenta." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Comunicarnos contigo sobre actualizaciones o promociones relacionadas con FSOCIETY GAMING BOLIVIA." />
            </ListItem>
          </List>
        </Box>

        <Box mb={3}>
          <Typography variant="h4" mb={1}>
            Compartición de Información
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Proveedores de servicios: Podemos compartir tus datos con terceros que nos ayudan a operar la plataforma." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Requerimientos legales: Divulgaremos tu información si la ley lo exige o para proteger nuestros derechos." />
            </ListItem>
          </List>
        </Box>

        <Box mb={3}>
          <Typography variant="h4" mb={1}>
            Tus Opciones
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Puedes acceder, actualizar o eliminar tu información contactándonos en cualquier momento." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BsDot color="#fff" size={32} />
              </ListItemIcon>
              <ListItemText primary="Puedes optar por no recibir correos promocionales siguiendo las instrucciones en los mismos." />
            </ListItem>
          </List>
        </Box>

        <Box mb={3}>
          <Typography variant="h4" mb={1}>
            Seguridad
          </Typography>
          <Typography>
            Nos esforzamos por proteger tu información, pero no podemos
            garantizar la seguridad absoluta en todas las transmisiones
            electrónicas.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h4" mb={1}>
            Cambios en la Política
          </Typography>
          <Typography>
            Esta política puede ser actualizada. Publicaremos cualquier cambio
            en esta página.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h4" mb={1}>
            Contacto
          </Typography>
          <Typography>
            Si tienes preguntas o inquietudes, contáctanos en{" "}
            <Link to={`mailto:${EMAIL}`}>{EMAIL}</Link>.
          </Typography>
        </Box>
      </Box>
    </ContainerWithBackground>
  );
};

export default PrivacyPolicy;
