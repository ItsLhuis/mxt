import React from "react"

import { Grid, Paper, Box, Typography, Chip, Stack } from "@mui/material"
import { Person, AppsOutlined, Construction } from "@mui/icons-material"

import { Caption } from "@components/ui"
import { BasicLineChart } from "@components/ui/Charts"

import { formatMonth } from "@utils/format/date"

const Summary = () => {
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

  const data = [
    {
      icon: <Person />,
      title: "Clientes",
      value: 503,
      change: "+ 27,11%",
      color: "success",
      colorLine: "rgb(248, 112, 96)",
      xData: getLatestEightDates(),
      yData: Array.from({ length: 8 }, () => Math.floor(Math.random() * 100))
    },
    {
      icon: <AppsOutlined />,
      title: "Equipamentos",
      value: 735,
      change: "- 2,43%",
      color: "error",
      colorLine: "rgb(165, 170, 82)",
      xData: getLatestEightDates(),
      yData: Array.from({ length: 8 }, () => Math.floor(Math.random() * 300))
    },
    {
      icon: <Construction />,
      title: "Reparações",
      value: 3921,
      change: "+ 4,78%",
      color: "success",
      colorLine: "rgb(124, 152, 179)",
      xData: getLatestEightDates(),
      yData: Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000))
    }
  ]

  const mdSize = data.length % 2 === 0 ? 6 : 12

  return (
    <Grid container spacing={3}>
      {data.map((item, index) => (
        <Grid key={index} item xs={12} md={index === data.length - 1 ? mdSize : 6} lg={4}>
          <Paper elevation={1}>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1.3,
                  padding: 3
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1.5,
                    borderRadius: 2,
                    backgroundColor: "var(--elevation-level3)"
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="p" component="p" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="h3" component="h3">
                  {item.value}
                </Typography>
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                  <Chip label={item.change} color={item.color} sx={{ marginTop: "auto" }} />
                  <Caption title="Em comparação com o mês anterior" />
                </Stack>
              </Box>
              <Box sx={{ width: "100%", height: 180, marginRight: 3 }}>
                <BasicLineChart
                  colorLine={item.colorLine}
                  xData={item.xData}
                  yData={[
                    {
                      name: item.title,
                      data: item.yData
                    }
                  ]}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default Summary
