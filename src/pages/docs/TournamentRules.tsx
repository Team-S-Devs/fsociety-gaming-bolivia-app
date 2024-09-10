import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import { EMAIL } from "../../utils/constants";
import { Link } from "react-router-dom";

const TournamentRules: React.FC = () => {
  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Box
        sx={{
          padding: "16px",
          lineHeight: "1.5",
          fontFamily: "Aptos",
          fontSize: "12pt",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "20pt",
            fontFamily: "Aptos Display",
            margin: "18pt 0 4pt",
          }}
        >
          REGLAMENTO DEL TORNEO FSOCIETY GAMING BOLIVIA
        </Typography>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          1. INTRODUCCIÓN
        </Typography>
        <Typography sx={{ marginBottom: "8pt" }}>
          ¡Bienvenidos al Torneo FSOCIETY GAMING BOLIVIA! Este reglamento está
          diseñado para garantizar un torneo justo y divertido para todos los
          participantes. Asegúrate de leerlo para saber cómo funcionará el
          torneo.
        </Typography>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          2. FORMATO DEL TORNEO
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Fase de Clasificación:" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Primera Ronda: Todos los equipos jugarán 5 partidas en formato Mejor de 1 (MD1). Los mejores 16 equipos avanzarán, pero si hay más de 50 equipos inscritos, el número de clasificados podría aumentar." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Segunda Ronda: Los equipos clasificados se enfrentarán en formato Mejor de 3 (MD3) y Mejor de 5 (MD5). Los mejores 7 equipos de Bolivia y los 6 mejores de Perú pasarán a la National Cup." />
          </ListItem>
        </List>

        <Typography
          variant="h3"
          sx={{ color: "#0f4761", fontSize: "14pt", margin: "8pt 0 4pt" }}
        >
          - Fase de Eliminación:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Octavos de Final: Se jugará en formato MD3." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Cuartos de Final: Se jugará en formato MD3." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Semifinales: Se jugará en formato MD5." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Final: Se jugará en formato MD5." />
          </ListItem>
        </List>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          3. NORMAS GENERALES
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Elegibilidad: No necesitas ser mayor de edad para participar. ¡Todos son bienvenidos!" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Equipos: Si no tienes equipo, no te preocupes. Te asignaremos a uno para que puedas participar." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Conducta: Mantén siempre el respeto. No se tolerará ninguna forma de acoso o comportamiento tóxico." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Cuentas: Cada jugador debe usar su propia cuenta. No se permite compartir cuentas." />
          </ListItem>
        </List>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          4. SISTEMA DE CLASIFICACIÓN
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Durante la Fase de Clasificación, cada equipo jugará 5 partidas en formato Mejor de 1 (MD1). Al final de estas partidas, los mejores equipos avanzarán a la siguiente fase." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Los puntos se basan en victorias: gana el equipo que gane la partida en cada enfrentamiento." />
          </ListItem>
        </List>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          5. REGLAS ESPECÍFICAS DE PARTIDA
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Desconexiones: Si un jugador se desconecta, la partida continúa. Se espera que el equipo pueda seguir jugando." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Reinicios: Solo se permitirá reiniciar la partida si todos los jugadores están de acuerdo antes de que pase el primer minuto." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Demora en el Inicio: Si un equipo no está listo para comenzar una partida en un plazo de 30 minutos, perderá automáticamente una partida por demora de tiempo." />
          </ListItem>
        </List>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          6. SANCIONES
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Comportamiento Tóxico: Cualquier forma de acoso o comportamiento antideportivo resultará en la descalificación del equipo." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Trampas e Irregularidades: Si se detecta cualquier tipo de trampa o irregularidad, el equipo involucrado será descalificado del torneo." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Ping: FSOCIETY GAMING BOLIVIA no se hace responsable si el ping de ciertos jugadores es alto o inestable durante las partidas." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Falta de Respeto a las Reglas: Los equipos que no sigan las reglas serán eliminados del torneo." />
          </ListItem>
        </List>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          7. PREMIOS
        </Typography>
        <Typography>
          Los premios varían entre 2000 Bs y 2500 Bs para el primer lugar, con
          premios adicionales para el segundo y tercer lugar. Los detalles
          específicos de los premios se anunciarán antes de la fase final.
        </Typography>

        <Typography
          variant="h2"
          sx={{
            color: "#0f4761",
            fontSize: "16pt",
            fontFamily: "Aptos Display",
            margin: "8pt 0 4pt",
          }}
        >
          8. CONTACTO
        </Typography>
        <Typography>
          Si tienes preguntas o necesitas más información, puedes contactarnos
          en{" "}
          <Link to={`mailto:${EMAIL}`}>
            {EMAIL}
          </Link>
        </Typography>

        <Typography sx={{ marginTop: "8pt" }}>---</Typography>
        <Typography>
          Este reglamento incluye ahora la disposición sobre la penalización por
          demora en el inicio de las partidas, junto con las reglas previamente
          mencionadas.
        </Typography>
      </Box>
    </ContainerWithBackground>
  );
};

export default TournamentRules;
