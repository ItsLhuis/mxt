import React from "react"

import { Paper, Box, Typography, Stack, Divider, CircularProgress } from "@mui/material"
import {
  ReceiptOutlined,
  PlaylistAddCheck,
  Alarm,
  NotificationsActive,
  Description
} from "@mui/icons-material"

import { formatValueToEuro } from "@utils/format/currency"

const InvoiceStatus = () => {
  const invoiceStatusData = [
    {
      title: "Total",
      totalInvoices: 100,
      totalAmount: 12034.56,
      icon: (
        <ReceiptOutlined sx={{ fontSize: 27, color: "var(--primary)", position: "absolute" }} />
      ),
      color: "var(--primary)"
    },
    {
      title: "Pago",
      totalInvoices: 65,
      totalAmount: 8500.32,
      icon: (
        <PlaylistAddCheck sx={{ fontSize: 27, color: "rgb(46, 125, 50)", position: "absolute" }} />
      ),
      color: "rgb(46, 125, 50)"
    },
    {
      title: "Pendente",
      totalInvoices: 20,
      totalAmount: 2800.5,
      icon: <Alarm sx={{ fontSize: 27, color: "rgb(237, 108, 2)", position: "absolute" }} />,
      color: "rgb(237, 108, 2)"
    },
    {
      title: "Atrasado",
      totalInvoices: 10,
      totalAmount: 1500.75,
      icon: (
        <NotificationsActive
          sx={{ fontSize: 27, color: "rgb(211, 47, 47)", position: "absolute" }}
        />
      ),
      color: "rgb(211, 47, 47)"
    },
    {
      title: "Rascunho",
      totalInvoices: 5,
      totalAmount: 227.2,
      icon: <Description sx={{ fontSize: 27, color: "var(--outline)", position: "absolute" }} />,
      color: "var(--outline)"
    }
  ]

  const totalInvoices = 100

  const calculateProgress = (amount) => {
    return (amount / totalInvoices) * 100
  }

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3, overflow: "hidden", overflowX: "auto" }}>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3
          }}
        >
          {invoiceStatusData.map((data, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: 3,
                  padding: "16px 24px"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={calculateProgress(data.totalInvoices)}
                    size={60}
                    thickness={2}
                    sx={{ color: data.color, zIndex: 1 }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={60}
                    thickness={2}
                    sx={{ color: "var(--secondaryContainer)", position: "absolute" }}
                  />
                  {data.icon}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 0.5,
                    whiteSpace: "nowrap"
                  }}
                >
                  <Typography variant="h6" component="h6" fontWeight={600}>
                    {data.title}
                  </Typography>
                  <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                    {data.totalInvoices} faturas
                  </Typography>
                  <Typography variant="h6" component="h6" fontWeight={600}>
                    {formatValueToEuro(data.totalAmount)}
                  </Typography>
                </Box>
              </Box>
              {index !== invoiceStatusData.length - 1 && (
                <Divider
                  sx={{
                    height: "90px",
                    borderColor: "var(--elevation-level5)",
                    borderWidth: 1
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Stack>
      </Box>
    </Paper>
  )
}

export default InvoiceStatus
