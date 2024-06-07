import React, { useState, useEffect } from "react"

import "./styles.css"

import { useNavigate } from "react-router-dom"

import { useUser } from "@contexts/user"

import { getUserAvatar } from "@api/routes/user"

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
import { Menu, Search, Settings } from "@mui/icons-material"

import { CommandDialog } from "@components/ui"

const Navbar = ({ toggleSidebarSize, setDrawerOpen }) => {
  const navigate = useNavigate()

  const { user } = useUser()

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

  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    const fetchAvatar = async () => {
      getUserAvatar(user.id, { size: 120 }).then((url) => setAvatar(url))
    }

    fetchAvatar()
  }, [user.id])

  return (
    <>
      <Box component="header" className="navbar">
        <Box className="navbar-content">
          <Box className="navbar-content-info-container">
            <Box className="navbar-info">
              <Typography variant="h3" component="h3" className="company-name">
                Mixtech
              </Typography>
            </Box>
            <Box className="container-but-menu">
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
                  <Menu />
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
                    <Search />
                  </IconButton>
                </Tooltip>
                {!isSmallScreen && <Chip label="Alt + p" />}
              </Box>
            </Box>
          </Box>
          <Box className="navbar-user-container" sx={{ gap: isMediumScreen ? 0 : 2 }}>
            {!isMediumScreen && (
              <>
                <Box className="navbar-user-container-profile">
                  <Avatar alt={user.username} src={avatar} />
                  <Box className="navbar-user-container-profile-details">
                    <Typography variant="h6" component="h6" sx={{ fontWeight: 600 }}>
                      {user.username}
                    </Typography>
                    <Typography
                      variant="p"
                      component="p"
                      sx={{ color: "var(--outline)", fontWeight: 600 }}
                    >
                      {user.role}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            <Box className="container-but-settings">
              <Tooltip title="Definições" placement="bottom">
                <IconButton
                  aria-label="Definições"
                  size="normal"
                  className="but-settings"
                  onClick={() => navigate("/settings")}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
      <CommandDialog open={commandDialogOpen} handleClose={() => setCommandDialogOpen(false)} />
    </>
  )
}

export default Navbar
