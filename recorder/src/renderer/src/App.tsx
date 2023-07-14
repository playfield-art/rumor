import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { observer } from "mobx-react";
import Loader from "@components/Loader";
import { useApp } from "@hooks/useApp";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import useSoundBoard from "@hooks/useSoundBoard";
import theme from "./theme";
import store from "./store";
import { Sidebar } from "./layout/Sidebar";
import { Cms } from "./layout/pages/Cms/Cms";
import { Settings } from "./layout/pages/Settings/Settings";
import { AppHeader } from "./layout/AppHeader";
import { CurrentStatus } from "./layout/CurrentStatus";
import { LogItems } from "./layout/pages/LogItems/LogItems";

function App() {
  useApp();
  const { isPlaying } = useSoundBoard((e) => store.notify(e.message));
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppHeader />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
            {isPlaying && (
              <Box
                sx={{
                  color: "white",
                  backgroundColor: "var(--grey-1200)",
                  textAlign: "right",
                  p: 2,
                  pl: 4,
                  pr: 4,
                }}
              >
                <CurrentStatus />
              </Box>
            )}
            <Box
              sx={{
                p: 3,
              }}
            >
              {store.procesStatus.procesIsRunning && <Loader />}
              <Routes>
                <Route path="/" element={<LogItems />} />
                <Route path="/cms" element={<Cms />} />
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
