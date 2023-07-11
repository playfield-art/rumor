import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SettingsSystemDaydreamIcon from "@mui/icons-material/SettingsSystemDaydream";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  return (
    <Drawer variant="permanent" anchor="left">
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
    </Drawer>
  );
}