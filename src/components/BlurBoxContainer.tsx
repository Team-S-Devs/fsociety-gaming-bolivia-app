import { Box } from "@mui/material";
import { ReactNode } from "react";

interface BlurBoxContainerProps {
  children: ReactNode;
}

const BlurBoxContainer: React.FC<BlurBoxContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(rgba(94, 131, 249, 0.2), rgba(94, 131, 249, 0.2))",
        borderRadius: 10,
        padding: "56px",
        paddingBottom: "64px",
        paddingTop: "64px",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
      }}
    >
      {children}
    </Box>
  );
};

export default BlurBoxContainer;
