import React from "react";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { EMAIL } from "../../utils/constants";

const ResponsibleDisclosurePolicy: React.FC = () => {
  return (
    <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
      <Box sx={{ padding: '16px', lineHeight: '1.5', fontFamily: 'Aptos', fontSize: '12pt' }}>
        <Typography
          variant="h1"
          sx={{
            marginTop: "18pt",
            marginBottom: "4pt",
            fontSize: "20pt",
          }}
        >
          Política de Divulgación Responsable de FSOCIETY GAMING BOLIVIA
        </Typography>

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

        <Typography
          variant="h2"
          sx={{
            marginTop: "8pt",
            marginBottom: "4pt",
            color: "#0f4761",
            fontSize: "16pt",
          }}
        >
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

        <Typography sx={{ marginTop: "16px" }}>
          - Por favor, otórganos un tiempo razonable para corregir la
          vulnerabilidad antes de hacerla pública o compartirla con terceros.
        </Typography>
        <Typography>
          - Nos comprometemos a valorar tu tiempo y esfuerzo, y aunque no
          ofrecemos recompensas monetarias, siempre estaremos dispuestos a
          reconocer tu contribución.
        </Typography>
        <Typography>
          - Pedimos que, durante tu investigación, evites comprometer la
          privacidad de los usuarios, destruir datos, o interrumpir nuestros
          servicios. Interactúa solo con cuentas que te pertenezcan o para las
          que tengas el permiso del titular.
        </Typography>

        <Typography
          variant="h2"
          sx={{
            marginTop: "8pt",
            marginBottom: "4pt",
            color: "#0f4761",
            fontSize: "16pt",
          }}
        >
          Exclusiones
        </Typography>

        <Typography sx={{ marginTop: "8px" }}>
          Para garantizar la seguridad y estabilidad de nuestra plataforma, los
          usuarios que participen en las siguientes actividades durante la
          investigación serán excluidos de cualquier colaboración:
        </Typography>

        <Typography>- Ataques de denegación de servicio (DoS)</Typography>
        <Typography>- Envío de spam</Typography>
        <Typography>
          - Phishing o ingeniería social dirigida a nuestros empleados o
          colaboradores
        </Typography>

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

        <Typography
          variant="h2"
          sx={{
            marginTop: "8pt",
            marginBottom: "4pt",
            color: "#0f4761",
            fontSize: "16pt",
          }}
        >
          Contacto
        </Typography>

        <Typography>
          Estamos siempre disponibles para recibir tus comentarios, preguntas y
          sugerencias. Puedes comunicarte con nosotros a través de{" "}
          <Link to={`mailto:${EMAIL}`}>
            {EMAIL}
          </Link>
        </Typography>
      </Box>
    </ContainerWithBackground>
  );
};

export default ResponsibleDisclosurePolicy;
