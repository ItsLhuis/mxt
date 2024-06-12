import React, { useState, useRef, useEffect } from "react"

import "./styles.css"

import { useNavigate, useLocation } from "react-router-dom"

import { BASE_URL } from "@api"

import { Box, Collapse, Typography, ButtonBase, Drawer, Tooltip, IconButton } from "@mui/material"
import {
  Dashboard,
  Person,
  AppsOutlined,
  Construction,
  Email,
  Sms,
  KeyboardArrowUp,
  Close
} from "@mui/icons-material"

import { Image } from "@components/ui"

const sidebarData = [
  {
    title: "DATA",
    icon: <Dashboard fontSize="small" />,
    path: "/dashboard",
    name: "Painel de Controlo"
  },
  {
    title: "MANUTENÇÃO",
    icon: <Person fontSize="small" />,
    path: "/client",
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
    icon: <AppsOutlined fontSize="small" />,
    path: "/equipment",
    name: "Equipamento",
    submenu: [
      {
        path: "/equipment/list",
        name: "Lista",
        className: ""
      },
      {
        path: "/equipment/add",
        name: "Adicionar",
        className: ""
      },
      {
        icon: <AppsOutlined fontSize="small" />,
        path: "/equipment/type",
        name: "Tipo",
        submenu: [
          {
            path: "/equipment/type/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/equipment/type/tag",
            name: "Adicionar",
            className: "__but__lvlDown"
          }
        ]
      },
      {
        icon: <AppsOutlined fontSize="small" />,
        path: "/equipment/brand",
        name: "Marca",
        submenu: [
          {
            path: "/equipment/brand/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/equipment/brand/add",
            name: "Adicionar",
            className: "__but__lvlDown"
          }
        ]
      },
      {
        icon: <AppsOutlined fontSize="small" />,
        path: "/equipment/model",
        name: "Modelo",
        submenu: [
          {
            path: "/equipment/model/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/equipment/model/add",
            name: "Adicionar",
            className: "__but__lvlDown"
          }
        ]
      }
    ]
  },
  {
    icon: <Construction fontSize="small" />,
    path: "/repair",
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
        path: "/repair/entry-accessory",
        name: "Acessório da Entrada",
        submenu: [
          {
            path: "/repair/entry-accessory/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/repair/entry-accessory/tag",
            name: "Adicionar",
            className: "__but__lvlDown"
          }
        ]
      },
      {
        icon: <AppsOutlined fontSize="small" />,
        path: "/repair/reported-issue",
        name: "Problema Relatado",
        submenu: [
          {
            path: "/repair/reported-issue/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/repair/reported-issue/add",
            name: "Adicionar",
            className: "__but__lvlDown"
          }
        ]
      },
      {
        icon: <AppsOutlined fontSize="small" />,
        path: "/repair/work-done",
        name: "Trabalho Realizado",
        submenu: [
          {
            path: "/repair/work-done/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/repair/work-done/add",
            name: "Adicionar",
            className: "__but__lvlDown"
          }
        ]
      },
      {
        icon: <AppsOutlined fontSize="small" />,
        path: "/repair/intervention-accessory",
        name: "Acessório da Intervenção",
        submenu: [
          {
            path: "/repair/intervention-accessory/list",
            name: "Lista",
            className: "__but__lvlDown"
          },
          {
            path: "/repair/intervention-accessory/add",
            name: "Adicionar",
            className: "__but__lvlDown"
          }
        ]
      }
    ]
  },
  {
    title: "OUTROS",
    path: "/email",
    icon: <Email fontSize="small" />,
    name: "E-mail",
    submenu: [
      {
        path: "/email/list",
        name: "Lista",
        className: ""
      },
      {
        path: "/email/send",
        name: "Enviar",
        className: ""
      }
    ]
  },
  {
    path: "/sms",
    icon: <Sms fontSize="small" />,
    name: "SMS",
    submenu: [
      {
        path: "/sms/list",
        name: "Lista",
        className: ""
      },
      {
        path: "/sms/send",
        name: "Enviar",
        className: ""
      }
    ]
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
              <Image src={`${BASE_URL}/company/logo?size=160`} alt="Logo da empresa" />
              <Typography variant="h3" component="h3" className="company-name">
                Mixtech
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
