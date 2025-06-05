import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, updateProject, getProjectById } from "../api/api";
import { TextField, Typography, Button, Paper, Box } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ProjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProjectById(id)
        .then((res) => {
          const p = res.data.project || res.data;
          setName(p.name);
          setDescription(p.description);
        })
        .catch((err) => console.error("Error al cargar proyecto", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Validación dinámica de campos
  useEffect(() => {
    const isValid = name.trim() !== "" && description.trim() !== "";
    setIsFormValid(isValid);
  }, [name, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuario no autenticado");
      return;
    }
    if (!isFormValid) return;

    try {
      if (id) {
        await updateProject(id, { name, description });
      } else {
        await createProject({ name, description });
      }
      navigate("/");
    } catch (err) {
      console.error("Error al guardar proyecto", err);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 128px)",
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
            textAlign: "center",
          }}
        >
          <FolderOpen sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {id ? "Editar Proyecto" : "Nuevo Proyecto"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={4}
              margin="normal"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading || !isFormValid}
            >
              {id ? "Actualizar Proyecto" : "Guardar Proyecto"}
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              ¿Deseas registrar empleados?
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/employees/new")}
            >
              Registrar Empleado
            </Button>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}

export default ProjectForm;
