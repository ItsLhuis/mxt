import React, { useState } from "react"

import {
  Paper,
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  FormControl,
  InputAdornment,
  Typography,
  Stack,
  Chip,
  Button,
  ListItemText,
  Tooltip,
  IconButton,
  Avatar
} from "@mui/material"
import { Search, DeleteOutline, Info } from "@mui/icons-material"

import { MultipleSelectCheckmarks, DatePicker, Table } from "@components/ui"

import { getContrastColor, getStringColor, debounce } from "@utils/shared"
import { formatValueToEuro } from "@utils/format/currency"
import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const renderFilterChips = (filterName, values, handleDelete) => {
  if (Array.isArray(values)) {
    if (values.length > 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            border: "1px solid var(--elevation-level5)",
            borderRadius: 2,
            padding: 1
          }}
        >
          <Typography variant="p" component="p" fontWeight={600}>
            {filterName}:
          </Typography>
          <Stack sx={{ display: "flex", flexFlow: "wrap", gap: 1 }}>
            {values.map((value, index) => (
              <Chip
                key={index}
                label={value}
                onDelete={() => handleDelete(index)}
                sx={{
                  "& .MuiChip-label": { whiteSpace: "normal", padding: "8px 14px" },
                  height: "auto"
                }}
              />
            ))}
          </Stack>
        </Box>
      )
    }
  } else {
    if (values !== null && values !== "") {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            border: "1px solid var(--elevation-level5)",
            borderRadius: 2,
            padding: 1
          }}
        >
          <Typography variant="p" component="p" fontWeight={600}>
            {filterName}:
          </Typography>
          <Chip
            label={values}
            onDelete={handleDelete}
            sx={{
              "& .MuiChip-label": { whiteSpace: "normal", padding: "8px 14px" },
              height: "auto"
            }}
          />
        </Box>
      )
    }
  }
  return null
}

const InvoiceList = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedServiceItems, setSelectedServiceItems] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [searchValue, setSearchValue] = useState("")

  const handleResetSelectedTab = () => {
    setSelectedTab(0)
  }
  const handleTabChange = (_, value) => {
    setSelectedTab(value)
  }

  const handleRemoveService = (index) => {
    const updatedServices = [...selectedServiceItems]
    updatedServices.splice(index, 1)
    setSelectedServiceItems(updatedServices)
  }
  const handleSelectedServiceItemsChange = (value) => {
    setSelectedServiceItems(value)
  }

  const handleRemoveDate = () => {
    setStartDate(null)
    setEndDate(null)
  }
  const handleStartDateChange = (date) => {
    setStartDate(date)
  }
  const handleEndDateChange = (date) => {
    setEndDate(date)
  }

  const handleRemoveSearchInpuValue = () => {
    setSearchValue("")
  }
  const handleDebouncedSearchInputChange = debounce((value) => {
    setSearchValue(value)
  })
  const handleSearchInputChange = (event) => {
    handleDebouncedSearchInputChange(event.target.value)
  }

  const handleRemoveFilters = () => {
    setSelectedTab(0)
    setSelectedServiceItems([])
    setStartDate(null)
    setEndDate(null)
    setSearchValue("")
  }

  const hasFiltersApplied = () => {
    if (
      selectedTab !== 0 ||
      selectedServiceItems.length > 0 ||
      (startDate && endDate && endDate >= startDate) ||
      searchValue.trim() !== ""
    ) {
      return true
    } else {
      return false
    }
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

  const services = [
    "Reparação",
    "Configuração de Redes",
    "Backup e Recuperação de Dados",
    "Consultoria",
    "Manutenção Preventiva",
    "Venda de Produtos",
    "Formação",
    "Suporte Técnico Remoto",
    "Acessórios e Complementos"
  ]

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
      id: "info",
      align: "center",
      sortable: false,
      renderComponent: ({ data }) => (
        <Tooltip title="Info" placement="bottom">
          <IconButton onClick={() => console.log(data)}>
            <Info fontSize="inherit" />
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
      value: 119900,
      total: 119900,
      type: "Rendimento (Pendente)",
      info: "ola",
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
      value: 199900,
      total: 199900,
      type: "Despesa",
      info: "ola",
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
      value: 39900,
      total: 39900,
      type: "Despesa",
      info: "ola",
      info: "ola",
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
      value: 4900,
      total: 4900,
      type: "Rendimento",
      info: "ola",
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
      value: 249900,
      total: 249900,
      type: "Rendimento",
      info: "ola",
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
          value={selectedTab}
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
        <Box sx={{ padding: 3, paddingTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={2}>
              <MultipleSelectCheckmarks
                label="Serviço"
                data={services}
                selectedItems={selectedServiceItems}
                onChange={handleSelectedServiceItemsChange}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={2}>
              <FormControl sx={{ width: "100%" }}>
                <DatePicker
                  label="Data inicial"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={2}>
              <FormControl sx={{ width: "100%" }}>
                <DatePicker label="Data final" value={endDate} onChange={handleEndDateChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  name="search"
                  label="Pesquisar"
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  autoComplete="off"
                  placeholder="Pesquise o nome do cliente ou número da fatura..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Typography variant="p" component="p" sx={{ marginTop: 2 }}>
            <b>13</b> resultados encontrados
          </Typography>
          {hasFiltersApplied() && (
            <Stack sx={{ marginTop: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack sx={{ display: "flex", flexFlow: "wrap", alignItems: "center", gap: 1 }}>
                {selectedTab !== 0 &&
                  renderFilterChips("Estado", tabsInfo[selectedTab].name, handleResetSelectedTab)}
                {renderFilterChips("Serviço", selectedServiceItems, handleRemoveService)}
                {startDate &&
                  endDate &&
                  renderFilterChips(
                    "Data",
                    formatDate(startDate) + " - " + formatDate(endDate),
                    handleRemoveDate
                  )}
                {searchValue.trim() !== "" &&
                  renderFilterChips("Pesquisar", searchValue, handleRemoveSearchInpuValue)}
                <Button
                  startIcon={<DeleteOutline sx={{ color: "rgb(211, 47, 47)" }} />}
                  color="error"
                  onClick={handleRemoveFilters}
                >
                  Limpar
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
        <Table columns={tableColumns} data={tableData} mode="datatable" />
      </Box>
    </Paper>
  )
}

export default InvoiceList
