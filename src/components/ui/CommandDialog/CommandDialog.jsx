import React, { useState, useEffect, useRef } from "react"

import "./styles.css"

import { useTheme } from "@mui/material/styles"

import { useMediaQuery, Dialog, IconButton, Tooltip, TextField, ButtonBase } from "@mui/material"
import { Dashboard, Close } from "@mui/icons-material"

const SearchData = [
  {
    section: "DATA",
    icon: <Dashboard fontSize="small" />,
    label: "Painel de Controlo",
    description: "Acesso ao painel de controlo da aplicação",
    link: "/dashboard",
    action: () => {
      console.log("Painel de Controlo")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Acessórios",
    description: "Acesso à tabela de acessórios",
    action: () => {
      console.log("Acessórios")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Artigos Wintouch",
    description: "Acesso à tabela de artigos Wintouch",
    action: () => {
      console.log("Artigos Wintouch")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Tipo de Equipamento",
    description: "Acesso à tabela de tipo de equipamento",
    action: () => {
      console.log("Tipo de Equipamento")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Marcas",
    description: "Acesso à tabela de marcas",
    action: () => {
      console.log("Marcas")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Avarias",
    description: "Acesso à tabela de avarias",
    action: () => {
      console.log("Avarias")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Intervenção",
    description: "Acesso à tabela de intervenção",
    action: () => {
      console.log("Intervenção")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Transferência de Equipamento",
    description: "Acesso à tabela de transferência de equipamento",
    action: () => {
      console.log("Transferência de Equipamento")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Checklist",
    description: "Acesso à tabela de checklist",
    action: () => {
      console.log("Checklist")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Técnicos",
    description: "Acesso à tabela de técnicos",
    action: () => {
      console.log("Técnicos")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Perfil",
    description: "Acesso à tabela de perfil",
    action: () => {
      console.log("Perfil")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    subSubSection: "Logs",
    label: "Logs de Reparação",
    description: "Acesso aos logs de reparação",
    action: () => {
      console.log("Logs de Reparação")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    subSubSection: "Logs",
    label: "Logs de Transferência",
    description: "Acesso aos logs de transferência",
    action: () => {
      console.log("Logs de Transferência")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    subSubSection: "Logs",
    label: "Logs de E-mails",
    description: "Acesso aos logs de e-mails",
    action: () => {
      console.log("Logs de E-mails")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    subSubSection: "Logs",
    label: "Logs de SMS",
    description: "Acesso aos logs de SMS",
    action: () => {
      console.log("Logs de SMS")
    }
  },
  {
    section: "DATA",
    subSection: "Tabelas",
    label: "Estatísticas por Ano",
    description: "Acesso às estatísticas por ano",
    action: () => {
      console.log("Estatísticas por Ano")
    }
  },
  {
    title: "MANUTENÇÃO",
    submenu: [
      {
        label: "Clientes",
        description: "Acesso à seção de clientes",
        submenu: [
          {
            label: "Adicionar",
            description: "Adicionar novo cliente",
            action: () => {
              console.log("Adicionar Cliente")
            }
          },
          {
            label: "Listar",
            description: "Listar todos os clientes",
            action: () => {
              console.log("Listar Clientes")
            }
          }
        ]
      }
    ]
  },
  {
    title: "Equipamentos",
    submenu: [
      {
        label: "Histórico",
        description: "Acesso ao histórico de equipamentos",
        action: () => {
          console.log("Histórico de Equipamentos")
        }
      },
      {
        label: "Consultar",
        description: "Consultar equipamentos",
        action: () => {
          console.log("Consultar Equipamentos")
        }
      },
      {
        label: "Etiquetas",
        description: "Acesso às etiquetas de equipamentos",
        action: () => {
          console.log("Etiquetas de Equipamentos")
        }
      }
    ]
  },
  {
    title: "Reparações",
    submenu: [
      {
        label: "Adicionar",
        description: "Adicionar nova reparação",
        action: () => {
          console.log("Adicionar Reparação")
        }
      },
      {
        label: "Estados",
        description: "Estados das reparações",
        submenu: [
          {
            label: "Abertos",
            description: "Reparações em aberto",
            action: () => {
              console.log("Reparações Abertas")
            }
          },
          {
            label: "Reparados",
            description: "Reparações concluídas",
            action: () => {
              console.log("Reparações Reparadas")
            }
          },
          {
            label: "Fechados",
            description: "Reparações fechadas",
            action: () => {
              console.log("Reparações Fechadas")
            }
          },
          {
            label: "DC",
            description: "Reparações DC",
            action: () => {
              console.log("Reparações DC")
            }
          }
        ]
      }
    ]
  },
  {
    title: "OUTROS",
    submenu: [
      {
        label: "E-mail",
        description: "Enviar e-mail",
        action: () => {
          console.log("Enviar E-mail")
        }
      },
      {
        label: "SMS",
        description: "Enviar SMS",
        action: () => {
          console.log("Enviar SMS")
        }
      }
    ]
  }
]


const CommandDialog = ({ open, handleClose }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [searchResults, setSearchResults] = useState([])

  const inputRef = useRef(null)
  const [text, setText] = useState("")

  const handleChange = (event) => {
    const searchText = event.target.value

    setText(searchText)

    const results = SearchData.filter(
      (item) =>
        item.label &&
        (item.label.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchText.toLowerCase())))
    )

    setSearchResults(results)
  }

  useEffect(() => {
    setText("")

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
          style={{ margin: "1rem", marginRight: 0, width: "100%" }}
          value={text}
          onChange={handleChange}
        />
        <Tooltip title="Fechar" placement="bottom">
          <IconButton aria-label="close" onClick={handleClose} style={{ margin: "1rem" }}>
            <Close className="icon" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="command-dialog-content">
        {searchResults.map((item, index) => (
          <ButtonBase key={index} className="command-dialog-content-button" onClick={item.action}>
            <div>
              <p>{item.label}</p>
              {item.description && <p>{item.description}</p>}
              {item.link && <p style={{ color: "var(--primary)" }}>{item.link}</p>}
            </div>
          </ButtonBase>
        ))}
      </div>
    </Dialog>
  )
}

export default CommandDialog
