import React, { useState } from "react"

import { useDashboard } from "@hooks/server/useDashboard"
import { useCompany } from "@hooks/server/useCompany"

import {
  Box,
  Skeleton,
  Stack,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { AccountBox, Person, Computer, Construction, Email, Sms } from "@mui/icons-material"

import { ButtonDropDownSelect, ListButton, Loadable, Caption } from "@components/ui"
import { LineChart } from "@components/ui/Charts"

import { formatNumber } from "@utils/format/number"

const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tab-panel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && (
      <Stack sx={{ gap: 1, margin: 3, justifyContent: "center", alignItems: "center" }}>
        {children}
      </Stack>
    )}
  </Box>
)

const tabProps = (index) => ({
  id: `tab-${index}`,
  "aria-controls": `tab-panel-${index}`
})

const AnnualActivitiesChart = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [tabValue, setTabValue] = useState(0)
  const handleTabChange = (_, newValue) => setTabValue(newValue)

  const {
    findEmployeeActivity,
    findClientActivity,
    findEquipmentActivity,
    findRepairActivity,
    findEmailActivity,
    findSmsActivity,
    updateActivityYear
  } = useDashboard()

  const { findCompany } = useCompany()

  const chartColors = [
    "rgb(248, 112, 96)",
    "rgb(92, 107, 192)",
    "rgb(139, 195, 74)",
    "rgb(255, 152, 0)",
    "rgb(33, 150, 243)",
    "rgb(255, 87, 34)"
  ]

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const activities = [
    {
      label: "Funcionários",
      icon: <AccountBox sx={{ color: chartColors[0] }} />,
      hook: findEmployeeActivity
    },
    {
      label: "Clientes",
      icon: <Person sx={{ color: chartColors[0] }} />,
      hook: findClientActivity
    },
    {
      label: "Equipamentos",
      icon: <Computer sx={{ color: chartColors[1] }} />,
      hook: findEquipmentActivity
    },
    {
      label: "Reparações",
      icon: <Construction sx={{ color: chartColors[2] }} />,
      hook: findRepairActivity
    },
    { label: "E-mails", icon: <Email sx={{ color: chartColors[3] }} />, hook: findEmailActivity },
    { label: "SMS", icon: <Sms sx={{ color: chartColors[4] }} />, hook: findSmsActivity }
  ]

  const activityData = activities.reduce((acc, { label, hook }) => {
    const { data, isLoading, isError } = hook
    acc[label] = { total: data?.total_for_year || 0, loading: isLoading, error: isError }
    return acc
  }, {})

  const isAnnualActivitiesFinished =
    !activities.some(({ hook }) => hook.isLoading) && !activities.some(({ hook }) => hook.isError)

  const chartData = activities.map(({ label, hook }) => ({
    name: label,
    data: hook.data?.totals_by_month_for_year.map((item) => item.total) || []
  }))

  const availableYears = findCompany.data
    ? Array.from(
        {
          length:
            new Date().getFullYear() -
            new Date(findCompany.data.created_at_datetime).getFullYear() +
            1
        },
        (_, index) => new Date(findCompany.data.created_at_datetime).getFullYear() + index
      ).reverse()
    : []

  const calculateTotalForYear = () => {
    return formatNumber(Object.values(activityData).reduce((acc, { total }) => acc + total, 0))
  }

  return (
    <Stack>
      <Box sx={{ width: "100%", padding: 3, paddingTop: 0 }}>
        <Stack sx={{ marginBlock: 1, alignItems: "flex-end" }}>
          <Loadable
            isLoading={findCompany.isLoading}
            LoadingComponent={<Skeleton variant="rounded" height={41} width={87} />}
            LoadedComponent={
              <ButtonDropDownSelect title={selectedYear.toString()}>
                <ListButton
                  buttons={availableYears.map((year) => ({
                    label: year.toString(),
                    onClick: () => {
                      setSelectedYear(year)

                      updateActivityYear("employee", year)
                      updateActivityYear("client", year)
                      updateActivityYear("equipment", year)
                      updateActivityYear("repair", year)
                      updateActivityYear("email", year)
                      updateActivityYear("sms", year)
                    },
                    selected: selectedYear === year
                  }))}
                />
              </ButtonDropDownSelect>
            }
          />
        </Stack>
        <Box
          sx={{
            width: "100%",
            minHeight: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Loadable
            isLoading={!isAnnualActivitiesFinished}
            LoadingComponent={<CircularProgress />}
            LoadedComponent={
              <LineChart
                data={chartData}
                categories={[
                  "Jan",
                  "Fev",
                  "Mar",
                  "Abr",
                  "Mai",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Set",
                  "Out",
                  "Nov",
                  "Dez"
                ]}
                limits={[1, 12]}
                colors={chartColors}
              />
            }
            style={{ width: "100%", minHeight: 500 }}
          />
        </Box>
      </Box>
      <Divider sx={{ borderColor: "var(--elevation-level5)", borderWidth: 1 }} />
      <Stack
        sx={{ flexDirection: isSmallScreen ? "column" : "row", justifyContent: "space-between" }}
      >
        <Stack
          sx={{
            width: isSmallScreen ? "100%" : "60%",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 2
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="activity-tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              width: "100%",
              "& .MuiTabs-flexContainer": {
                maxWidth: "fit-content",
                marginLeft: "auto",
                marginRight: "auto"
              }
            }}
          >
            {activities.map((activity, index) => (
              <Tab key={index} label={activity.label} icon={activity.icon} {...tabProps(index)} />
            ))}
          </Tabs>
          {activities.map((activity, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              <Typography
                variant="body2"
                component="p"
                sx={{ fontWeight: 600, color: "var(--outline)" }}
              >
                {activity.label}
              </Typography>
              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                <Typography variant="h3" component="h3">
                  {formatNumber(activityData[activity.label]?.total || 0)}
                </Typography>
                <Caption title="Total acumulado ao longo do ano" />
              </Stack>
            </TabPanel>
          ))}
        </Stack>
        <Divider sx={{ borderColor: "var(--elevation-level5)", borderWidth: 1 }} />
        <Stack
          sx={{
            width: isSmallScreen ? "100%" : "40%",
            padding: 3,
            gap: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography
            variant="body2"
            component="p"
            sx={{ fontWeight: 600, color: "var(--outline)" }}
          >
            Total
          </Typography>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Typography variant="h3" component="h3">
              {calculateTotalForYear()}
            </Typography>
            <Caption title="Total acumulado anual de todas as atividades" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default AnnualActivitiesChart
