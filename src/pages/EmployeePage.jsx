import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import EmployeeTable from "../components/EmployeeForm";

function EmployeePage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Empleados
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/employees/new")}
      >
        Registrar Empleado
      </Button>
      <EmployeeTable />
    </Container>
  );
}

export default EmployeePage;
