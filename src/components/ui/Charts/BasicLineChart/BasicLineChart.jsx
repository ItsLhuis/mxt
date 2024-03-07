import React from "react"

import Chart from "react-apexcharts"

const BasicLineChart = ({ xData, yData, colorLine = "var(--secondaryContainer)" }) => {
  const chartOptions = {
    chart: {
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    xaxis: {
      categories: xData,
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      grid: {
        show: false
      }
    },
    grid: {
      show: false
    },
    stroke: {
      curve: "smooth"
    },
    colors: [colorLine],
    tooltip: {
      followCursor: true,
      theme: "dark"
    }
  }

  return <Chart options={chartOptions} series={yData} type="line" width={"100%"} height={"100%"} />
}

export default BasicLineChart
