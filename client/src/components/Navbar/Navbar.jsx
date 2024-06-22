import React, { useState, useEffect } from "react"

import "./styles.css"

import { useNavigate } from "react-router-dom"

import { BASE_URL } from "@api"
import { useUser } from "@hooks/server/useUser"

import {
  Typography,
  Tooltip,
  IconButton,
  Box,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Menu, Search, Settings } from "@mui/icons-material"

import { Loadable, Image, Avatar, CommandDialog } from "@components/ui"

const Navbar = ({ toggleSidebarSize, setDrawerOpen, isNotFound = false }) => {
  const navigate = useNavigate()

  const { findUserProfile } = useUser()
  const { data: user, isLoading: isUserLoading } = findUserProfile

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
      <Box
        component="header"
        className="navbar"
        style={{
          position: isNotFound && "initial",
          backgroundColor: isNotFound && "transparent",
          boxShadow: isNotFound && "none"
        }}
      >
        <Box className="navbar-content">
          <Box className="navbar-content-info-container">
            <Box className="navbar-info">
              <Image src={`${BASE_URL}/company/logo?size=160`} alt="Logo da empresa" />
              <Typography variant="h3" component="h3" className="company-name">
                Mixtech
              </Typography>
            </Box>
            {!isNotFound && (
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
            )}
          </Box>
          <Box className="navbar-user-container" sx={{ gap: isMediumScreen ? 0 : 2 }}>
            <Box
              className="navbar-user-container-profile"
              sx={{ display: isMediumScreen ? "none" : "flex" }}
            >
              <Loadable
                isLoading={isUserLoading}
                LoadingComponent={<Skeleton variant="circular" height={40} width={40} />}
                LoadedComponent={
                  <Avatar
                    withBorderAnimation
                    alt={isUserLoading ? "Avatar de utilizador" : user.username}
                    src={!isUserLoading ? `${BASE_URL}/users/${user.id}/avatar?size=80` : ""}
                    name={!isUserLoading ? user.username : ""}
                  />
                }
              />
              <Box className="navbar-user-container-profile-details">
                <Loadable
                  isLoading={isUserLoading}
                  LoadingComponent={
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem", marginBottom: "-4px" }}
                      width={80}
                    />
                  }
                  LoadedComponent={
                    <Typography
                      variant="h6"
                      component="h6"
                      sx={{ fontWeight: 600, marginBottom: "-4px" }}
                    >
                      {!isUserLoading && user.username}
                    </Typography>
                  }
                />
                <Loadable
                  isLoading={isUserLoading}
                  LoadingComponent={<Skeleton variant="text" sx={{ fontSize: 13 }} width={80} />}
                  LoadedComponent={
                    <Typography
                      variant="p"
                      component="p"
                      sx={{ color: "var(--outline)", fontWeight: 600 }}
                    >
                      {!isUserLoading && user.role}
                    </Typography>
                  }
                />
              </Box>
            </Box>
            {!isNotFound && (
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
            )}
          </Box>
        </Box>
      </Box>
      <CommandDialog open={commandDialogOpen} handleClose={() => setCommandDialogOpen(false)} />
    </>
  )
}

export default Navbar
