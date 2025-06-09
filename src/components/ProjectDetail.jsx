import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProjectById,
  createTask,
  updateTaskStatus,
  deleteTask,
  updateTask,
  getEmployees,
  deleteEmployee,
  assignTaskToEmployee,
} from "../api/api";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadProject = async () => {
    const res = await getProjectById(id);
    setProject(res.data.project);
    setTasks(res.data.tasks);
  };

  const loadEmployees = async () => {
    const res = await getEmployees(id);
    setEmployees(res.data || res);
  };

  useEffect(() => {
    loadProject();
    loadEmployees();
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }
    await createTask({
      title: title.trim(),
      description: desc.trim(),
      status: "Por hacer",
      projectId: id,
    });
    setTitle("");
    setDesc("");
    loadProject();
  };

  const handleStatusChange = async (taskId, status) => {
    await updateTaskStatus(taskId, status);
    loadProject();
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    loadProject();
  };

  const handleDeleteEmployee = async (employeeId) => {
    await deleteEmployee(employeeId);
    setEmployees((prev) => prev.filter((e) => e.employeeId !== employeeId));
  };

  const openEditDialog = (task) => {
    setTaskToEdit({ ...task });
    setEditOpen(true);
  };

  const closeEditDialog = () => {
    setEditOpen(false);
    setTaskToEdit(null);
  };

  const handleEditTask = async () => {
    await updateTask(taskToEdit.taskId, taskToEdit);
    closeEditDialog();
    loadProject();
  };

  const openAssignDialog = (employee) => {
    setSelectedEmployee(employee);
    setAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    setSelectedEmployee(null);
    setSelectedTaskId("");
    setAssignDialogOpen(false);
  };

  const handleAssignTask = async () => {
    if (!selectedTaskId || !selectedEmployee) return;
    await assignTaskToEmployee(selectedTaskId, selectedEmployee.employeeId);

    const selectedTask = tasks.find(
      (t) => t.taskId === parseInt(selectedTaskId)
    );
    const taskTitle = selectedTask?.title || "";

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employeeId === selectedEmployee.employeeId
          ? { ...emp, taskId: selectedTaskId, taskTitle }
          : emp
      )
    );

    closeAssignDialog();
  };

  // Filtrar tareas
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || t.status === statusFilter)
  );

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 128px)",
          px: 2,
          py: 4,
          backgroundColor: "#f4f6f8",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <Container maxWidth="md">
          {/* Proyecto */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h4" fontWeight={700} color="primary">
                {project.name}
              </Typography>
              <Button
                component={Link}
                to="/"
                startIcon={<ArrowBackIcon />}
                variant="outlined"
              >
                Volver
              </Button>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {project.description}
            </Typography>
          </Paper>

          {/* Nueva tarea */}
          <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nueva Tarea
            </Typography>
            <Box component="form" onSubmit={handleAddTask}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Descripción"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={!title.trim() || !desc.trim()}
                  >
                    Agregar Tarea
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Filtros */}
          <Typography variant="h5" gutterBottom>
            Tareas del Proyecto
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            gap={2}
            flexWrap="wrap"
          >
            <TextField
              label="Buscar por título"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TextField
              select
              label="Filtrar por estado"
              variant="outlined"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Por hacer">Por hacer</MenuItem>
              <MenuItem value="En progreso">En progreso</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
            </TextField>
          </Box>

          {/* Tareas */}
          <Grid container spacing={2} sx={{ mb: 5 }}>
            {filteredTasks.map((t) => (
              <Grid item xs={12} md={6} key={t.taskId}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {t.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {t.description}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={t.status}
                    label="Estado"
                    onChange={(e) =>
                      handleStatusChange(t.taskId, e.target.value)
                    }
                    sx={{ my: 1 }}
                  >
                    <MenuItem value="Por hacer">Por hacer</MenuItem>
                    <MenuItem value="En progreso">En progreso</MenuItem>
                    <MenuItem value="Completada">Completada</MenuItem>
                  </TextField>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => openEditDialog(t)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTask(t.taskId)}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Empleados */}
          <Typography variant="h5" gutterBottom>
            Empleados Asignados
          </Typography>
          <Paper elevation={2} sx={{ mt: 2, p: 2, borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Tarea Asignada</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.employeeId}>
                    <TableCell>{emp.firstName}</TableCell>
                    <TableCell>{emp.lastName}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.taskTitle || <i>No asignada</i>}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => openAssignDialog(emp)}
                      >
                        <AssignmentIndIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteEmployee(emp.employeeId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>

        {/* Dialogo asignar tarea */}
        <Dialog open={assignDialogOpen} onClose={closeAssignDialog} fullWidth>
          <DialogTitle>
            Asignar Tarea a {selectedEmployee?.firstName}
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Seleccionar Tarea"
              margin="normal"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              {tasks.map((task) => (
                <MenuItem key={task.taskId} value={task.taskId}>
                  {task.title}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAssignDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleAssignTask}>
              Asignar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialogo editar tarea */}
        <Dialog open={editOpen} onClose={closeEditDialog} fullWidth>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Título"
              margin="normal"
              value={taskToEdit?.title || ""}
              onChange={(e) =>
                setTaskToEdit((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <TextField
              fullWidth
              label="Descripción"
              margin="normal"
              value={taskToEdit?.description || ""}
              onChange={(e) =>
                setTaskToEdit((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <TextField
              fullWidth
              select
              label="Estado"
              margin="normal"
              value={taskToEdit?.status || ""}
              onChange={(e) =>
                setTaskToEdit((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <MenuItem value="Por hacer">Por hacer</MenuItem>
              <MenuItem value="En progreso">En progreso</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleEditTask}>
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </>
  );
}

export default ProjectDetail;
