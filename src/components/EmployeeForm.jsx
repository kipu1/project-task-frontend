import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createEmployee } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

function EmployeeForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isValid =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsFormValid(isValid);
  }, [firstName, lastName, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await createEmployee({ firstName, lastName, email });
      navigate("/formularioproyecto");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === "string" &&
        error.response.data.toLowerCase().includes("email")
      ) {
        setEmailError("Este correo ya está en uso. Elige otro, por favor.");
      } else {
        console.error("Error al registrar el empleado:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          height: "calc(100vh - 128px)",
          width: "100vw",
          backgroundColor: "#f4f6f8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Button
              component={Link}
              to="/formularioproyecto"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
            >
              Volver
            </Button>
          </Box>

          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            textAlign="center"
          >
            Registrar Empleado
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Correo"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              required
              margin="normal"
              type="email"
              error={
                (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
                emailError !== ""
              }
              helperText={
                emailError ||
                (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Correo inválido"
                  : "")
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={!isFormValid}
            >
              Guardar
            </Button>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default EmployeeForm;
