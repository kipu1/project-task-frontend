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

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      // Guardamos userId y userName
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.username);

      navigate("/");
    } catch (err) {
      setError("Credenciales incorrectas");
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
        background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            color="primary"
          >
            Iniciar Sesión
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ fontSize: "0.9rem" }}
          >
            Bienvenido de nuevo, por favor ingresa tus datos
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Usuario"
              fullWidth
              margin="normal"
              required
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Contraseña"
              fullWidth
              margin="normal"
              required
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 2,
              }}
            >
              Entrar
            </Button>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={() => navigate("/register")}
              sx={{
                mt: 2,
                fontSize: "0.9rem",
                textTransform: "none",
              }}
            >
              ¿No tienes cuenta? Crear una cuenta
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;
