import React from "react"

import { useQuery } from "@tanstack/react-query"

import { Grid } from "@mui/material"
import { Person, AppsOutlined, Construction } from "@mui/icons-material"

import { SummaryCard } from "./components"

import { formatMonth } from "@utils/format/date"

const getLatestEightDates = () => {
  const today = new Date()
  const dates = [today]

  for (let i = 1; i < 8; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, today.getDate())
    dates.push(date)
  }

  dates.sort((a, b) => a - b)

  const formattedDates = dates.map((date) => formatMonth(date))

  return formattedDates
}

const fetchMetricData = async (type) => {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const data = {
    clients: { total: 503, change: "+ 27,11%", color: "success" },
    equipments: { total: 735, change: "- 2,43%", color: "error" },
    repairs: { total: 3921, change: "+ 4,78%", color: "success" }
  }

  return data[type]
}

const fetchChartData = async (type) => {
  await new Promise((resolve) => setTimeout(resolve, 4000))

  const latestDates = getLatestEightDates()

  const data = {
    clients: { xData: latestDates, yData: [1, 74, 18, 68, 65, 82, 92, 68] },
    equipments: { xData: latestDates, yData: [15, 59, 46, 50, 95, 40, 0, 31] },
    repairs: { xData: latestDates, yData: [2, 72, 63, 14, 47, 87, 30, 74] }
  }

  return data[type]
}

const Summary = () => {
  const types = [
    { type: "clients", icon: <Person />, title: "Clientes", colorLine: "rgb(248, 112, 96)" },
    {
      type: "equipments",
      icon: <AppsOutlined />,
      title: "Equipamentos",
      colorLine: "rgb(165, 170, 82)"
    },
    {
      type: "repairs",
      icon: <Construction />,
      title: "Reparações",
      colorLine: "rgb(124, 152, 179)"
    }
  ]

  const mdSize = types.length % 2 === 0 ? 6 : 12

  return (
    <Grid container spacing={3}>
      {types.map(({ type, icon, title, colorLine }, index) => {
        const metricQuery = useQuery({
          queryKey: [`dashboard${type.charAt(0).toUpperCase() + type.slice(1)}MetricData`],
          queryFn: () => fetchMetricData(type)
        })

        const chartQuery = useQuery({
          queryKey: [`dashboard${type.charAt(0).toUpperCase() + type.slice(1)}ChartData`],
          queryFn: () => fetchChartData(type)
        })

        return (
          <SummaryCard
            key={type}
            icon={icon}
            title={title}
            metricQuery={metricQuery}
            chartQuery={chartQuery}
            colorLine={colorLine}
            mdSize={index === types.length - 1 ? mdSize : 6}
          />
        )
      })}
    </Grid>
  )
}

export default Summary
