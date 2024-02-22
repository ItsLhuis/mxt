import React, { useState, useRef } from "react"

import "./styles.css"

import { useLocation, useNavigate } from "react-router-dom"

import { Collapse, Typography, ButtonBase, Tooltip, IconButton } from "@mui/material"

import {
  Dashboard,
  Person,
  AppsOutlined,
  Construction,
  FormatListBulleted,
  TableChart,
  Terminal,
  Email,
  Sms,
  KeyboardArrowUp,
  Close
} from "@mui/icons-material"

const SidebarData = [
  {
    title: "DATA",
    icon: <Dashboard fontSize="small" />,
    path: "/dashboard",
    name: "Painel de Controlo"
  },
  {
    icon: <TableChart fontSize="small" />,
    path: "/tables/",
    name: "Tabelas",
    submenu: [
      {
        path: "/tables/accessories",
        name: "Acessórios",
        className: ""
      },
      {
        path: "/tables/wintouch-articles",
        name: "Artigos Wintouch",
        className: ""
      },
      {
        path: "/tables/equipment-type",
        name: "Tipo de Equipamento",
        className: ""
      },
      {
        path: "/tables/brands",
        name: "Marcas",
        className: ""
      },
      {
        path: "/tables/damages",
        name: "Avarias",
        className: ""
      },
      {
        path: "/tables/interventions",
        name: "Intervenções",
        className: ""
      },
      {
        path: "/tables/equipment-transfers",
        name: "Transferências de Equipamento",
        className: ""
      },
      {
        path: "/tables/checklist",
        name: "Checklist",
        className: ""
      },
      {
        path: "/tables/technicians",
        name: "Técnicos",
        className: ""
      },
      {
        path: "/tables/profile",
        name: "Perfil",
        className: ""
      },
      {
        icon: <Terminal fontSize="small" />,
        path: "/tables/logs/",
        name: "Logs",
        submenu: [
          {
            path: "/tables/logs/repair",
            name: "Logs de Reparação",
            className: "__but__lvlDown"
          },
          {
            path: "/tables/logs/transfers",
            name: "Logs de Transferências",
            className: "__but__lvlDown"
          },
          {
            path: "/tables/logs/email",
            name: "Logs de E-mails",
            className: "__but__lvlDown"
          },
          {
            path: "/tables/logs/sms",
            name: "Logs de SMS",
            className: "__but__lvlDown"
          }
        ]
      },
      {
        path: "/tables/statistics-by-year",
        name: "Estatísticas por Ano",
        className: ""
      }
    ]
  },
  {
    title: "MANUTENÇÃO",
    icon: <Person fontSize="small" />,
    path: "/clients/",
    name: "Clientes",
    submenu: [
      {
        path: "/clients/add",
        name: "Adicionar",
        className: ""
      },
      {
        path: "/clients/list",
        name: "Listar",
        className: ""
      }
    ]
  },
  {
    icon: <AppsOutlined fontSize="small" />,
    path: "/equipments/",
    name: "Equipamentos",
    submenu: [
      {
        path: "/equipments/history",
        name: "Histórico",
        className: ""
      },
      {
        path: "/equipments/consult",
        name: "Consultar",
        className: ""
      },
      {
        path: "/equipments/tags",
        name: "Etiquetas",
        className: ""
      }
    ]
  },
  {
    icon: <Construction fontSize="small" />,
    path: "/repairs/",
    name: "Reparções",
    submenu: [
      {
        path: "/repairs/add",
        name: "Adicionar",
        className: ""
      },
      {
        icon: <FormatListBulleted fontSize="small" />,
        path: "/repairs/states",
        name: "Estados",
        submenu: [
          {
            path: "/repairs/states/open",
            name: "Abertos",
            className: "__but__lvlDown"
          },
          {
            path: "/repairs/states/repaired",
            name: "Reparados",
            className: "__but__lvlDown"
          },
          {
            path: "/repairs/states/closed",
            name: "Fechados",
            className: "__but__lvlDown"
          },
          {
            path: "/repairs/states/dc",
            name: "DC",
            className: "__but__lvlDown"
          }
        ]
      }
    ]
  },
  {
    title: "OUTROS",
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

const Sidebar = ({ toggleSidebarSizeMobile }) => {
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
      toggleSidebarSizeMobile()
    }
  }

  const sidebar = sidebarRef.current
  const sidebarFocused =
    sidebar && sidebar.classList.contains("__focused") && sidebar.classList.contains("__small")
  const allTitle = document.querySelectorAll(".menu-item-title")
  const allBut = document.querySelectorAll(".but-sidebar")
  const allLinksName = document.querySelectorAll(".links-name-sidebar")
  const allArrows = document.querySelectorAll(".arrow-but")

  const handleFocus = () => {
    if (sidebarFocused) {
      sidebar.classList.remove("__small")

      allBut.forEach((but) => {
        but.classList.remove("__small__but")
      })

      allLinksName.forEach((links) => {
        links.classList.remove("__small__but__link")
      })

      allArrows.forEach((arrow) => {
        arrow.classList.remove("__small__but__link")
      })

      allTitle.forEach((title) => {
        title.classList.remove("__small__header")
      })
    }
  }

  const renderSubmenu = (item, index) => {
    return (
      <div key={index}>
        {item.title && <h3 className="menu-item-title">{item.title}</h3>}
        <ButtonBase
          className={`but-sidebar ${isActive(`${item.path}`) ? "active" : ""} ${
            sidebarFocused && "__small__but"
          }`}
          onClick={() => handleClick(index)}
          onFocus={() => handleFocus()}
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
            <div className={`sidebar-sub-menu`}>
              {item.submenu.map((subitem, subindex) => {
                return subitem.submenu ? (
                  renderSubmenu(subitem, `${index}-${subindex}`)
                ) : (
                  <ButtonBase
                    key={subindex}
                    className={`but-sidebar ${isActive(`${subitem.path}`) ? "active" : ""} ${
                      sidebarFocused && "__small__but"
                    } ${subitem.className}`}
                    onClick={() => {
                      navigate(subitem.path)
                      handleSubmenuClick()
                    }}
                    onFocus={() => handleFocus()}
                  >
                    <Typography variant="p" component="p" className="links-name-sidebar __sub">
                      {subitem.name}
                    </Typography>
                  </ButtonBase>
                )
              })}
            </div>
          </Collapse>
        )}
      </div>
    )
  }

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="navbar-content-info-container __sidebar-nav">
        <div className="navbar-info">
          <Typography variant="h5" component="h5" className="company-name">
            Mixtura
          </Typography>
        </div>
        <div className="container-but-menu" style={{ marginRight: "0.6rem" }}>
          <Tooltip title="Fechar" placement="bottom">
            <IconButton
              aria-label="Fechar"
              size="normal"
              className="but-menu"
              onClick={() => toggleSidebarSizeMobile()}
            >
              <Close className="icon" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="menu">
        {SidebarData.map((item, index) => {
          return item.submenu ? (
            renderSubmenu(item, index)
          ) : (
            <div key={index}>
              {item.title && <h3 className="menu-item-title">{item.title}</h3>}
              <ButtonBase
                className={`but-sidebar ${isActive(`${item.path}`) ? "active" : ""} ${
                  sidebarFocused && "__small__but"
                }`}
                onClick={() => {
                  navigate(item.path)
                  handleSubmenuClick()
                }}
                onFocus={() => handleFocus()}
              >
                {item.icon}
                <Typography variant="p" component="p" className="links-name-sidebar">
                  {item.name}
                </Typography>
              </ButtonBase>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
