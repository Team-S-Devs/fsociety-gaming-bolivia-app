import { Box } from "@mui/material";
import { ReactNode } from "react";

interface BlurBoxContainerProps {
  children: ReactNode;
  padding?: { xs: string; sm: string; md: string };
}

const BlurBoxContainer: React.FC<BlurBoxContainerProps> = ({
  children,
  padding = {
    xs: "32px 20px",
    sm: "48px 24px",
    md: "56px",
  },
}) => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(rgba(94, 131, 249, 0.2), rgba(94, 131, 249, 0.2))",
        borderRadius: 10,
        padding,
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
