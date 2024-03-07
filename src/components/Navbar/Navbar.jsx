import React, { useState, useEffect } from "react"

import "./styles.css"

import { useNavigate } from "react-router-dom"

import {
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Menu, Search, Settings, Notifications } from "@mui/icons-material"

import { CommandDialog } from "@components/ui"

const Navbar = ({ toggleSidebarSize, setDrawerOpen }) => {
  const navigate = useNavigate()

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [commandDialogOpen, setCommandDialogOpen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.altKey && event.key === "p") {
        setCommandDialogOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

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
                    window.dispatchEvent(new Event("resize"))

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
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                {!isSmallScreen && <Chip label="Alt + p" />}
              </Box>
            </div>
          </div>
          <div className="navbar-user-container" style={{ gap: isMediumScreen ? 0 : "1rem" }}>
            <Tooltip title="Notificações" placement="bottom">
              <IconButton
                aria-label="Notificações"
                size="normal"
                onClick={() => navigate("/notifications")}
              >
                <Notifications className="icon" />
              </IconButton>
            </Tooltip>
            {!isMediumScreen && (
              <>
                <div className="navbar-user-container-profile">
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
