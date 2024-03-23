import React, { useState } from "react"

import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputAdornment,
  Typography,
  Stack,
  Chip,
  Button
} from "@mui/material"
import { Search, DeleteOutline } from "@mui/icons-material"

import { MultipleSelectCheckmarks, DatePicker } from "@components/ui"

import { debounce } from "@utils/shared/debounce"
import { formatDate } from "@utils/format/date"

const renderFilterChips = (filterName, values, handleRemoveFilter) => {
  if (!values || (Array.isArray(values) && values.length === 0)) {
    return null
  }

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
      {Array.isArray(values) ? (
        <Stack sx={{ display: "flex", flexFlow: "wrap", gap: 1 }}>
          {values.map((value, index) => (
            <Chip
              key={index}
              label={value}
              onDelete={() => handleRemoveFilter(filterName)}
              sx={{
                "& .MuiChip-label": { whiteSpace: "normal", padding: "8px 14px" },
                height: "auto"
              }}
            />
          ))}
        </Stack>
      ) : (
        <Chip
          label={values}
          onDelete={() => handleRemoveFilter(filterName)}
          sx={{
            "& .MuiChip-label": { whiteSpace: "normal", padding: "8px 14px" },
            height: "auto"
          }}
        />
      )}
    </Box>
  )
}

const Filters = ({
  filters,
  tabsInfo,
  handleResetSelectedTab,
  handleRemoveService,
  handleSelectedServiceItemsChange,
  handleRemoveDate,
  handleStartDateChange,
  handleEndDateChange,
  handleRemoveSearchInpuValue,
  handleSearchInputChange,
  handleClearFilters
}) => {
  const [searchInput, setSearchInput] = useState("")

  const debouncedHandleSearchInputChange = debounce((value) => {
    handleSearchInputChange(value)
  }, 2000)

  const handleInputChange = (event) => {
    const value = event.target.value
    setSearchInput(value)
    debouncedHandleSearchInputChange(value)
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

  const hasFiltersApplied = () => {
    const { selectedTab, selectedServiceItems, startDate, endDate } = filters

    return (
      selectedTab !== 0 ||
      selectedServiceItems.length > 0 ||
      (startDate && endDate && endDate >= startDate) ||
      searchInput.trim() !== ""
    )
  }

  return (
    <Box sx={{ padding: 3, paddingTop: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={2}>
          <MultipleSelectCheckmarks
            label="Serviço"
            data={services}
            selectedItems={filters.selectedServiceItems}
            onChange={handleSelectedServiceItemsChange}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={2}>
          <FormControl fullWidth>
            <DatePicker
              label="Data inicial"
              value={filters.startDate}
              onChange={handleStartDateChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12} lg={2}>
          <FormControl fullWidth>
            <DatePicker
              label="Data final"
              value={filters.endDate}
              minDate={filters.startDate}
              onChange={handleEndDateChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <FormControl fullWidth>
            <TextField
              name="search"
              label="Pesquisar"
              value={searchInput}
              onChange={handleInputChange}
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
      {hasFiltersApplied() && (
        <Stack sx={{ marginTop: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack sx={{ display: "flex", flexFlow: "wrap", alignItems: "center", gap: 1 }}>
            {filters.selectedTab !== 0 &&
              renderFilterChips(
                "Estado",
                tabsInfo[filters.selectedTab].name,
                handleResetSelectedTab
              )}
            {renderFilterChips("Serviço", filters.selectedServiceItems, handleRemoveService)}
            {filters.startDate &&
              filters.endDate &&
              renderFilterChips(
                "Data",
                formatDate(filters.startDate) + " - " + formatDate(filters.endDate),
                handleRemoveDate
              )}
            {searchInput.trim() !== "" &&
              renderFilterChips("Pesquisar", searchInput, () => {
                setSearchInput("")
                handleRemoveSearchInpuValue()
              })}
            <Button
              startIcon={<DeleteOutline sx={{ color: "rgb(211, 47, 47)" }} />}
              color="error"
              onClick={() => {
                setSearchInput("")
                handleClearFilters()
              }}
            >
              Limpar
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  )
}

export default Filters
