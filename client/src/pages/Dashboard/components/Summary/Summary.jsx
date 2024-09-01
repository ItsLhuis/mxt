import React from "react"

import { useDashboard } from "@hooks/server/useDashboard"

import { Grid } from "@mui/material"

import { AccountBox, Person, Computer, Construction, Email, Sms } from "@mui/icons-material"

import { SummaryCard } from "./components"

import { formatNumber } from "@utils/format/number"
import { formatValueToPercentage } from "@utils/format/percentage"
import { formatMonth } from "@utils/format/date"

const Summary = () => {
  const {
    findEmployeeSummary,
    findClientSummary,
    findEquipmentSummary,
    findRepairSummary,
    findEmailSummary,
    findSmsSummary
  } = useDashboard()

  const summaryConfigs = [
    {
      type: "employees",
      icon: <AccountBox />,
      title: "Funcionários",
      colorLine: "rgb(248, 112, 96)",
      dataHook: findEmployeeSummary
    },
    {
      type: "clients",
      icon: <Person />,
      title: "Clientes",
      colorLine: "rgb(92, 107, 192)",
      dataHook: findClientSummary
    },
    {
      type: "equipments",
      icon: <Computer />,
      title: "Equipamentos",
      colorLine: "rgb(139, 195, 74)",
      dataHook: findEquipmentSummary
    },
    {
      type: "repairs",
      icon: <Construction />,
      title: "Reparações",
      colorLine: "rgb(255, 152, 0)",
      dataHook: findRepairSummary
    },
    {
      type: "emails",
      icon: <Email />,
      title: "E-mails",
      colorLine: "rgb(33, 150, 243)",
      dataHook: findEmailSummary
    },
    {
      type: "smses",
      icon: <Sms />,
      title: "SMS",
      colorLine: "rgb(255, 87, 34)",
      dataHook: findSmsSummary
    }
  ]

  const createTypeConfig = ({ icon, title, colorLine, dataHook }) => {
    const { data, isLoading, isError } = dataHook

    return {
      icon,
      title,
      colorLine,
      metricQuery: {
        isLoading: isLoading || isError,
        data: {
          total: formatNumber(data?.total || 0),
          percentage: {
            change: formatValueToPercentage(data?.percentage_change_last_two_months),
            color:
              data?.percentage_change_last_two_months > 0
                ? "success"
                : data?.percentage_change_last_two_months === 0
                ? "default"
                : "error"
          }
        }
      },
      chartQuery: {
        isLoading: isLoading || isError,
        data: {
          xData: data?.last_months_total?.map((item) => formatMonth(item.month)) || [],
          yData: data?.last_months_total?.map((item) => item.total) || []
        }
      }
    }
  }

  return (
    <Grid container spacing={3}>
      {summaryConfigs.map((config, index) => (
        <SummaryCard
          key={config.type}
          {...createTypeConfig(config)}
          mdSize={
            index === summaryConfigs.length - 1 ? (summaryConfigs.length % 2 === 0 ? 6 : 12) : 6
          }
          lgSize={summaryConfigs.length >= 3 ? 4 : summaryConfigs.length === 1 ? 12 : 6}
        />
      ))}
    </Grid>
  )
}

export default Summary
