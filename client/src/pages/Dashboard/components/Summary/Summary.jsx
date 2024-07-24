import React from "react"

import { useDashboard } from "@hooks/server/useDashboard"

import { Grid } from "@mui/material"

import { AccountBox, Person } from "@mui/icons-material"

import { SummaryCard } from "./components"

import { formatMonth } from "@utils/format/date"

const Summary = () => {
  const { findEmployeeSummary } = useDashboard()
  const {
    data: employeeSummaryData,
    isLoading: isEmployeeSummaryLoading,
    isError: isEmployeeSummaryError
  } = findEmployeeSummary

  const types = [
    {
      type: "users",
      icon: <AccountBox />,
      title: "Utilizadores",
      colorLine: "rgb(248, 112, 96)",
      metricQuery: {
        isLoading: isEmployeeSummaryLoading || isEmployeeSummaryError,
        data: {
          total: employeeSummaryData?.total || 0,
          percentage: {
            change: `${employeeSummaryData?.percentage?.toFixed(2) || "0.00"}%`,
            color:
              employeeSummaryData?.percentage >= 0
                ? "success"
                : employeeSummaryData?.percentage === 0
                ? "default"
                : "error"
          }
        }
      },
      chartQuery: {
        isLoading: isEmployeeSummaryLoading || isEmployeeSummaryError,
        data: {
          xData:
            employeeSummaryData?.last_months_total?.map((item) => formatMonth(item.month)) || [],
          yData: employeeSummaryData?.last_months_total?.map((item) => item.total) || []
        }
      }
    }
  ]

  return (
    <Grid container spacing={3}>
      {types.map(({ type, icon, title, colorLine, metricQuery, chartQuery }, index) => (
        <SummaryCard
          key={type}
          icon={icon}
          title={title}
          metricQuery={metricQuery}
          chartQuery={chartQuery}
          colorLine={colorLine}
          mdSize={index === types.length - 1 ? (types.length % 2 === 0 ? 6 : 12) : 6}
          lgSize={types.length >= 3 ? 4 : types.length === 1 ? 12 : 6}
        />
      ))}
    </Grid>
  )
}

export default Summary
