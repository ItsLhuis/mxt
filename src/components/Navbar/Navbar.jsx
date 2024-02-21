import React from "react"

import "./styles.css"

import { Tooltip, IconButton } from "@mui/material"
import { Menu, Search } from "@mui/icons-material"

const Navbar = ({ toggleSidebarSize, toggleSidebarSizeMobile }) => {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="navbar-content-info-container">
          <div className="navbar-info">
            {/* <img src={logo} alt="Logo Image" className="logo-image" /> */}
            <h3 className="company-name">Mixtura</h3>
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
                <Menu className="MenuIcon" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Pesquisar" placement="bottom">
              <IconButton aria-label="Pesquisar" size="normal" className="but-menu">
                <Search className="MenuIcon" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
