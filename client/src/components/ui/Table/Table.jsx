import PropTypes from "prop-types"

import React, { useState, useEffect, useMemo } from "react"

import { useTheme } from "@contexts/theme"

import { produce } from "immer"

import * as ExcelJS from "exceljs"

import {
  Box,
  Typography,
  FormHelperText,
  Collapse,
  IconButton,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Checkbox,
  Tooltip,
  Stack,
  Grid,
  useTheme as muiUseTheme,
  useMediaQuery
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"

import TableSearch from "./TableSearch"

import { NoData } from ".."

import { formatNumber } from "@utils/format/number"

const getNestedValue = (obj, path, defaultValue = undefined) =>
  path.split(".").reduce((value, key) => (value ? value[key] : defaultValue), obj)

const descendingComparator = (a, b, orderBy) => {
  const valueA = getNestedValue(a, orderBy)
  const valueB = getNestedValue(b, orderBy)

  if (valueA == null && valueB == null) return 0
  if (valueA == null) return 1
  if (valueB == null) return -1

  if (valueB < valueA) return -1
  if (valueB > valueA) return 1
  return 0
}

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const getSelectedText = (selectedSize) => {
  return selectedSize === 1 ? "item selecionado" : "itens selecionados"
}

const getDataCountText = (dataSize) => {
  return dataSize === 1 ? "resultado encontrado" : "resultados encontrados"
}

const getTextColorBasedOnBackground = (backgroundColorHex) => {
  const hexToRgb = (hex) => {
    let r = 0,
      g = 0,
      b = 0

    hex = hex.replace(/^#/, "")

    if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    } else if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    }

    return [r, g, b]
  }

  const [r, g, b] = hexToRgb(backgroundColorHex)

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.6 ? "000000" : "FFFFFF"
}

const excelRowsColorMap = {
  default: "C8C6CF",
  primary: "5865F2",
  error: "D32F2F",
  info: "0288D1",
  success: "2E7D32",
  warning: "ED6C02"
}

const exportToExcel = async (data, columns, fileNamePrefix = "data") => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Sheet1")

  worksheet.columns = columns.map((col) => ({
    header: col.label || col.id,
    key: col.id,
    width: 10
  }))

  worksheet.addTable({
    name: "Table1",
    ref: "A1",
    headerRow: true,
    style: {
      showRowStripes: true
    },
    columns: columns.map((col) => ({ name: col.label || col.id })),
    rows: data.map((row) =>
      columns.map((column) => {
        const value = getNestedValue(row, column.id)
        return column.formatter ? column.formatter(value) : value
      })
    )
  })

  data.forEach((row, rowIndex) => {
    columns.forEach((column, colIndex) => {
      const value = getNestedValue(row, column.id)
      let color = null

      if (typeof column.color === "function") {
        color = column.color(value)
      } else if (typeof column.color === "string") {
        color = column.color
      }

      if (color) {
        const cell = worksheet.getCell(rowIndex + 2, colIndex + 1)

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: excelRowsColorMap[color] }
        }

        cell.font = {
          color: { argb: getTextColorBasedOnBackground(excelRowsColorMap[color]) },
          bold: true
        }
      }
    })
  })

  worksheet.columns.forEach((column) => {
    let maxLength = 0
    column.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value) {
        const cellLength = cell.value.toString().length
        if (cellLength > maxLength) {
          maxLength = cellLength
        }
      }
    })
    column.width = Math.max(maxLength + 2, 10)
  })

  const now = new Date()
  const date = now.toISOString().split("T")[0].replace(/-/g, "")
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "")
  const fileName = `${fileNamePrefix}_${date}${time}.xlsx`

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  })
}

