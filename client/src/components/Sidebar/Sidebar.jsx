import React, { useState, useRef, useEffect } from "react"

import "./styles.css"

import { useNavigate, useLocation } from "react-router-dom"

import { Box, Collapse, Typography, ButtonBase, Drawer, Tooltip, IconButton } from "@mui/material"
import {
  Dashboard,
  Inventory,
  Person,
  AppsOutlined,
  Construction,
  TableChart,
  Terminal,
  ReceiptLongOutlined,
  Email,
  Sms,
  KeyboardArrowUp,
  Close
} from "@mui/icons-material"

const sidebarData = [
  {
    title: "DATA",
    icon: <Dashboard fontSize="small" />,
    path: "/dashboard",
    name: "Painel de Controlo"
  },
  {
    icon: <TableChart fontSize="small" />,
    path: "/table/",
    name: "Tabela",
    submenu: [
      {
        path: "/table/accessory",
        name: "Acessório",
        className: ""
      },
      {
        path: "/table/wintouch-article",
        name: "Artigo Wintouch",
        className: ""
      },
      {
        path: "/table/equipment-type",
        name: "Tipo de Equipamento",
        className: ""
      },
      {
        path: "/table/brand",
        name: "Marca",
        className: ""
      },
      {
        path: "/table/damage",
        name: "Avaria",
        className: ""
      },
      {
        path: "/table/intervention",
        name: "Intervenção",
        className: ""
      },
      {
        path: "/table/equipment-transfer",
        name: "Transferência de Equipamento",
        className: ""
      },
      {
        path: "/table/checklist",
        name: "Checklist",
        className: ""
      },
      {
        path: "/table/technician",
        name: "Técnico",
        className: ""
      },
      {
        path: "/table/profile",
        name: "Perfil",
        className: ""
      },
      {
        icon: <Terminal fontSize="small" />,
        path: "/table/log/",
        name: "Log",
        submenu: [
          {
            path: "/table/log/repair",
            name: "Log de Reparação",
            className: "__but__lvlDown"
          },
          {
            path: "/table/log/transfer",
            name: "Log de Transferência",
            className: "__but__lvlDown"
          },
          {
            path: "/table/log/email",
            name: "Log de E-mail",
            className: "__but__lvlDown"
          },
          {
            path: "/table/log/sms",
            name: "Log de SMS",
            className: "__but__lvlDown"
          }
        ]
      }
    ]
  },
  {
    title: "MANUTENÇÃO",
    icon: <Inventory fontSize="small" />,
    path: "/stock/",
    name: "Inventário",
    submenu: [
      {
        path: "/stock/list",
        name: "Lista",
        className: ""
      },
      {
        path: "/stock/add",
        name: "Adicionar",
        className: ""
      }
    ]
  },
  {
    icon: <Person fontSize="small" />,
    path: "/client/",
    name: "Cliente",
    submenu: [
      {
        path: "/client/list",
        name: "Lista",
        className: ""
      },
      {
        path: "/client/add",
        name: "Adicionar",
        className: ""
      }
    ]
  },
  {
    icon: <Construction fontSize="small" />,
    path: "/repair/",
    name: "Reparação",
    submenu: [
      {
        path: "/repair/list",
        name: "Lista",
        className: ""
      },
      {
        path: "/repair/add",
        name: "Adicionar",
        className: ""
      },
      {
        icon: <AppsOutlined fontSize="small" />,
        path: "/repair/equipment/",
        name: "Equipamento",
        submenu: [
          {
            path: "/repair/equipment/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/repair/equipment/tag",
            name: "Etiqueta",
            className: "__but__lvlDown"
          }
        ]
      }
    ]
  },
  {
    icon: <ReceiptLongOutlined fontSize="small" />,
    path: "/invoice/",
    name: "Faturação",
    submenu: [
      {
        path: "/invoice/list",
        name: "Lista",
        className: ""
      },
      {
        path: "/invoice/add",
        name: "Criar",
        className: ""
      }
    ]
  },
  {
    title: "OUTRO",
    path: "/send-email",
    icon: <Email fontSize="small" />,
    name: "E-mail"
  },
  {
    path: "/send-sms",
    icon: <Sms fontSize="small" />,
    name: "SMS"
  }
]

