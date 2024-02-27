import React, { useState } from "react"

import "./styles.css"

import { useNavigate } from "react-router-dom"

import {
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Menu, Search, Settings } from "@mui/icons-material"

import { CommandDialog } from "@components/ui"

const Navbar = ({ toggleSidebarSize, setDrawerOpen }) => {
  const navigate = useNavigate()

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [commandDialogOpen, setCommandDialogOpen] = useState(false)

  return (
    <>
      <div className="navbar">
        <div className="navbar-content">
          <div className="navbar-content-info-container">
            <div className="navbar-info">
              <Typography variant="h3" component="h3" className="company-name">
                MixTech
              </Typography>
            </div>
            <div className="container-but-menu">
              <Tooltip title="Menu" placement="bottom">
                <IconButton
                  aria-label="Menu"
                  size="normal"
                  className="but-menu"
                  onClick={() => {
                    const screenWidth = window.innerWidth
                    if (screenWidth < 900) {
                      setDrawerOpen(true)
                    } else {
                      toggleSidebarSize()
                    }
                  }}
                >
                  <Menu className="icon" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Pesquisar" placement="bottom">
                <IconButton
                  aria-label="Pesquisar"
                  size="normal"
                  className="but-menu"
                  onClick={() => setCommandDialogOpen(true)}
                >
                  <Search className="icon" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="navbar-user-container">
            {!isSmallScreen && (
              <>
                <div className="navbar-user-container-profile">
                  {/* <Avatar alt="Luis Rodrigues" src="https://picsum.photos/700" /> */}
                  <Avatar alt="Luis Rodrigues" />
                  <div className="navbar-user-container-profile-details">
                    <Typography variant="h6" component="h6" sx={{ fontWeight: 600 }}>
                      Luis Rodrigues
                    </Typography>
                    <Typography
                      variant="p"
                      component="p"
                      sx={{ color: "var(--outline)", fontWeight: 600 }}
                    >
                      Administrador
                    </Typography>
                  </div>
                </div>
                <Divider
                  orientation="vertical"
                  sx={{
                    borderColor: "var(--elevation-level5)",
                    borderWidth: 1,
                    height: "70%"
                  }}
                />
              </>
            )}
            <div className="container-but-settings">
              <Tooltip title="Definições" placement="bottom">
                <IconButton
                  aria-label="Definições"
                  size="normal"
                  className="but-settings"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="icon" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <CommandDialog open={commandDialogOpen} handleClose={() => setCommandDialogOpen(false)} />
    </>
  )
}

export default Navbar
