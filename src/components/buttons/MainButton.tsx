import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

interface MainButtonProps {
  title: string;
  onClick: () => void;
  loading?: boolean;
  color?: string;
}

const PrimaryButton = styled(Button)<{ customcolor?: string }>(({ customcolor }) => ({
  backgroundColor: customcolor || "var(--primary-color)",
  color: "#fff",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: customcolor ? `${customcolor}CC` : "#0056b3",
  },
}));

const MainButton: React.FC<MainButtonProps> = ({ title, onClick, loading, color }) => {
  return (
    <PrimaryButton 
      customcolor={color} 
      onClick={onClick}
    >
      {title}
      {loading && <CircularProgress style={{ marginLeft: 18 }} size={20} color="inherit" />}
    </PrimaryButton>
  );
};

export default MainButton;
