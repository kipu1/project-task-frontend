// src/components/Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout"; // 🔹 Asegúrate de importar el ícono
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Bienvenido{userName ? `, ${userName}` : ""}
        </Typography>
        <Box>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />} // 🔹 Usa LogoutIcon en lugar de Logout
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
