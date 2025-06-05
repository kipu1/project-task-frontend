// src/components/Footer.jsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        mt: 4,
        py: 2,
        backgroundColor: "#f0f0f0",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Kevin todo derechos reservados.
      </Typography>
    </Box>
  );
}

export default Footer;
