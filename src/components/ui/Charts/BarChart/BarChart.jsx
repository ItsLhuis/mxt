import PropTypes from "prop-types"

import React from "react"

import { useTheme, useMediaQuery } from "@mui/material"

import Chart from "react-apexcharts"

const BarChart = ({ data, categories, colors }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const chartOptions = {
    chart: {
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true
      }
    },
    forceNiceScale: true,
    legend: {
      position: "top",
      horizontalAlign: "right"
    },
    plotOptions: {
      bar: {
        horizontal: isSmallScreen ? true : false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "var(--outline)"
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: "var(--outline)"
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    grid: {
      show: true,
      borderColor: "var(--outline)",
      strokeDashArray: 5,
      position: "back",
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        right: 24,
        left: 24
      }
    },
    colors: colors,
    tooltip: {
      followCursor: true
    }
  }

  return <Chart options={chartOptions} series={data} type="bar" width={"100%"} height={"100%"} />
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired
}

export default BarChart
