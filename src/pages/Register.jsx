import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Stack,
} from "@mui/material";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        username,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError("El usuario ya existe o hubo un error");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" align="center" fontWeight={600}>
            Crear Cuenta
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Usuario"
              fullWidth
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Contraseña"
              fullWidth
              margin="normal"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
            >
              Registrarse
            </Button>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{ mt: 1.5 }}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Register;
