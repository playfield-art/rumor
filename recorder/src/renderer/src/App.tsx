import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { observer } from "mobx-react";
import Loader from "@components/Loader";
import { useApp } from "@hooks/useApp";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { useAppStore } from "@hooks/useAppStore";
import theme from "./theme";
import { Sidebar } from "./layout/Sidebar";
import { Cms } from "./layout/pages/Cms/Cms";
import { Settings } from "./layout/pages/Settings/Settings";
import { AppHeader } from "./layout/AppHeader";
import { CurrentStatus } from "./layout/CurrentStatus";
import { LogItems } from "./layout/pages/LogItems/LogItems";
import { Light } from "./layout/pages/Light/Light";

function App() {
  useApp();
  const procesStatus = useAppStore((state) => state.procesStatus);
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppHeader />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
            <CurrentStatus />
            <Box
              sx={{
                p: 3,
              }}
            >
              {procesStatus.procesIsRunning && <Loader />}
              <Routes>
                <Route path="/" element={<LogItems />} />
                <Route path="/cms" element={<Cms />} />
                <Route path="/light" element={<Light />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              <ToastContainer />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default observer(App);
