import PropTypes from "prop-types"

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
      },
      tooltip: {
        enabled: false
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
      followCursor: true
    }
  }

  return <Chart options={chartOptions} series={yData} type="line" width={"100%"} height={"100%"} />
}

BasicLineChart.propTypes = {
  xData: PropTypes.array.isRequired,
  yData: PropTypes.array.isRequired,
  colorLine: PropTypes.string
}

export default BasicLineChart
