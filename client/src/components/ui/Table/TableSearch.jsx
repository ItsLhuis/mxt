import React, { useEffect, useState } from "react"

import { Stack, Typography, TextField, InputAdornment, Chip, Button } from "@mui/material"
import { Search, Delete } from "@mui/icons-material"

import { debounce } from "@utils"

const renderFilterChips = (filterName, values, handleRemoveFilter) => {
  if (!values || (Array.isArray(values) && values.length === 0)) {
    return null
  }

  return (
    <Stack
      sx={{
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
        <Stack sx={{ flexFlow: "wrap", gap: 1 }}>
          {values.map((value, index) => (
            <Chip
              key={index}
              label={value}
              onDelete={() => handleRemoveFilter(filterName)}
              sx={{
                "& .MuiChip-label": {
                  whiteSpace: "normal",
                  wordBreak: "break-all",
                  padding: "8px 14px"
                },
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
    </Stack>
  )
}

const TableSearch = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("")

  const handleInputChange = (event) => {
    const value = event.target.value
    setSearchInput(value)
  }

  const handleClearSearch = () => {
    setSearchInput("")
    onSearch("")
  }

  useEffect(() => {
    debounce(onSearch(searchInput), 300)
  }, [searchInput])

  return (
    <Stack sx={{ width: "100%" }}>
      <TextField
        label="Pesquisar"
        placeholder="O que procura?"
        sx={{ width: "100%" }}
        value={searchInput}
        onChange={handleInputChange}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />
      {searchInput.trim() !== "" && (
        <Stack sx={{ marginTop: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack
            sx={{
              display: "flex",
              flexFlow: "wrap",
              alignItems: "center",
              gap: 1,
              overflow: "hidden",
              overflowX: "auto"
            }}
          >
            {searchInput.trim() !== "" &&
              renderFilterChips("Pesquisar", searchInput, handleClearSearch)}
            <Button startIcon={<Delete color="error" />} color="error" onClick={handleClearSearch}>
              Limpar
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

export default TableSearch
