import React from "react"

import { useTheme } from "@contexts/themeContext"

import { Paper, Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material"

import { ButtonDropDownSelect } from "@components/ui"

const themeLabel = {
  system: "Sistema",
  dark: "Escuro",
  light: "Claro"
}

const AppSettings = () => {
  const { theme, updateTheme } = useTheme()

  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" component="h4">
          Definições
        </Typography>
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
          <ButtonDropDownSelect
            title="Tema"
            subTitle="Mudar tema da aplicação"
            description={themeLabel[theme]}
          >
            <List sx={{ minWidth: "100px" }}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => updateTheme("system")}>
                  <ListItemText primary="Sistema" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => updateTheme("dark")}>
                  <ListItemText primary="Escuro" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => updateTheme("light")}>
                  <ListItemText primary="Claro" />
                </ListItemButton>
              </ListItem>
            </List>
          </ButtonDropDownSelect>
        </Box>
      </Box>
    </Paper>
  )
}

export default AppSettings
