import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import useWindowSize from "../../hooks/useWindowSize";

interface MainButtonProps {
  title: string;
  onClick: () => void;
}

const PrimaryButton = styled(Button)<{}>(() => ({
  backgroundColor: "var(--primary-color)",
  color: "#fff",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
}));

const MainButton: React.FC<MainButtonProps> = ({title, onClick }) => {

  return (
    <PrimaryButton color="primary" onClick={onClick}>
      {title}
    </PrimaryButton>
  );
};

export default MainButton;
