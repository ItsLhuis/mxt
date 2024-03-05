import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { useNavigate } from "react-router-dom"

import {
  Dialog,
  IconButton,
  Tooltip,
  TextField,
  ButtonBase,
  Chip,
  Typography,
  Box,
  useTheme,
  useMediaQuery
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
  Notifications,
  Settings,
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
    },
    {
      section: "NOTIFICAÇÕES",
      icon: <Notifications fontSize="medium" />,
      label: "Notificações",
      description: "Acesso às suas notificações",
      link: "/notifications"
    },
    {
      section: "DEFINIÇÕES",
      icon: <Settings fontSize="medium" />,
      label: "Definições de utilizador",
      description: "Acesso às suas definições",
      link: "/settings"
    }
  ]

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

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
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={1}
          borderColor="var(--elevation-level5)"
        >
          <TextField
            inputRef={inputRef}
            label="O que procura?"
            sx={{ margin: "1rem", marginRight: 0, width: "100%" }}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Tooltip title="Fechar" placement="bottom">
            <IconButton aria-label="close" onClick={handleClose} sx={{ margin: "1rem" }}>
              <Close className="icon" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box overflow="auto" sx={{ padding: "1rem", height: "100%" }}>
        {searchResults.length === 0 ? (
          <Box
            sx={{
              marginTop: "2rem",
              textAlign: "center",
              gap: "16px",
              height: "200px"
            }}
          >
            <Typography variant="h4" component="h4" sx={{ marginBottom: "16px" }}>
              Nada Econtrado!
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography variant="p" component="p" sx={{ wordWrap: "break-word" }}>
                  {"Não foram encontrados resultados para"} &nbsp;"{<strong>{text}</strong>}"
                </Typography>
              </Box>
              <Typography variant="p" component="p" marginBottom="2rem">
                Tente verificar erros de digitação ou usar palavras completas.
              </Typography>
            </Box>
          </Box>
        ) : (
          searchResults.map((item, index) => (
            <ButtonBase
              key={index}
              onClick={() => {
                navigate(item.link)
                handleClose()
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: 2,
                width: "100%",
                bgcolor: "var(--elevation-level1)",
                border: 2,
                borderColor: "var(--elevation-level1)",
                borderRadius: 2,
                marginTop: index === 0 ? 0 : 1,
                "&:hover": {
                  bgcolor: "var(--elevation-level4)",
                  borderColor: "var(--primary)"
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {item.icon}
                <Box display="flex" flexDirection="column" sx={{ marginBottom: 1 }}>
                  <Typography variant="h6" textAlign="left">
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography variant="body2" textAlign="left" color="var(--outline)">
                      {item.description}
                    </Typography>
                  )}
                </Box>
              </Box>
              {item.link && (
                <Typography variant="body2" color="var(--primary)">
                  {item.link}
                </Typography>
              )}
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="flex-start"
                marginLeft="auto"
                marginTop={1}
                gap={0.5}
              >
                {item.section && <Chip label={item.section} />}
                {item.subSection && <Chip label={item.subSection} />}
                {item.subSubSection && <Chip label={item.subSubSection} />}
              </Box>
            </ButtonBase>
          ))
        )}
      </Box>
    </Dialog>
  )
}

CommandDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default CommandDialog
