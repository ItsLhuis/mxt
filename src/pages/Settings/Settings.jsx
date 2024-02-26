import React from "react"

import { Box, Container, Typography, Stack, Avatar, ListItemText, Tabs, Tab } from "@mui/material"
import { Person } from "@mui/icons-material"
import SettingsIcon from "@mui/icons-material/Settings"

import { Account, AppSettings } from "./components"

import { motion } from "framer-motion"

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      style={{ marginTop: "40px" }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  )
}

const tabProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  }
}

const Settings = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Box component="main" className="page-main">
        <Container maxWidth={false}>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Avatar alt="Luis Rodrigues" sx={{ height: 100, width: 100 }} />
            <ListItemText sx={{ marginLeft: 2 }}>
              <Typography variant="h4" component="h4">
                Luis Rodrigues
              </Typography>
              <Typography
                variant="p"
                component="p"
                sx={{ color: "var(--outline)", fontWeight: 600 }}
              >
                Administrador
              </Typography>
            </ListItemText>
          </Stack>
          <Box sx={{ width: "100%", marginTop: 3 }}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="settings-tab"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<Person />} label="Conta" {...tabProps(0)} disableRipple />
                <Tab icon={<SettingsIcon />} label="Definições" {...tabProps(1)} disableRipple />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Account />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <AppSettings />
            </TabPanel>
          </Box>
        </Container>
      </Box>
    </motion.div>
  )
}

export default Settings
