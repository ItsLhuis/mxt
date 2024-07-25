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

  const {
    data: employeeSummaryData,
    isLoading: isEmployeeSummaryLoading,
    isError: isEmployeeSummaryError
  } = findEmployeeSummary

  const {
    data: clientSummaryData,
    isLoading: isClientSummaryLoading,
    isError: isClientSummaryError
  } = findClientSummary

  const {
    data: equipmentSummaryData,
    isLoading: isEquipmentSummaryLoading,
    isError: isEquipmentSummaryError
  } = findEquipmentSummary

  const {
    data: repairSummaryData,
    isLoading: isRepairSummaryLoading,
    isError: isRepairSummaryError
  } = findRepairSummary

  const {
    data: emailSummaryData,
    isLoading: isEmailSummaryLoading,
    isError: isEmailSummaryError
  } = findEmailSummary

  const {
    data: smsSummaryData,
    isLoading: isSmsSummaryLoading,
    isError: isSmsSummaryError
  } = findSmsSummary

  const types = [
    {
      type: "employees",
      icon: <AccountBox />,
      title: "Utilizadores",
      colorLine: "rgb(248, 112, 96)",
      metricQuery: {
        isLoading: isEmployeeSummaryLoading || isEmployeeSummaryError,
        data: {
          total: formatNumber(employeeSummaryData?.total || 0),
          percentage: {
            change: formatValueToPercentage(employeeSummaryData?.percentage),
            color:
              employeeSummaryData?.percentage > 0
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
    },
    {
      type: "clients",
      icon: <Person />,
      title: "Clientes",
      colorLine: "rgb(92, 107, 192)",
      metricQuery: {
        isLoading: isClientSummaryLoading || isClientSummaryError,
        data: {
          total: formatNumber(clientSummaryData?.total || 0),
          percentage: {
            change: formatValueToPercentage(clientSummaryData?.percentage),
            color:
              clientSummaryData?.percentage > 0
                ? "success"
                : clientSummaryData?.percentage === 0
                ? "default"
                : "error"
          }
        }
      },
      chartQuery: {
        isLoading: isClientSummaryLoading || isClientSummaryError,
        data: {
          xData: clientSummaryData?.last_months_total?.map((item) => formatMonth(item.month)) || [],
          yData: clientSummaryData?.last_months_total?.map((item) => item.total) || []
        }
      }
    },
    {
      type: "equipments",
      icon: <Computer />,
      title: "Equipamentos",
      colorLine: "rgb(139, 195, 74)",
      metricQuery: {
        isLoading: isEquipmentSummaryLoading || isEquipmentSummaryError,
        data: {
          total: formatNumber(equipmentSummaryData?.total || 0),
          percentage: {
            change: formatValueToPercentage(equipmentSummaryData?.percentage),
            color:
              equipmentSummaryData?.percentage > 0
                ? "success"
                : equipmentSummaryData?.percentage === 0
                ? "default"
                : "error"
          }
        }
      },
      chartQuery: {
        isLoading: isEquipmentSummaryLoading || isEquipmentSummaryError,
        data: {
          xData:
            equipmentSummaryData?.last_months_total?.map((item) => formatMonth(item.month)) || [],
          yData: equipmentSummaryData?.last_months_total?.map((item) => item.total) || []
        }
      }
    },
    {
      type: "repairs",
      icon: <Construction />,
      title: "Reparações",
      colorLine: "rgb(255, 152, 0)",
      metricQuery: {
        isLoading: isRepairSummaryLoading || isRepairSummaryError,
        data: {
          total: formatNumber(repairSummaryData?.total || 0),
          percentage: {
            change: formatValueToPercentage(repairSummaryData?.percentage),
            color:
              repairSummaryData?.percentage > 0
                ? "success"
                : repairSummaryData?.percentage === 0
                ? "default"
                : "error"
          }
        }
      },
      chartQuery: {
        isLoading: isRepairSummaryLoading || isRepairSummaryError,
        data: {
          xData: repairSummaryData?.last_months_total?.map((item) => formatMonth(item.month)) || [],
          yData: repairSummaryData?.last_months_total?.map((item) => item.total) || []
        }
      }
    },
    {
      type: "emails",
      icon: <Email />,
      title: "E-mails",
      colorLine: "rgb(33, 150, 243)",
      metricQuery: {
        isLoading: isEmailSummaryLoading || isEmailSummaryError,
        data: {
          total: formatNumber(emailSummaryData?.total || 0),
          percentage: {
            change: formatValueToPercentage(emailSummaryData?.percentage),
            color:
              emailSummaryData?.percentage > 0
                ? "success"
                : emailSummaryData?.percentage === 0
                ? "default"
                : "error"
          }
        }
      },
      chartQuery: {
        isLoading: isEmailSummaryLoading || isEmailSummaryError,
        data: {
          xData: emailSummaryData?.last_months_total?.map((item) => formatMonth(item.month)) || [],
          yData: emailSummaryData?.last_months_total?.map((item) => item.total) || []
        }
      }
    },
    {
      type: "smses",
      icon: <Sms />,
      title: "SMS",
      colorLine: "rgb(255, 87, 34)",
      metricQuery: {
        isLoading: isSmsSummaryLoading || isSmsSummaryError,
        data: {
          total: formatNumber(smsSummaryData?.total || 0),
          percentage: {
            change: formatValueToPercentage(smsSummaryData?.percentage),
            color:
              smsSummaryData?.percentage > 0
                ? "success"
                : smsSummaryData?.percentage === 0
                ? "default"
                : "error"
          }
        }
      },
      chartQuery: {
        isLoading: isSmsSummaryLoading || isSmsSummaryError,
        data: {
          xData: smsSummaryData?.last_months_total?.map((item) => formatMonth(item.month)) || [],
          yData: smsSummaryData?.last_months_total?.map((item) => item.total) || []
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
