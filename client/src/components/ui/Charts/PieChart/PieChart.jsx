import PropTypes from "prop-types"

import React from "react"

import Chart from "react-apexcharts"

const PieChart = ({ data, labels, colors }) => {
  const chartOptions = {
    chart: {
      zoom: {
        enabled: false
      }
    },
    colors: colors,
    labels: labels,
    legend: {
      position: "bottom",
      horizontalAlign: "center"
    },
    tooltip: {
      followCursor: true
    },
    stroke: {
      colors: ["var(--elevation-level1)"]
    }
  }

  return <Chart options={chartOptions} series={data} type="pie" width={"100%"} height={"100%"} />
}

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired
}

export default PieChart
