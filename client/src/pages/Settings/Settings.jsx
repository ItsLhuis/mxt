import React, { Suspense, useState, useLayoutEffect } from "react"

import { useAuth } from "@contexts/auth"

import { Box, Container, Tabs, Tab } from "@mui/material"
import { Person, Business, Dns } from "@mui/icons-material"
import SettingsIcon from "@mui/icons-material/Settings"
import SecurityIcon from "@mui/icons-material/Security"

import { PageLoader, HeaderPage } from "@components/ui"
import { Account, AppSettings, Company, Security, Server } from "./components"

import { motion } from "framer-motion"

const allTabsInfo = [
  { name: "Conta", icon: <Person />, component: <Account /> },
  { name: "Definições", icon: <SettingsIcon />, component: <AppSettings /> },
  { name: "Segurança", icon: <SecurityIcon />, component: <Security /> },
  { name: "Empresa", icon: <Business />, component: <Company /> },
  { name: "Servidor", icon: <Dns />, component: <Server /> }
]

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <Box
      sx={{ marginTop: 3 }}
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {children}
    </Box>
  )
}

const tabProps = (index) => {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`
  }
}

const Settings = () => {
  const { role } = useAuth()

  const [tabsInfo, setTabsInfo] = useState(allTabsInfo)

  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue)
  }

  useLayoutEffect(() => {
    let filteredTabs = allTabsInfo

    if (role === "Funcionário") {
      filteredTabs = allTabsInfo.filter((tab) => tab.name !== "Empresa" && tab.name !== "Servidor")
    }

    if (role === "Administrador") {
      filteredTabs = allTabsInfo.filter((tab) => tab.name !== "Empresa")
    }

    setTabsInfo(filteredTabs)
  }, [role])

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage title="Definições" breadcrumbs={[{ name: "Definições" }]} />
            <Box sx={{ width: "100%", marginTop: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="settings-tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                {tabsInfo.map((tab) => (
                  <Tab
                    key={tab.name}
                    label={tab.name}
                    icon={tab.icon}
                    disableRipple
                    {...tabProps(tab.name)}
                  />
                ))}
              </Tabs>
              {tabsInfo.map((tab, index) => (
                <TabPanel key={tab.name} value={tabValue} index={index}>
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
