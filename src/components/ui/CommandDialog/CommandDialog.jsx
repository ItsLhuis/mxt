import React, { useState, useEffect, useRef } from "react"

import "./styles.css"

import { useNavigate } from "react-router-dom"

import { useTheme } from "@mui/material/styles"

import {
  useMediaQuery,
  Dialog,
  IconButton,
  Tooltip,
  TextField,
  ButtonBase,
  Chip,
  Typography
} from "@mui/material"
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
  Close
} from "@mui/icons-material"

const CommandDialog = ({ open, handleClose }) => {
  const navigate = useNavigate()

  const SearchData = [
    {
      section: "DATA",
      icon: <Dashboard fontSize="medium" />,
      label: "Painel de Controlo",
      description: "Acesso ao painel de controlo da aplicação",
      link: "/dashboard"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Acessórios",
      description: "Acesso à tabela de acessórios",
      link: "/tables/accessories"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Artigos Wintouch",
      description: "Acesso à tabela de artigos Wintouch",
      link: "/tables/wintouch-articles"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Tipo de Equipamento",
      description: "Acesso à tabela de tipo de equipamento",
      link: "/tables/equipment-type"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Marcas",
      description: "Acesso à tabela de marcas",
      link: "/tables/brands"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Avarias",
      description: "Acesso à tabela de avarias",
      link: "/tables/damages"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Intervenções",
      description: "Acesso à tabela de intervenções",
      link: "/tables/interventions"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Transferências de Equipamento",
      description: "Acesso à tabela de transferências de equipamento",
      link: "/tables/equipment-transfers"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Checklist",
      description: "Acesso à tabela de checklist",
      link: "/tables/checklist"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Técnicos",
      description: "Acesso à tabela de técnicos",
      link: "/tables/technicians"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Perfil",
      description: "Acesso à tabela de perfil",
      link: "/tables/profile"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal fontSize="medium" />,
      label: "Logs de Reparação",
      description: "Acesso aos logs de reparação",
      link: "/tables/logs/repair"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal fontSize="medium" />,
      label: "Logs de Transferências",
      description: "Acesso aos logs de transferências",
      link: "/tables/logs/transfers"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal fontSize="medium" />,
      label: "Logs de E-mails",
      description: "Acesso aos logs de e-mails",
      link: "/tables/logs/email"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal fontSize="medium" />,
      label: "Logs de SMS",
      description: "Acesso aos logs de SMS",
      link: "/tables/logs/sms"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart fontSize="medium" />,
      label: "Estatísticas por Ano",
      description: "Acesso às estatísticas por ano",
      link: "/tables/statistics-by-year"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Clientes",
      icon: <Person fontSize="medium" />,
      label: "Adicionar Cliente",
      description: "Adicionar novo cliente",
      link: "/clients/add"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Clientes",
      icon: <Person fontSize="medium" />,
      label: "Listar Clientes",
      description: "Listar todos os clientes",
      link: "/clients/list"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Equipamentos",
      icon: <AppsOutlined fontSize="medium" />,
      label: "Histórico de Equipamentos",
      description: "Acesso ao histórico de equipamentos",
      link: "/equipments/history"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Equipamentos",
      icon: <AppsOutlined fontSize="medium" />,
      label: "Consultar Equipamentos",
      description: "Consultar equipamentos",
      link: "/equipments/consult"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Equipamentos",
      icon: <AppsOutlined fontSize="medium" />,
      label: "Etiquetas de Equipamentos",
      description: "Acesso às etiquetas de equipamentos",
      link: "/equipments/tags"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      icon: <Construction fontSize="medium" />,
      label: "Adicionar Reparação",
      description: "Adicionar nova reparação",
      link: "/repairs/add"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted fontSize="medium" />,
      label: "Reparações Abertas",
      description: "Reparações em aberto",
      link: "/repairs/states/open"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted fontSize="medium" />,
      label: "Reparações Finalizadas",
      description: "Reparações concluídas",
      link: "/repairs/states/repaired"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted fontSize="medium" />,
      label: "Reparações Fechadas",
      description: "Reparações fechadas",
      link: "/repairs/states/closed"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted fontSize="medium" />,
      label: "Reparações Finalizadas Mas Não Pagas",
      description: "Reparações DC",
      link: "/repairs/states/dc"
    },
    {
      section: "OUTROS",
      icon: <Email fontSize="medium" />,
      label: "Envio de E-mail",
      description: "Enviar e-mail",
      link: "/send-email"
    },
    {
      section: "OUTROS",
      icon: <Sms fontSize="medium" />,
      label: "Envio de SMS",
      description: "Enviar SMS",
      link: "/send-sms"
    }
  ]

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [searchResults, setSearchResults] = useState([])

  const inputRef = useRef(null)
  const [text, setText] = useState("")

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchResults.length > 0) {
      navigate(searchResults[0].link)
      setTimeout(() => {
        handleClose()
      })
    }
  }

  const handleChange = (event) => {
    const searchText = event.target.value

    setText(searchText)

    const results = SearchData.filter((item) =>
      Object.values(item).some(
        (value) => value && typeof value === "string" && new RegExp(searchText, "i").test(value)
      )
    )

    setSearchResults(results)
  }

  useEffect(() => {
    setText("")

    setSearchResults(SearchData)

    const timer = setTimeout(() => {
      if (open && inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  return (
    <Dialog onClose={handleClose} open={open} fullScreen={fullScreen}>
      <div className="command-dialog-header">
        <TextField
          inputRef={inputRef}
          label="O que procura?"
          className="command-dialog-text-field"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Tooltip title="Fechar" placement="bottom">
          <IconButton aria-label="close" onClick={handleClose} style={{ margin: "1rem" }}>
            <Close className="icon" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="command-dialog-content">
        {searchResults.map((item, index) => (
          <ButtonBase
            key={index}
            className="command-dialog-content-button"
            onClick={() => {
              navigate(item.link)
              handleClose()
            }}
          >
            <div className="command-dialog-content-button-wrp">
              <div className="command-dialog-content-button-details">
                {item.icon && item.icon}
                <div className="command-dialog-content-button-description">
                  <Typography variant="h6" component="h6" style={{ textAlign: "left" }}>
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography
                      variant="p"
                      component="p"
                      style={{ textAlign: "left", color: "var(--outline)" }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </div>
              </div>
              {item.link && (
                <Typography variant="p" component="p" style={{ color: "var(--primary)" }}>
                  {item.link}
                </Typography>
              )}
              <div className="command-dialog-content-button-tags">
                {item.section && <Chip label={item.section} />}
                {item.subSection && <Chip label={item.subSection} />}
                {item.subSubSection && <Chip label={item.subSubSection} />}
              </div>
            </div>
          </ButtonBase>
        ))}
      </div>
    </Dialog>
  )
}

export default CommandDialog
