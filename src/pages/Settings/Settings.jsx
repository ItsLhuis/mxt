import React, { useState } from "react"

import { Box, Container, Typography, Stack, ListItemText, Tabs, Tab } from "@mui/material"
import { Person, Notifications, Security } from "@mui/icons-material"
import SettingsIcon from "@mui/icons-material/Settings"

import { ImagePicker } from "@components/ui"
import { Account, AppSettings } from "./components"

import { motion } from "framer-motion"

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      style={{ marginTop: "24px" }}
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  )
}

const tabProps = (index) => {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`
  }
}

const Settings = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_, newValue) => {
    setValue(newValue)
  }

  const [image, setImage] = useState("")

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
            <ImagePicker image={image} setImage={setImage} alt="Luis Rodrigues" />
            <ListItemText
              sx={{
                marginLeft: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              <Typography
                variant="h4"
                component="h4"
                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                Luis Rodrigues
              </Typography>
              <Typography
                variant="p"
                component="p"
                sx={{
                  color: "var(--outline)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                Administrador
              </Typography>
            </ListItemText>
          </Stack>
          <Box sx={{ width: "100%", marginTop: 3 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="settings-tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab icon={<Person />} label="Conta" {...tabProps(0)} disableRipple />
              <Tab icon={<SettingsIcon />} label="Definições" {...tabProps(1)} disableRipple />
              <Tab icon={<Notifications />} label="Notificações" {...tabProps(2)} disableRipple />
              <Tab icon={<Security />} label="Segurança" {...tabProps(3)} disableRipple />
            </Tabs>
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
