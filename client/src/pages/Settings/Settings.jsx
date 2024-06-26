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
  { id: 0, name: "Conta", icon: <Person />, component: <Account /> },
  { id: 1, name: "Definições", icon: <SettingsIcon />, component: <AppSettings /> },
  { id: 2, name: "Segurança", icon: <SecurityIcon />, component: <Security /> },
  { id: 3, name: "Empresa", icon: <Business />, component: <Company /> },
  { id: 4, name: "Servidor", icon: <Dns />, component: <Server /> }
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
  const { role } = useAuth()

  const [tabsInfo, setTabsInfo] = useState(allTabsInfo)

  const [value, setValue] = useState(0)

  const handleChange = (_, newValue) => {
    setValue(newValue)
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
