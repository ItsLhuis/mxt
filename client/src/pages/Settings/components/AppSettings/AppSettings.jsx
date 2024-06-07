import React from "react"

import { useTheme } from "@/contexts/theme"

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
                {
                  label: "Sistema",
                  onClick: () => updateTheme("system"),
                  selected: theme === "system"
                },
                { label: "Escuro", onClick: () => updateTheme("dark"), selected: theme === "dark" },
                { label: "Claro", onClick: () => updateTheme("light"), selected: theme === "light" }
              ]}
            />
          </ButtonDropDownSelect>
        </Box>
      </Box>
    </Paper>
  )
}

export default AppSettings
