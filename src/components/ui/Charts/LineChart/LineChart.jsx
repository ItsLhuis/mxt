import PropTypes from "prop-types"

import React from "react"

import Chart from "react-apexcharts"

import { formatMonthDateByNumber } from "@utils/format/date"

const LineChart = ({ data, categories, limits, colors }) => {
  const chartOptions = {
    chart: {
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right"
    },
    stroke: {
      curve: "smooth"
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: "var(--outline)"
        }
      }
    },
    xaxis: {
      min: limits && limits[0],
      max: limits && limits[1],
      categories: categories,
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
      },
      crosshairs: {
        show: true,
        width: 1,
        stroke: {
          color: "var(--outline)",
          width: 2,
          dashArray: 5
        }
      }
    },
    grid: {
      show: true,
      padding: {
        right: 24,
        left: 24
      },
      strokeDashArray: 5,
      borderColor: "var(--outline)"
    },
    colors: colors,
    tooltip: {
      followCursor: true,
      x: {
        formatter: function (value) {
          return formatMonthDateByNumber(value)
        }
      }
    }
  }

  return <Chart options={chartOptions} series={data} type="line" width={"100%"} height={"100%"} />
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  limits: PropTypes.array,
  colors: PropTypes.array.isRequired
}

export default LineChart
