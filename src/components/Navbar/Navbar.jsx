import React, { useState } from "react"

import "./styles.css"

import { Typography, Tooltip, IconButton } from "@mui/material"
import { Menu, Search } from "@mui/icons-material"

import { CommandDialog } from "../ui"

const Navbar = ({ toggleSidebarSize, toggleSidebarSizeMobile }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="navbar">
        <div className="navbar-content">
          <div className="navbar-content-info-container">
            <div className="navbar-info">
              <Typography variant="h5" component="h5" className="company-name">
                Mixtura
              </Typography>
            </div>
            <div className="container-but-menu">
              <Tooltip title="Menu" placement="bottom">
                <IconButton
                  aria-label="Menu"
                  size="normal"
                  className="but-menu"
                  onClick={() => {
                    const classValue = document.querySelector(".container-but-menu")
                    if (classValue.classList.contains("__menu__mobile")) {
                      toggleSidebarSizeMobile()
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
                  onClick={() => setDialogOpen(true)}
                >
                  <Search className="icon" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <CommandDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
    </>
  )
}

export default Navbar
