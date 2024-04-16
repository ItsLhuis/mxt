import React, { Suspense, useState } from "react"

import { Box, Container, Tabs, Tab } from "@mui/material"
import { Person } from "@mui/icons-material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import SettingsIcon from "@mui/icons-material/Settings"
import SecurityIcon from "@mui/icons-material/Security"

import { PageLoader, HeaderPage } from "@components/ui"
import { Account, AppSettings, Notifications, Security } from "./components"

import { motion } from "framer-motion"

const tabsInfo = [
  { id: 0, name: "Conta", icon: <Person />, component: <Account /> },
  { id: 1, name: "Definições", icon: <SettingsIcon />, component: <AppSettings /> },
  { id: 2, name: "Notificações", icon: <NotificationsIcon />, component: <Notifications /> },
  { id: 3, name: "Segurança", icon: <SecurityIcon />, component: <Security /> }
]

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

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage title="Definições" breadcrumbs={[{ name: "Definições" }]} />
            <Box sx={{ width: "100%", marginTop: 2 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="settings-tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ borderBottom: "1px solid var(--elevation-level5)" }}
              >
                {tabsInfo.map((tab) => (
                  <Tab
                    key={tab.id}
                    label={tab.name}
                    {...tabProps(tab.name)}
                    icon={tab.icon}
                    disableRipple
                  />
                ))}
              </Tabs>
              {tabsInfo.map((tab) => (
                <TabPanel key={tab.id} value={value} index={tab.id}>
                  {tab.component}
                </TabPanel>
              ))}
            </Box>
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default Settings
