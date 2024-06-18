import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { useNavigate } from "react-router-dom"

import {
  Dialog,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Typography,
  Box,
  Stack,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material"
import {
  Search,
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

import { NoData } from ".."

const CommandDialog = ({ open, handleClose }) => {
  const navigate = useNavigate()

  const SearchData = [
    {
      section: "DATA",
      icon: <Dashboard />,
      label: "Painel de Controlo",
      description: "Acesso ao painel de controlo da aplicação",
      link: "/dashboard"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Acessórios",
      description: "Acesso à tabela de acessórios",
      link: "/tables/accessories"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Artigos Wintouch",
      description: "Acesso à tabela de artigos Wintouch",
      link: "/tables/wintouch-articles"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Tipo de Equipamento",
      description: "Acesso à tabela de tipo de equipamento",
      link: "/tables/equipment-type"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Marcas",
      description: "Acesso à tabela de marcas",
      link: "/tables/brands"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Avarias",
      description: "Acesso à tabela de avarias",
      link: "/tables/damages"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Intervenções",
      description: "Acesso à tabela de intervenções",
      link: "/tables/interventions"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Transferências de Equipamento",
      description: "Acesso à tabela de transferências de equipamento",
      link: "/tables/equipment-transfers"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Checklist",
      description: "Acesso à tabela de checklist",
      link: "/tables/checklist"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Técnicos",
      description: "Acesso à tabela de técnicos",
      link: "/tables/technicians"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Perfil",
      description: "Acesso à tabela de perfil",
      link: "/tables/profile"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal />,
      label: "Logs de Reparação",
      description: "Acesso aos logs de reparação",
      link: "/tables/logs/repair"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal />,
      label: "Logs de Transferências",
      description: "Acesso aos logs de transferências",
      link: "/tables/logs/transfers"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal />,
      label: "Logs de E-mails",
      description: "Acesso aos logs de e-mails",
      link: "/tables/logs/email"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      subSubSection: "Logs",
      icon: <Terminal />,
      label: "Logs de SMS",
      description: "Acesso aos logs de SMS",
      link: "/tables/logs/sms"
    },
    {
      section: "DATA",
      subSection: "Tabelas",
      icon: <TableChart />,
      label: "Estatísticas por Ano",
      description: "Acesso às estatísticas por ano",
      link: "/tables/statistics-by-year"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Clientes",
      icon: <Person />,
      label: "Adicionar Cliente",
      description: "Adicionar novo cliente",
      link: "/clients/add"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Clientes",
      icon: <Person />,
      label: "Listar Clientes",
      description: "Listar todos os clientes",
      link: "/clients/list"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Equipamentos",
      icon: <AppsOutlined />,
      label: "Histórico de Equipamentos",
      description: "Acesso ao histórico de equipamentos",
      link: "/equipments/history"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Equipamentos",
      icon: <AppsOutlined />,
      label: "Consultar Equipamentos",
      description: "Consultar equipamentos",
      link: "/equipments/consult"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Equipamentos",
      icon: <AppsOutlined />,
      label: "Etiquetas de Equipamentos",
      description: "Acesso às etiquetas de equipamentos",
      link: "/equipments/tags"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      icon: <Construction />,
      label: "Adicionar Reparação",
      description: "Adicionar nova reparação",
      link: "/repairs/add"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted />,
      label: "Reparações Abertas",
      description: "Reparações em aberto",
      link: "/repairs/states/open"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted />,
      label: "Reparações Finalizadas",
      description: "Reparações concluídas",
      link: "/repairs/states/repaired"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted />,
      label: "Reparações Fechadas",
      description: "Reparações fechadas",
      link: "/repairs/states/closed"
    },
    {
      section: "MANUTENÇÃO",
      subSection: "Reparações",
      subSubSection: "Estados",
      icon: <FormatListBulleted />,
      label: "Reparações Finalizadas Mas Não Pagas",
      description: "Reparações DC",
      link: "/repairs/states/dc"
    },
    {
      section: "OUTROS",
      icon: <Email />,
      label: "Envio de E-mail",
      description: "Enviar e-mail",
      link: "/send-email"
    },
    {
      section: "OUTROS",
      icon: <Sms />,
      label: "Envio de SMS",
      description: "Enviar SMS",
      link: "/send-sms"
    },
    {
      section: "NOTIFICAÇÕES",
      icon: <Notifications />,
      label: "Notificações",
      description: "Acesso às suas notificações",
      link: "/notifications"
    },
    {
      section: "DEFINIÇÕES",
      icon: <Settings />,
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
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen={fullScreen}
      sx={{ "& .MuiPaper-root": { borderRadius: fullScreen && "0 !important" } }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField
          inputRef={inputRef}
          label="Pesquisar"
          placeholder="O que procura?"
          sx={{ margin: 3, marginRight: 0, width: "100%" }}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Tooltip title="Fechar" placement="bottom">
          <IconButton aria-label="close" onClick={handleClose} sx={{ margin: 2, marginRight: 3 }}>
            <Close />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
      <Box sx={{ overflow: "auto", padding: 3, height: "100%" }}>
        {searchResults.length === 0 ? (
          <Box
            sx={{
              marginTop: 1,
              textAlign: "center"
            }}
          >
            <NoData onlyLottie />
            <Typography variant="h4" component="h4" sx={{ marginBottom: 3 }}>
              Nada Econtrado!
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  variant="p"
                  component="p"
                  sx={{ wordWrap: "break-word", overflowWrap: "anywhere" }}
                >
                  {"Não foram encontrados resultados para"} &nbsp;"{<strong>{text}</strong>}"
                </Typography>
              </Box>
              <Typography variant="p" component="p" sx={{ marginBottom: 4 }}>
                Tente verificar erros de digitação ou usar palavras completas.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Stack sx={{ gap: 1 }}>
            {searchResults.map((item, index) => (
              <Button
                variant="contained"
                color="secondary"
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
                  padding: "16px !important",
                  width: "100%",
                  border: 2,
                  borderColor: "var(--elevation-level3)",
                  borderRadius: 2,
                  color: "var(--onSurface)",
                  lineHeight: 1.5,
                  fontWeight: 400,
                  "&:hover": {
                    borderColor: "var(--primary)"
                  }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {item.icon}
                  <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 1 }}>
                    <Typography variant="h6" textAlign="left">
                      {item.label}
                    </Typography>
                    {item.description && (
                      <Typography variant="p" component="p" textAlign="left" color="var(--outline)">
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {item.link && (
                  <Typography variant="body2" component="p" color="var(--primary)">
                    {item.link}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    marginLeft: "auto",
                    marginTop: 1,
                    gap: 0.5
                  }}
                >
                  {item.section && <Chip label={item.section} />}
                  {item.subSection && <Chip label={item.subSection} />}
                  {item.subSubSection && <Chip label={item.subSubSection} />}
                </Box>
              </Button>
            ))}
          </Stack>
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
