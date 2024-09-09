import { Box, Container } from "@mui/material";
import React, { ReactNode } from "react";

interface ContainerWithBackgroundProps {
  urlImage: string;
  children: ReactNode;
}

const ContainerWithBackground: React.FC<ContainerWithBackgroundProps> = ({
  urlImage = "",
  children,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${urlImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflowX: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          // backgroundColor: "rgba(0, 0, 0, 0.7)", PREGUNTAR POR CUAL PREFIERE EL SABADO
          background: "linear-gradient(to right, rgb(4, 4, 26), rgba(6, 6, 61, 0.5))",
          zIndex: 1,
        },
      }}
    >
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          padding: 4,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default ContainerWithBackground;
