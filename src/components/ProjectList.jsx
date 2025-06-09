import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../api/api";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Delete,
  Edit,
  Visibility,
  Add,
  Logout,
  Search,
} from "@mui/icons-material";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("Usuario");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (error) {
      console.error("Error cargando proyectos", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteProject(id);
    fetchProjects();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Filtrar proyectos por nombre o descripción
  const filteredProjects = projects.filter((p) =>
    (p.name + " " + p.description)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            Bienvenido, {userName}
          </Typography>
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal centrado */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f6f8",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 1000,
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Stack spacing={4}>
            {/* Encabezado y botón */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700} color="primary">
                Mis Proyectos
              </Typography>
              <Button
                component={Link}
                to="/formularioproyecto"
                variant="contained"
                startIcon={<Add />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Nuevo Proyecto
              </Button>
            </Box>

            {/* Campo de búsqueda */}
            <TextField
              label="Buscar proyecto"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            {/* Proyectos o mensaje vacío */}
            {filteredProjects.length === 0 ? (
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                No se encontraron proyectos. Ajusta tu búsqueda o crea uno
                nuevo.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredProjects.map((p) => (
                  <Grid item xs={12} sm={6} md={4} key={p.projectId}>
                    <Card
                      elevation={3}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: 2,
                        bgcolor: "#f9f9f9",
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary"
                          gutterBottom
                        >
                          {p.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {p.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            component={Link}
                            to={`/project/${p.projectId}`}
                            size="small"
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            component={Link}
                            to={`/edit/${p.projectId}`}
                            size="small"
                            color="secondary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => handleDelete(p.projectId)}
                            size="small"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Paper>
      </Box>

      {/* Footer */}
      <Divider />
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          bgcolor: "#f4f6f8",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Kevin - Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}

export default ProjectList;
