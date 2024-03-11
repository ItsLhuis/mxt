import React from "react"

import { useTheme } from "@contexts/themeContext"

import { Paper, Box, Typography } from "@mui/material"

import { ButtonDropDownSelect, ListButton } from "@components/ui"

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
        <Typography variant="h5" component="h5">
          Definições
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <ButtonDropDownSelect
            mode="advanced"
            title="Tema"
            subTitle="Mudar tema da aplicação"
            description={themeLabel[theme]}
          >
            <ListButton
              buttons={[
                { title: "Sistema", action: () => updateTheme("system") },
                { title: "Escuro", action: () => updateTheme("dark") },
                { title: "Claro", action: () => updateTheme("light") }
              ]}
            />
          </ButtonDropDownSelect>
        </Box>
      </Box>
    </Paper>
  )
}

export default AppSettings