const Table = ({
  columns,
  exportFileName,
  exportColumns = [],
  data,
  mode,
  actions,
  error,
  helperText,
  showSearch = true,
  ExpandableContentComponent
}) => {
  const { dataTheme } = useTheme()

  const theme = muiUseTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [state, setState] = useState({
    order: "asc",
    orderBy: "",
    openRows: new Set(),
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [],
    selected: new Set(),
    searchQuery: ""
  })

  const formatValueForSearch = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => formatValueForSearch(item)).join(" ")
    } else if (typeof value === "object") {
      return JSON.stringify(value)
    } else {
      return String(value)
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.some((column) => {
        const value = getNestedValue(item, column.id)
        const formattedValue = formatValueForSearch(value)
        return formattedValue.toLowerCase().includes(state.searchQuery.toLowerCase())
      })
    )
  }, [data, columns, state.searchQuery])

  useEffect(() => {
    setState((prevState) =>
      produce(prevState, (draft) => {
        const newSelected = new Set(
          Array.from(draft.selected).filter((id) => data.some((item) => item.id === id))
        )
        draft.selected = newSelected

        const defaultOptions = [5, 10, 15, 25, 50]
        let newRowsPerPage = draft.rowsPerPage

        if (data.length <= defaultOptions[defaultOptions.length - 1]) {
          const filteredOptions = defaultOptions.filter((option) => option <= data.length)
          draft.rowsPerPageOptions = filteredOptions

          if (filteredOptions.length === 0) {
            draft.rowsPerPage = 5
          } else if (!filteredOptions.includes(draft.rowsPerPage)) {
            newRowsPerPage = filteredOptions[filteredOptions.length - 1]
            draft.rowsPerPage = newRowsPerPage
          }
        } else {
          draft.rowsPerPageOptions = defaultOptions
        }

        const totalPages = Math.ceil(data.length / draft.rowsPerPage)
        if (totalPages > 0 && draft.page >= totalPages) {
          const newPage = Math.max(totalPages - 1, 0)
          draft.page = newPage
        }
      })
    )
  }, [data])

  const handleSort = (columnId) => {
    setState(
      produce((draft) => {
        const isAsc = draft.orderBy === columnId && draft.order === "asc"
        draft.order = isAsc ? "desc" : "asc"
        draft.orderBy = columnId
      })
    )
  }

  const handleRowClick = (rowId) => {
    setState(
      produce((draft) => {
        if (draft.openRows.has(rowId)) {
          draft.openRows.delete(rowId)
        } else {
          draft.openRows.add(rowId)
        }
      })
    )
  }

  const handleChangePage = (event, newPage) => {
    setState(
      produce((draft) => {
        draft.page = newPage
      })
    )
  }

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10)
    setState(
      produce((draft) => {
        draft.rowsPerPage = rowsPerPage
        draft.page = 0
      })
    )
  }

  const handleSelectAllClick = (event) => {
    const newSelected = event.target.checked ? new Set(data.map((item) => item.id)) : new Set()
    setState(
      produce((draft) => {
        draft.selected = newSelected
      })
    )
  }

  const handleClick = (event, row) => {
    const newSelected = new Set(state.selected)
    if (state.selected.has(row.id)) {
      newSelected.delete(row.id)
    } else {
      newSelected.add(row.id)
    }
    setState(
      produce((draft) => {
        draft.selected = newSelected
      })
    )
  }

  const handleActionClick = (action) => {
    action.onClick(Array.from(state.selected), () =>
      setState(
        produce((draft) => {
          draft.selected = new Set()
        })
      )
    )
  }

  const handleSearchChange = (value) => {
    setState(
      produce((draft) => {
        draft.searchQuery = value.toLowerCase().trim()
      })
    )
  }

  const selectedCount = filteredData.filter((item) => state.selected.has(item.id)).length
  const hasSelectedRows = state.selected.size > 0
  const isSelected = (id) => state.selected.has(id)

  const sortedData = useMemo(() => {
    const comparator = getComparator(state.order, state.orderBy)
    return stableSort(filteredData, comparator)
  }, [filteredData, state.order, state.orderBy])

  const slicedData =
    mode === "datatable"
      ? sortedData.slice(
          state.page * state.rowsPerPage,
          state.page * state.rowsPerPage + state.rowsPerPage
        )
      : sortedData

  const hasExpandableContent = !!ExpandableContentComponent && data.length > 0

  const handleExport = () => {
    exportToExcel(sortedData, exportColumns, exportFileName)
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingTop: showSearch && 3
      }}
    >
      {showSearch && (
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginInline: 3,
            marginBottom: 3,
            gap: 3
          }}
        >
          <TableSearch
            onSearch={handleSearchChange}
            onExport={handleExport}
            disableExport={exportColumns.length === 0}
            disableMoreOptions={filteredData.length === 0}
          />
        </Stack>
      )}
      {hasSelectedRows && (
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "var(--elevation-level5)",
            height: 64,
            width: "100%",
            position: "absolute",
            zIndex: 3
          }}
        >
          <Box padding="checkbox" sx={{ paddingLeft: 2, border: "none" }}>
            <Checkbox
              indeterminate={state.selected.size > 0 && state.selected.size < data.length}
              checked={data.length > 0 && state.selected.size === data.length}
              onChange={handleSelectAllClick}
            />
          </Box>
          <Box sx={{ border: "none", paddingLeft: 3 }}>
            <Typography variant="body2" component="p" sx={{ fontWeight: 600 }}>
              {formatNumber(selectedCount)} {getSelectedText(selectedCount)}
            </Typography>
          </Box>
          {actions && (
            <Box
              padding="checkbox"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 1,
                border: "none",
                marginLeft: "auto",
                marginRight: 2
              }}
            >
              {actions.map((action, index) => (
                <Tooltip key={index} title={action.title}>
                  <IconButton onClick={() => handleActionClick(action)}>{action.icon}</IconButton>
                </Tooltip>
              ))}
            </Box>
          )}
        </Stack>
      )}
      <TableContainer component={Box}>
        <MuiTable
          sx={{
            width: "100%",
            minWidth: 650,
            color: "var(--onSurface)",
            "& .MuiTableCell-head": {
              color: "var(--outline)",
              backgroundColor: "var(--elevation-level3) !important"
            },
            "& .MuiTableCell-root": {
              borderColor: "var(--elevation-level5)",
              fontWeight: 500
            },
            "& .MuiTableBody-root > .MuiTableRow-root:last-child > .MuiTableCell-root": {
              border: "none"
            }
          }}
          aria-label="table"
        >
          <TableHead
            sx={{
              "& .MuiTableCell-root": {
                border: "none"
              }
            }}
          >
            <TableRow sx={{ height: 64 }}>
              {mode === "datatable" && data.length !== 0 && (
                <TableCell padding="checkbox" sx={{ paddingLeft: 2 }}>
                  <Checkbox
                    indeterminate={state.selected.size > 0 && state.selected.size < data.length}
                    checked={data.length > 0 && state.selected.size === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {hasExpandableContent && <TableCell padding="checkbox" />}
              {columns.map((column) => {
                if (column.visible === false) return null
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sortDirection={state.orderBy === column.id ? state.order : false}
                    sx={{ padding: "16px 24px", fontSize: 13, textWrap: "nowrap !important" }}
                    padding={column.disablePadding ? "checkbox" : "normal"}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={state.orderBy === column.id}
                        direction={state.orderBy === column.id ? state.order : "asc"}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length !== 0 ? (
              <>
                {slicedData.map((row, index) => (
                  <React.Fragment key={row.id ? row.id : index}>
                    <TableRow
                      sx={{
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor:
                            dataTheme === "dark" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.02)"
                        },
                        "& .MuiTableCell-root": {
                          border: sortedData.length - 1 === index && "none"
                        }
                      }}
                      role={mode === "datatable" ? "checkbox" : "row"}
                      aria-checked={mode === "datatable" && isSelected(row.id)}
                      tabIndex={mode === "datatable" ? -1 : undefined}
                      selected={mode === "datatable" && isSelected(row.id)}
                    >
                      {mode === "datatable" && (
                        <TableCell padding="checkbox" sx={{ paddingLeft: 2 }}>
                          <Checkbox
                            color="primary"
                            checked={isSelected(row.id)}
                            onChange={(event) => handleClick(event, row)}
                          />
                        </TableCell>
                      )}
                      {hasExpandableContent && (
                        <TableCell sx={{ width: 0 }}>
                          <Tooltip title={state.openRows.has(row.id) ? "Diminuir" : "Expandir"}>
                            <IconButton size="small" onClick={() => handleRowClick(row.id)}>
                              <KeyboardArrowUp
                                className={`arrow-but-drop-down ${
                                  state.openRows.has(row.id) && "__arrow-but-drop-down__rotate"
                                }`}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        if (column.visible === false) return null
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              color: "var(--onSurface)",
                              padding: "16px 24px",
                              fontSize: 13
                            }}
                            padding={column.disablePadding ? "checkbox" : "normal"}
                          >
                            {column.renderComponent ? (
                              <column.renderComponent row={row} />
                            ) : (
                              <>
                                {column.formatter
                                  ? column.formatter(getNestedValue(row, column.id))
                                  : getNestedValue(row, column.id)}
                              </>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    {hasExpandableContent && (
                      <TableRow key={`${row.id}-expandable`}>
                        <TableCell
                          colSpan={mode === "normal" ? columns.length + 1 : columns.length + 2}
                          sx={{ padding: 0, border: "none" }}
                        >
                          <Collapse in={state.openRows.has(row.id)} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                color: "var(--onSurface)",
                                borderBottom:
                                  sortedData.length - 1 === index
                                    ? "none"
                                    : "1px solid var(--elevation-level5)",
                                borderTop:
                                  sortedData.length - 1 !== index
                                    ? "none"
                                    : "1px solid var(--elevation-level5)"
                              }}
                            >
                              <ExpandableContentComponent row={row} />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={mode === "normal" ? columns.length + 1 : columns.length + 2}
                  sx={{ padding: 3 }}
                >
                  <NoData error={error} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {mode === "datatable" && data.length !== 0 && (
        <Grid
          container
          rowGap={1}
          sx={{
            padding: 2,
            paddingBottom: 2,
            borderTop: "1px solid var(--elevation-level5)"
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Typography variant="p" component="p" sx={{ paddingLeft: 1 }}>
              <b>{formatNumber(sortedData.length)}</b> {getDataCountText(sortedData.length)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <TablePagination
              labelRowsPerPage="Itens por página"
              labelDisplayedRows={({ from, to, count }) => {
                return `${formatNumber(from)}–${formatNumber(to)} de ${
                  count !== -1 ? formatNumber(count) : `mais do que ${formatNumber(to)}`
                }`
              }}
              rowsPerPageOptions={state.rowsPerPageOptions}
              component="div"
              count={sortedData.length}
              rowsPerPage={state.rowsPerPage}
              page={state.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              showLastButton
              showFirstButton
              sx={
                isSmallScreen
                  ? {
                      "& .MuiTablePagination-selectLabel": { display: "none" },
                      "& .MuiTablePagination-displayedRows": { display: "none" },
                      "& .MuiInputBase-root": { marginLeft: 0, marginRight: 1 },
                      "& .MuiToolbar-root": {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0
                      },
                      "& .MuiTablePagination-actions": { margin: 0 }
                    }
                  : {
                      "& .MuiToolbar-root": { padding: 0 }
                    }
              }
              slotProps={{
                select: {
                  IconComponent: KeyboardArrowDown,
                  MenuProps: {
                    sx: {
                      "& .MuiPaper-root": {
                        padding: "8px"
                      },
                      "& .MuiPaper-root .MuiList-root": {
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        padding: 0
                      },
                      "& .MuiPaper-root .MuiList-root .MuiButtonBase-root": {
                        borderRadius: 2,
                        fontSize: 13
                      },
                      "& .MuiPaper-root .MuiList-root .MuiButtonBase-root:hover": {
                        backgroundColor: "var(--secondaryContainer)"
                      }
                    }
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      )}
      {error && (
        <FormHelperText error={error} sx={{ marginLeft: 3, marginTop: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      align: PropTypes.oneOf(["left", "right", "center"]),
      disablePadding: PropTypes.bool,
      sortable: PropTypes.bool,
      visible: PropTypes.bool,
      formatter: PropTypes.func,
      renderComponent: PropTypes.elementType
    })
  ).isRequired,
  exportFileName: PropTypes.string,
  exportColumns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      formatter: PropTypes.func,
      color: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    })
  ),
  data: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(["normal", "datatable"]),
  actions: function (props, propName, componentName) {
    if (props.mode === "datatable" && props[propName]) {
      if (!Array.isArray(props[propName])) {
        return new Error(
          `Invalid prop ${propName} supplied to ${componentName}. Expected an array.`
        )
      }
      for (let action of props[propName]) {
        if (
          !action.icon ||
          typeof action.icon !== "object" ||
          !action.title ||
          typeof action.title !== "string" ||
          !action.onClick ||
          typeof action.onClick !== "function"
        ) {
          return new Error(
            `Invalid action object supplied to ${componentName}. Each action object must have keys 'icon' (a React element), 'title' (a string), and 'onClick' (a function).`
          )
        }
      }
    }
  },
  error: PropTypes.string,
  helperText: PropTypes.string,
  showSearch: PropTypes.bool,
  ExpandableContentComponent: PropTypes.elementType
}

export default Table
