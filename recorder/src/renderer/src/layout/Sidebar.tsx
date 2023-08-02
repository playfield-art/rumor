import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import SettingsSystemDaydreamIcon from "@mui/icons-material/SettingsSystemDaydream";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleIcon from "@mui/icons-material/Article";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import { useNavigate } from "react-router-dom";
import RouteIcon from "@mui/icons-material/Route";
import { useAppStore } from "@hooks/useAppStore";

export function Sidebar() {
  const navigate = useNavigate();
  const version = useAppStore((state) => state.version);
  return (
    <Drawer variant="permanent" anchor="left">
      <Stack
        direction="column"
        height="100%"
        pb="20px"
        justifyContent="space-between"
      >
        <List>
          {[
            {
              label: "Logging",
              path: "/",
              icon: <ArticleIcon />,
            },
            {
              label: "CMS",
              path: "/cms",
              icon: <SettingsSystemDaydreamIcon />,
            },
            {
              label: "Light",
              path: "/light",
              icon: <LightbulbIcon />,
            },
            {
              label: "Interface",
              path: "/interface",
              icon: <WebAssetIcon />,
            },
            {
              label: "Storyline",
              path: "/storyline",
              icon: <RouteIcon />,
            },
            {
              label: "Settings",
              path: "/settings",
              icon: <SettingsIcon />,
            },
          ].map(({ label, path, icon }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton onClick={() => navigate(path)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ textAlign: "center" }}>
          <Typography>v{version}</Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
