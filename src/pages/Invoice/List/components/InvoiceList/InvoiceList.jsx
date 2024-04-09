import React, { useState } from "react"

import {
  Paper,
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
  Chip,
  ListItemText,
  Tooltip,
  IconButton,
  Avatar
} from "@mui/material"
import { DeleteOutline, MoreVert } from "@mui/icons-material"

import { Table } from "@components/ui"
import Filters from "./components/Filters/Filters"

import { getContrastColor, getStringColor } from "@utils/shared"
import { formatValueToEuro } from "@utils/format/currency"
import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const InvoiceList = () => {
  const [filters, setFilters] = useState({
    selectedTab: 0,
    selectedServiceItems: [],
    startDate: null,
    endDate: null,
    searchValue: ""
  })

  const handleResetSelectedTab = () => {
    setFilters({ ...filters, selectedTab: 0 })
  }
  const handleTabChange = (_, value) => {
    setFilters({ ...filters, selectedTab: value })
  }

  const handleRemoveService = (index) => {
    const updatedServices = [...filters.selectedServiceItems]
    updatedServices.splice(index, 1)
    setFilters({ ...filters, selectedServiceItems: updatedServices })
  }
  const handleSelectedServiceItemsChange = (value) => {
    setFilters({ ...filters, selectedServiceItems: value })
  }

  const handleRemoveDate = () => {
    setFilters({ ...filters, startDate: null, endDate: null })
  }
  const handleStartDateChange = (date) => {
    setFilters({ ...filters, startDate: date })
  }
  const handleEndDateChange = (date) => {
    setFilters({ ...filters, endDate: date })
  }

  const handleRemoveSearchInpuValue = () => {
    setFilters({ ...filters, searchValue: "" })
  }
  const handleSearchInputChange = (value) => {
    setFilters({ ...filters, searchValue: value })
  }

  const handleClearFilters = () => {
    setFilters({
      selectedTab: 0,
      selectedServiceItems: [],
      startDate: null,
      endDate: null,
      searchValue: ""
    })
  }

  const tabsInfo = [
    { id: 0, name: "Total", total: 100, color: "primary" },
    { id: 1, name: "Pago", total: 65, color: "success" },
    { id: 2, name: "Pendente", total: 20, color: "warning" },
    { id: 3, name: "Atrasado", total: 10, color: "error" },
    { id: 4, name: "Rascunho", total: 5, color: "default" }
  ]

  const tabProps = (index) => {
    return {
      id: `invoice-list-tab-${index}`,
      "aria-controls": `invoice-list-tabpanel-${index}`
    }
  }

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
              <ListItemText
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
              </ListItemText>
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
            <ListItemText
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
            </ListItemText>
          </Stack>
        )
      },
      {
        id: "date",
        label: "Data",
        align: "left",
        sortable: true,
        renderComponent: ({ data }) => (
          <ListItemText
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
          </ListItemText>
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
        <ListItemText
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
        </ListItemText>
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
      align: "right",
      sortable: false,
      renderComponent: ({ data }) => (
        <Tooltip title="Mais Opções" placement="bottom" sx={{ margin: -1 }}>
          <IconButton onClick={() => console.log(data)}>
            <MoreVert fontSize="inherit" />
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
      <Box sx={{ marginTop: 3 }}>
        <Tabs
          value={filters.selectedTab}
          onChange={handleTabChange}
          aria-label="settings-tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: "1px solid var(--elevation-level5)", padding: "0 24px" }}
        >
          {tabsInfo.map((tab) => (
            <Tab
              key={tab.id}
              label={
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Typography variant="p">{tab.name}</Typography>
                  <Chip label={tab.total} color={tab.color} />
                </Stack>
              }
              {...tabProps(tab.name)}
              disableRipple
            />
          ))}
        </Tabs>
        <Filters
          filters={filters}
          tabsInfo={tabsInfo}
          handleResetSelectedTab={handleResetSelectedTab}
          handleRemoveService={handleRemoveService}
          handleSelectedServiceItemsChange={handleSelectedServiceItemsChange}
          handleRemoveDate={handleRemoveDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          handleRemoveSearchInpuValue={handleRemoveSearchInpuValue}
          handleSearchInputChange={handleSearchInputChange}
          handleClearFilters={handleClearFilters}
        />
        <Table
          columns={tableColumns}
          data={tableData}
          mode="datatable"
          actions={[
            {
              icon: <DeleteOutline sx={{ color: "rgb(228, 225, 230)" }} />,
              tooltip: "Eliminar",
              onClick: () => console.log()
            }
          ]}
        />
      </Box>
    </Paper>
  )
}

export default InvoiceList
