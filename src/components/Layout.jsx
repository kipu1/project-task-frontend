// src/components/Layout.jsx
import React from "react";
import Header from "./Header"; // ✅ Correcto (con H mayúscula)

import Footer from "./Footer";
import { Box } from "@mui/material";

function Layout({ children }) {
  return (
    <Box>
      <Header />
      <Box sx={{ minHeight: "80vh", p: 2 }}>{children}</Box>
      <Footer />
    </Box>
  );
}

export default Layout;