const Sidebar = ({ drawerOpen, setDrawerOpen }) => {
  const navigate = useNavigate()

  const location = useLocation()
  const isActive = (menuPath) => location.pathname.includes(menuPath)

  const [open, setOpen] = useState({})

  const sidebarRef = useRef(null)

  const handleClick = (index) => {
    document.querySelector(`.arrow__${index}`).classList.toggle("__arrow-but__rotate")

    setOpen({ ...open, [index]: !open[index] })
  }

  const handleSubmenuClick = () => {
    if (document.querySelector(".sidebar").classList.contains("__sidebar__mobile")) {
      setDrawerOpen(false)
    }
  }

  const sidebar = sidebarRef.current
  const sidebarFocused =
    sidebar && sidebar.classList.contains("__focused") && sidebar.classList.contains("__small")

  const renderSubmenu = (item, index) => {
    return (
      <Box key={index}>
        {item.title && <h3 className="menu-item-title">{item.title}</h3>}
        <ButtonBase
          tabIndex={-1}
          className={`but-sidebar ${isActive(`${item.path}`) ? "active" : ""} ${
            sidebarFocused && "__small__but"
          }`}
          onClick={() => handleClick(index)}
          sx={{
            "&:hover": {
              backgroundColor: "var(--secondaryContainer)"
            }
          }}
        >
          {item.icon}
          <Typography variant="p" component="p" className="links-name-sidebar">
            {item.name}
          </Typography>
          {item.submenu && (
            <span className={`arrow-but arrow__${index}`}>
              <KeyboardArrowUp />
            </span>
          )}
        </ButtonBase>
        {item.submenu && (
          <Collapse in={open[index]} timeout="auto" unmountOnExit>
            <Box className={`sidebar-sub-menu`}>
              {item.submenu.map((subitem, subindex) => {
                return subitem.submenu ? (
                  renderSubmenu(subitem, `${index}-${subindex}`)
                ) : (
                  <ButtonBase
                    tabIndex={-1}
                    key={subindex}
                    className={`but-sidebar ${isActive(`${subitem.path}`) ? "active" : ""} ${
                      sidebarFocused && "__small__but"
                    } ${subitem.className}`}
                    onClick={() => {
                      navigate(subitem.path)
                      handleSubmenuClick()
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--secondaryContainer)"
                      }
                    }}
                  >
                    <Typography variant="p" component="p" className="links-name-sidebar __sub">
                      {subitem.name}
                    </Typography>
                  </ButtonBase>
                )
              })}
            </Box>
          </Collapse>
        )}
      </Box>
    )
  }

  const renderDrawerSubmenu = (item, index) => {
    return (
      <Box key={index}>
        {item.title && <h3 className="menu-item-title">{item.title}</h3>}
        <ButtonBase
          className={`but-sidebar ${isActive(`${item.path}`) ? "active" : ""}`}
          onClick={() => handleClick(index)}
          sx={{
            "&:hover": {
              backgroundColor: "var(--secondaryContainer)"
            }
          }}
        >
          {item.icon}
          <Typography variant="p" component="p" className="links-name-sidebar">
            {item.name}
          </Typography>
          {item.submenu && (
            <span className={`arrow-but arrow__${index}`}>
              <KeyboardArrowUp />
            </span>
          )}
        </ButtonBase>
        {item.submenu && (
          <Collapse in={open[index]} timeout="auto" unmountOnExit>
            <Box className="sidebar-sub-menu">
              {item.submenu.map((subitem, subindex) => {
                return subitem.submenu ? (
                  renderDrawerSubmenu(subitem, `${index}-${subindex}`)
                ) : (
                  <ButtonBase
                    key={subindex}
                    className={`but-sidebar ${isActive(`${subitem.path}`) ? "active" : ""} ${
                      subitem.className
                    }`}
                    onClick={() => {
                      navigate(subitem.path)
                      handleSubmenuClick()
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--secondaryContainer)"
                      }
                    }}
                  >
                    <Typography variant="p" component="p" className="links-name-sidebar __sub">
                      {subitem.name}
                    </Typography>
                  </ButtonBase>
                )
              })}
            </Box>
          </Collapse>
        )}
      </Box>
    )
  }

  useEffect(() => {
    const arrowElements = document.querySelectorAll(".arrow-but")
    arrowElements.forEach((element) => {
      element.classList.remove("__arrow-but__rotate")
    })

    setOpen({})
  }, [location, drawerOpen])

  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ width: "280px" }}>
        <Box className="sidebar __drawer">
          <Box className="navbar-content-info-container __sidebar-nav">
            <Box className="navbar-info">
              <Typography variant="h3" component="h3" className="company-name">
                MixTech
              </Typography>
            </Box>
            <Box className="container-but-menu" style={{ marginRight: "0.6rem" }}>
              <Tooltip title="Fechar" placement="bottom">
                <IconButton
                  aria-label="Fechar"
                  size="normal"
                  className="but-menu"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box className="menu drawer">
            {sidebarData.map((item, index) => {
              return item.submenu ? (
                renderDrawerSubmenu(item, index)
              ) : (
                <Box key={index}>
                  {item.title && <h3 className="menu-item-title">{item.title}</h3>}
                  <ButtonBase
                    className={`but-sidebar ${isActive(`${item.path}`) ? "active" : ""}`}
                    onClick={() => {
                      navigate(item.path)
                      handleSubmenuClick()
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--secondaryContainer)"
                      }
                    }}
                  >
                    {item.icon}
                    <Typography variant="p" component="p" className="links-name-sidebar">
                      {item.name}
                    </Typography>
                  </ButtonBase>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Drawer>
      <Box className="sidebar" ref={sidebarRef}>
        <Box className="menu">
          {sidebarData.map((item, index) => {
            return item.submenu ? (
              renderSubmenu(item, index)
            ) : (
              <Box key={index}>
                {item.title && <h3 className="menu-item-title">{item.title}</h3>}
                <ButtonBase
                  tabIndex={-1}
                  className={`but-sidebar ${isActive(`${item.path}`) ? "active" : ""} ${
                    sidebarFocused && "__small__but"
                  }`}
                  onClick={() => {
                    navigate(item.path)
                    handleSubmenuClick()
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "var(--secondaryContainer)"
                    }
                  }}
                >
                  {item.icon}
                  <Typography variant="p" component="p" className="links-name-sidebar">
                    {item.name}
                  </Typography>
                </ButtonBase>
              </Box>
            )
          })}
        </Box>
      </Box>
    </>
  )
}

export default Sidebar
