import React from "react"

import { Grid, Paper, Box, Typography, Chip } from "@mui/material"
import { Person, AppsOutlined, Construction } from "@mui/icons-material"

import { BasicLineChart } from "@components/ui/Charts"

const Summary = () => {
  const data = [
    {
      icon: <Person />,
      title: "Clientes",
      value: 203,
      change: "+ 27,11%",
      color: "success",
      colorLine: "rgb(248, 112, 96)",
      xData: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      yData: [50, 40, 75, 60, 49, 30, 50, 61]
    },
    {
      icon: <AppsOutlined />,
      title: "Equipamentos",
      value: 135,
      change: "- 2,43%",
      color: "error",
      colorLine: "rgb(165, 170, 82)",
      xData: [
        "Agosto 2023",
        "Setembro 2023",
        "Outubro 2023",
        "Novembro 2023",
        "Dezembro 2023",
        "Janeiro",
        "Fevereiro",
        "Março"
      ],
      yData: [20, 55, 50, 15, 40, 55, 70, 15]
    },
    {
      icon: <Construction />,
      title: "Reparações",
      value: 3921,
      change: "+ 4,78%",
      color: "success",
      colorLine: "rgb(124, 152, 179)",
      xData: [
        "27 Fevereiro",
        "28 Fevereiro",
        "29 Fevereiro",
        "2 Março",
        "3 Março",
        "4 Março",
        "Ontem",
        "Hoje"
      ],
      yData: [10, 30, 25, 35, 40, 60, 55, 65]
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
                    backgroundColor: "var(--elevation-level5)"
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
                <Chip label={item.change} color={item.color} sx={{ marginTop: "auto" }} />
              </Box>
              <Box sx={{ width: "100%", height: 180, marginRight: 3, marginBottom: 3 }}>
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
