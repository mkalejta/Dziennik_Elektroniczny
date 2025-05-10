import {
  AppBar, Box, Toolbar, Typography, IconButton,
  Menu, MenuItem, Avatar, Button
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useKeycloak } from "@react-keycloak/web";
import { Link as RouterLink } from "react-router-dom";
import React, { useState } from "react";

export default function AppHeader() {
  const { keycloak } = useKeycloak();
  const isLoggedIn = keycloak?.authenticated;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogin = () =>
    keycloak.login({ redirectUri: window.location.origin });

  const handleLogout = () =>
    keycloak.logout({ redirectUri: window.location.origin });

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            flexGrow: 1,
          }}
        >
          <MenuBookIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Gradebook
          </Typography>
        </Box>

        {isLoggedIn ? (
          <>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <Avatar sx={{ bgcolor: "#2196f3" }}>
                {keycloak.tokenParsed?.preferred_username?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                Zalogowany jako: {keycloak.tokenParsed?.preferred_username}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Zaloguj się
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
