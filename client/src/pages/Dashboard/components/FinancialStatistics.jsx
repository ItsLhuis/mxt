import React from "react"

import { useNavigate } from "react-router-dom"

import {
  Paper,
  Typography,
  Box,
  Stack,
  Grid,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material"
import { KeyboardArrowRightOutlined, MoreVert } from "@mui/icons-material"

import { ButtonDropDownSelect, ListButton, Table } from "@components/ui"
import { BarChart } from "@components/ui/Charts"

import { getContrastColor, getStringColor } from "@utils"
import { formatValueToEuro } from "@utils/format/currency"
import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const FinancialStatistics = () => {
  const navigate = useNavigate()

  const chartData = [
    {
      name: "Rendimentos",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 700))
    },
    {
      name: "Despesas",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 400))
    }
  ]

  const colors = ["rgb(54, 200, 140)", "rgb(238, 108, 93)"]

  const financialData = [
    { title: "Rendimentos", amount: formatValueToEuro(152983.0) },
    { title: "Despesas", amount: formatValueToEuro(24813.0) },
    { title: "Lucro", amount: formatValueToEuro(128170.0) }
  ]

  const mdSize = financialData.length % 2 === 0 ? 6 : 12

  const getExpandableContent = (rowType, rowData) => {
    let additionalColumns = []

    if (rowType === "Despesa") {
      additionalColumns = [
        {
          id: "action",
          label: "Ação",
          align: "left",
          sortable: true,
          renderComponent: ({ data }) => <Chip label={data} />
        }
      ]
    } else if (rowType === "Rendimento") {
      additionalColumns = [
        {
          id: "customer",
          label: "Cliente",
          align: "left",
          sortable: false,
          renderComponent: ({ data }) => (
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 1
              }}
            >
              <Stack
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <Typography variant="p" component="p" fontWeight={500}>
                  {data.customerName}
                </Typography>
                <Typography variant="p" component="p" color="var(--outline)">
                  {formatPhoneNumber(data.customerPhoneNumber)}
                </Typography>
              </Stack>
            </Stack>
          )
        },
        {
          id: "type",
          label: "Tipo",
          align: "left",
          sortable: true,
          renderComponent: ({ data }) => <Chip label={data} />
        },
        {
          id: "status",
          label: "Estado",
          align: "left",
          sortable: true,
          renderComponent: ({ data }) => (
            <Chip
              label={data}
              color={data === "Pago" ? "success" : data === "Por pagar" ? "error" : "warning"}
            />
          )
        }
      ]
    }

    const expandableContentColumns = [
      {
        id: "user",
        label: "Utilizador",
        align: "left",
        sortable: false,
        renderComponent: ({ data }) => (
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 1
            }}
          >
            <Avatar
              alt={data.name}
              src={data.profilePic}
              sx={{
                backgroundColor: `${getStringColor(data.name)} !important`,
                color: getContrastColor(getStringColor(data.name))
              }}
            >
              {data.name.charAt(0)}
            </Avatar>
            <Stack
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              <Typography variant="p" component="p" fontWeight={500}>
                {data.name}
              </Typography>
              <Typography variant="p" component="p" color="var(--outline)">
                {data.role}
              </Typography>
            </Stack>
          </Stack>
        )
      },
      {
        id: "date",
        label: "Data",
        align: "left",
        sortable: true,
        renderComponent: ({ data }) => (
          <Stack
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            <Typography variant="p" component="p" fontWeight={500}>
              {formatDate(data)}
            </Typography>
            <Typography variant="p" component="p" color="var(--outline)">
              {formatTime(data)}
            </Typography>
          </Stack>
        )
      },
      ...additionalColumns
    ]

    return (
      <Stack sx={{ color: "var(--onSurface)", margin: 3 }}>
        <Typography variant="h6" component="h6" marginBottom={3}>
          Histórico
        </Typography>
        <Box
          sx={{
            border: "1px solid var(--elevation-level5)",
            borderRadius: 2,
            overflow: "hidden"
          }}
        >
          <Table columns={expandableContentColumns} data={rowData} />
        </Box>
      </Stack>
    )
  }

  const tableColumns = [
    { id: "description", label: "Descrição", align: "left", sortable: true },
    {
      id: "date",
      label: "Data",
      align: "left",
      sortable: true,
      renderComponent: ({ data }) => (
        <Stack
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          <Typography variant="p" component="p" fontWeight={500}>
            {formatDate(data)}
          </Typography>
          <Typography variant="p" component="p" color="var(--outline)">
            {formatTime(data)}
          </Typography>
        </Stack>
      )
    },
    { id: "amount", label: "Quantidade", align: "left", sortable: true },
    { id: "value", label: "Valor", align: "left", sortable: true, formatter: formatValueToEuro },
    { id: "total", label: "Total", align: "left", sortable: true, formatter: formatValueToEuro },
    {
      id: "type",
      label: "Tipo",
      align: "left",
      sortable: true,
      renderComponent: ({ data }) => (
        <Chip
          label={data}
          color={data === "Rendimento" ? "success" : data === "Despesa" ? "error" : "warning"}
        />
      )
    },
    {
      id: "moreOptions",
      align: "center",
      sortable: false,
      renderComponent: ({ data }) => (
        <Tooltip title="Mais Opções"  sx={{ margin: -1 }}>
          <IconButton onClick={() => console.log(data)}>
            <MoreVert />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  const tableData = [
    {
      id: 1,
      description: "Smartphone Samsung Galaxy S22 Ultra",
      date: new Date("Tue Mar 05 2024 09:24:24 GMT+0000 (Hora padrão da Europa Ocidental)"),
      amount: 1,
      value: 1199,
      total: 1199,
      type: "Rendimento (Pendente)",
      moreOptions: "ola",
      expandableContent: () =>
        getExpandableContent("Rendimento", [
          {
            id: 2,
            user: {
              name: "Luis Rodrigues",
              role: "Chefe",
              profilePic: null
            },
            date: new Date(),
            customer: {
              customerName: "João Silva",
              customerPhoneNumber: "912832943"
            },
            type: "Reparação",
            status: "Por pagar"
          }
        ])
    },
    {
      id: 2,
      description: "Laptop Apple MacBook Pro 14 M1 Pro",
      date: new Date(),
      amount: 1,
      value: 1999,
      total: 1999,
      type: "Despesa",
      moreOptions: "ola",
      expandableContent: () =>
        getExpandableContent("Despesa", [
          {
            id: 2,
            user: {
              name: "Gonçalo Pinto",
              role: "Funcionário",
              profilePic: null
            },
            date: new Date("Tue Mar 05 2024 9:24:24 GMT+0000 (Hora padrão da Europa Ocidental)"),
            action: "Atualização"
          },
          {
            id: 1,
            user: {
              name: "Luis Rodrigues",
              role: "Administrador",
              profilePic: null
            },
            date: new Date("Tue Mar 03 2024 10:10:24 GMT+0000 (Hora padrão da Europa Ocidental)"),
            action: "Criação"
          }
        ])
    },
    {
      id: 3,
      description: "Smartwatch Apple Watch Series 7",
      date: new Date(),
      amount: 1,
      value: 399,
      total: 399,
      type: "Despesa",
      moreOptions: "ola",
      expandableContent: () =>
        getExpandableContent("Despesa", [
          {
            id: 4,
            user: {
              name: "Luis Rodrigues",
              role: "Administrador",
              profilePic: null
            },
            date: new Date(),
            action: "Criação"
          }
        ])
    },
    {
      id: 4,
      description: "Formatação Apple MacBook Pro 14 M1 Pro",
      date: new Date(),
      amount: 1,
      value: 49,
      total: 49,
      type: "Rendimento",
      moreOptions: "ola",
      expandableContent: () =>
        getExpandableContent("Rendimento", [
          {
            id: 3,
            user: {
              name: "Luis Rodrigues",
              role: "Administrador",
              profilePic: null
            },
            date: new Date(),
            customer: {
              customerName: "Maria Santos",
              customerPhoneNumber: "912832943"
            },
            type: "Reparação",
            status: "Pago"
          },
          {
            id: 4,
            user: {
              name: "Ana Silva",
              role: "Funcionário",
              profilePic: null
            },
            date: new Date("Tue Mar 03 2024 10:10:24 GMT+0000 (Hora padrão da Europa Ocidental)"),
            customer: {
              customerName: "Maria Santos",
              customerPhoneNumber: "912832943"
            },
            type: "Reparação",
            status: "Por pagar"
          }
        ])
    },
    {
      id: 5,
      description: "Câmera digital Sony Alpha 7 IV",
      date: new Date(),
      amount: 1,
      value: 2499,
      total: 2499,
      type: "Rendimento",
      moreOptions: "ola",
      expandableContent: () =>
        getExpandableContent("Rendimento", [
          {
            id: 3,
            user: {
              name: "Luis Rodrigues",
              role: "Administrador",
              profilePic: null
            },
            date: new Date(),
            customer: {
              customerName: "Maria Santos",
              customerPhoneNumber: "912832943"
            },
            type: "Reparação",
            status: "Pago"
          },
          {
            id: 4,
            user: {
              name: "Xavier Silva",
              role: "Funcionário",
              profilePic: null
            },
            date: new Date("Tue Mar 03 2024 10:10:24 GMT+0000 (Hora padrão da Europa Ocidental)"),
            customer: {
              customerName: "Maria Santos",
              customerPhoneNumber: "912832943"
            },
            type: "Reparação",
            status: "Por pagar"
          }
        ])
    }
  ]

  return (
    <Paper elevation={1}>
      <Box>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 2,
            padding: 3,
            paddingBottom: 0
          }}
        >
          <Typography variant="h5" component="h5" sx={{ marginBottom: 3 }}>
            Estatísticas Financeiras
          </Typography>
          <Box>
            <ButtonDropDownSelect title="2024">
              <ListButton
                buttons={[
                  { label: "Todos os anos", onClick: () => console.log() },
                  { label: "2024", onClick: () => console.log() },
                  { label: "2023", onClick: () => console.log() },
                  { label: "2022", onClick: () => console.log() },
                  { label: "2021", onClick: () => console.log() },
                  { label: "2020", onClick: () => console.log() },
                  { label: "2019", onClick: () => console.log() }
                ]}
              />
            </ButtonDropDownSelect>
          </Box>
        </Stack>
        <Stack>
          <Box sx={{ width: "100%", height: 400, padding: 3, paddingTop: 0, paddingBottom: 0 }}>
            <BarChart
              data={chartData}
              categories={[
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
                "Out",
                "Nov",
                "Dez"
              ]}
              colors={colors}
            />
          </Box>
          <Box sx={{ paddingBottom: 5 }}>
            <Grid container spacing={2}>
              {financialData.map((item, index) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  md={index === financialData.length - 1 ? mdSize : 6}
                  lg={4}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    <Typography
                      variant="p"
                      component="p"
                      sx={{ color: "var(--outline)", fontWeight: 500 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="h3" component="h3">
                      {item.amount}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
        <Table columns={tableColumns} data={tableData} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            padding: 3,
            borderTop: "1px solid var(--elevation-level5)"
          }}
        >
          <Button
            variant="contained"
            endIcon={<KeyboardArrowRightOutlined />}
            onClick={() => navigate("/invoice/list")}
          >
            Ver Tudo
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default FinancialStatistics
