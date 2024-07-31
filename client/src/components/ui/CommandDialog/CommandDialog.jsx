import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

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
  AccountBox,
  Person,
  Computer,
  Construction,
  Email,
  Sms,
  Settings,
  Close
} from "@mui/icons-material"

import { NoData } from ".."

const CommandDialog = ({ open, handleClose }) => {
  const navigate = useNavigate()

  const { role } = useAuth()

  const searchData = [
    {
      section: "DATA",
      icon: <Dashboard />,
      label: "Painel de Controlo",
      description: "Acesso ao painel de controlo da aplicação",
      link: "/dashboard"
    },
    {
      section: "MANUTENÇÃO",
      icon: <AccountBox />,
      label: "Todos os Funcionários",
      description: "Acesso à lista de funcionários",
      link: "/employee/list"
    },
    {
      section: "MANUTENÇÃO",
      icon: <AccountBox />,
      label: "Adicionar Funcionário",
      description: "Adicionar um novo funcionário",
      link: "/employee/add"
    },
    {
      section: "MANUTENÇÃO",
      icon: <Person />,
      label: "Todos os Clientes",
      description: "Acesso à lista de clientes",
      link: "/client/list"
    },
    {
      section: "MANUTENÇÃO",
      icon: <Person />,
      label: "Adicionar Cliente",
      description: "Adicionar um novo cliente",
      link: "/client/add"
    },
    {
      section: "MANUTENÇÃO",
      icon: <Computer />,
      label: "Todos os Equipamentos",
      description: "Acesso à lista de equipamentos",
      link: "/equipment/list"
    },
    {
      section: "MANUTENÇÃO",
      icon: <Computer />,
      label: "Adicionar Equipamento",
      description: "Adicionar um novo equipamento",
      link: "/equipment/add"
    },
    ...(role !== "Funcionário"
      ? [
          {
            section: "MANUTENÇÃO",
            subSection: "EQUIPAMENTO",
            icon: <Computer />,
            label: "Tipos de Equipamento",
            description: "Gerir tipos",
            link: "/equipment/type/list"
          },
          {
            section: "MANUTENÇÃO",
            subSection: "EQUIPAMENTO",
            icon: <Computer />,
            label: "Marcas de Equipamento",
            description: "Gerir marcas",
            link: "/equipment/brand/list"
          },
          {
            section: "MANUTENÇÃO",
            subSection: "EQUIPAMENTO",
            icon: <Computer />,
            label: "Modelos de Equipamento",
            description: "Gerir modelos",
            link: "/equipment/model/list"
          }
        ]
      : []),
    {
      section: "MANUTENÇÃO",
      icon: <Construction />,
      label: "Todas as Reparações",
      description: "Acesso à lista de reparações",
      link: "/repair/list"
    },
    {
      section: "MANUTENÇÃO",
      icon: <Construction />,
      label: "Adicionar Reparação",
      description: "Adicionar uma nova reparação",
      link: "/repair/add"
    },
    ...(role !== "Funcionário"
      ? [
          {
            section: "MANUTENÇÃO",
            subSection: "REPARAÇÃO",
            icon: <Construction />,
            label: "Estados de Reparação",
            description: "Gerir estados",
            link: "/repair/status/list"
          },
          {
            section: "MANUTENÇÃO",
            subSection: "REPARAÇÃO",
            icon: <Construction />,
            label: "Acessórios da Entrada de Reparação",
            description: "Gerir acessórios da entrada",
            link: "/repair/entry-accessory/list"
          },
          {
            section: "MANUTENÇÃO",
            subSection: "REPARAÇÃO",
            icon: <Construction />,
            label: "Problemas Reportados de Reparação",
            description: "Gerir problemas reportados",
            link: "/repair/reported-issue/list"
          },
          {
            section: "MANUTENÇÃO",
            subSection: "REPARAÇÃO",
            icon: <Construction />,
            label: "Trabalhos Realizados de Reparação",
            description: "Gerir trabalhos realizados",
            link: "/repair/work-done/list"
          },
          {
            section: "MANUTENÇÃO",
            subSection: "REPARAÇÃO",
            icon: <Construction />,
            label: "Acessórios da Intervenção de Reparação",
            description: "Gerir acessórios da intervenção",
            link: "/repair/intervention-accessory/list"
          }
        ]
      : []),
    {
      section: "OUTROS",
      icon: <Email />,
      label: "Todos os E-mails",
      description: "Acesso à lista de e-mails",
      link: "/email/list"
    },
    {
      section: "OUTROS",
      icon: <Email />,
      label: "Enviar E-mail",
      description: "Enviar um novo e-mail",
      link: "/email/send"
    },
    {
      section: "OUTROS",
      icon: <Sms />,
      label: "Todos os SMS",
      description: "Acesso à lista de SMS",
      link: "/sms/list"
    },
    {
      section: "OUTROS",
      icon: <Sms />,
      label: "Enviar SMS",
      description: "Enviar um novo SMS",
      link: "/sms/send"
    },
    {
      section: "DEFINIÇÕES",
      icon: <Settings />,
      label: "Definições de utilizador",
      description: "Acesso às definições",
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

    const results = searchData.filter((item) =>
      Object.values(item).some(
        (value) => value && typeof value === "string" && new RegExp(searchText, "i").test(value)
      )
    )

    setSearchResults(results)
  }

  useEffect(() => {
    setText("")

    setSearchResults(searchData)

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
        <Tooltip title="Fechar">
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
                  <Typography
                    variant="p"
                    component="p"
                    sx={{ color: "var(--primary)", fontWeight: 500 }}
                  >
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
