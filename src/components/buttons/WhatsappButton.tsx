import React from "react";
import { IconButton } from "@mui/material";
import { FaWhatsapp } from "react-icons/fa";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { WPP_NUMBER } from "../../utils/constants";
import useWindowSize from "../../hooks/useWindowSize";

const FloatingButton = styled(IconButton)<{ width: number }>(
  ({ width }) => ({
    position: "fixed",
    bottom: 36,
    right: width < 768 ? 12 : 24,
    backgroundColor: "#25D366",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#21b056",
    },
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    zIndex: 10000,
  })
);

const WhatsAppButton: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <Link to={`https://wa.me/${WPP_NUMBER}`}>
      <FloatingButton size="large" width={width}>
        <FaWhatsapp size={width < 768 ? 32 : 40} />
      </FloatingButton>
    </Link>
  );
};

export default WhatsAppButton;
