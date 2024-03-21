import PropTypes from "prop-types"

import React, { useState, useEffect } from "react"

import {
  Box,
  Typography,
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
  Stack
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
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

const Table = ({ columns, data, mode, actions }) => {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("")

  const [openRows, setOpenRows] = useState([])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([])
  const [selected, setSelected] = useState([])

  useEffect(() => {
    const defaultOptions = [5, 10, 15, 25, 50, 100]

    if (data.length <= defaultOptions[defaultOptions.length - 1]) {
      const filteredOptions = defaultOptions.filter((option) => option <= data.length)
      setRowsPerPageOptions(filteredOptions)
    } else {
      setRowsPerPageOptions(defaultOptions)
    }
  }, [data])

  const getSelectedText = (selected) => {
    if (selected === 1) {
      return "item selecionado"
    } else {
      return "itens selecionados"
    }
  }

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(columnId)
  }

  const handleRowClick = (rowId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(rowId)
        ? prevOpenRows.filter((id) => id !== rowId)
        : [...prevOpenRows, rowId]
    )
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const hasSelectedRows = selected.length > 0
  const isSelected = (id) => selected.indexOf(id) !== -1

  const sortedData = stableSort(data, getComparator(order, orderBy))
  const hasExpandableContent = data.some((item) => item.expandableContent)

  return (
    <Box sx={{ position: "relative" }}>
      {mode === "datatable" && (
        <Typography variant="p" component="p" sx={{ marginLeft: 3, marginBottom: 3 }}>
          <b>{data.length}</b> resultados encontrados
        </Typography>
      )}
      {hasSelectedRows && (
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "var(--primary)",
            height: 57,
            width: "100%",
            position: "absolute",
            zIndex: 1
          }}
        >
          <Box padding="checkbox" sx={{ paddingLeft: 2, border: "none" }}>
            <Checkbox
              indeterminate={selected.length > 0 && selected.length < data.length}
              checked={data.length > 0 && selected.length === data.length}
              onChange={handleSelectAllClick}
              sx={{
                "& .MuiSvgIcon-root": {
                  color: "rgb(228, 225, 230)"
                }
              }}
            />
          </Box>
          <Box sx={{ border: "none", paddingLeft: 4 }}>
            <Typography
              variant="body2"
              component="p"
              sx={{ fontWeight: 600, color: "rgb(228, 225, 230)" }}
            >
              {selected.length} {getSelectedText(selected.length)}
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
                <Tooltip key={index} title={action.tooltip} placement="bottom">
                  <IconButton
                    onClick={() => action.onClick()}
                    sx={{
                      "&:hover": {
                        backgroundColor: "transparent !important"
                      }
                    }}
                  >
                    {action.icon}
                  </IconButton>
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
              color: "var(--outline)"
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
          <TableHead sx={{ backgroundColor: "var(--elevation-level3)" }}>
            <TableRow>
              {mode === "datatable" && (
                <TableCell padding="checkbox" sx={{ paddingLeft: 2 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {hasExpandableContent && <TableCell padding="checkbox" />}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{ padding: "16px 24px", fontSize: 13 }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(mode === "datatable"
              ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedData
            ).map((row, index) => (
              <React.Fragment key={row.id}>
                <TableRow
                  sx={{
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)"
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
                        onChange={(event) => handleClick(event, row.id)}
                      />
                    </TableCell>
                  )}
                  {hasExpandableContent && (
                    <>
                      {row.expandableContent ? (
                        <TableCell sx={{ width: 0 }}>
                          <IconButton size="small" onClick={() => handleRowClick(row.id)}>
                            <KeyboardArrowUp
                              className={`arrow-but-drop-down ${
                                openRows.includes(row.id) && "__arrow-but-drop-down__rotate"
                              }`}
                            />
                          </IconButton>
                        </TableCell>
                      ) : (
                        <TableCell />
                      )}
                    </>
                  )}
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        color: "var(--onSurface)",
                        padding: "16px 24px",
                        fontSize: 13
                      }}
                    >
                      {column.renderComponent ? (
                        <column.renderComponent data={row[column.id]} />
                      ) : (
                        <>{column.formatter ? column.formatter(row[column.id]) : row[column.id]}</>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.expandableContent && (
                  <TableRow>
                    <TableCell
                      colSpan={mode === "normal" ? columns.length + 1 : columns.length + 2}
                      sx={{ padding: 0, border: "none" }}
                    >
                      <Collapse in={openRows.includes(row.id)} timeout="auto" unmountOnExit>
                        <Box
                          sx={{
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
                          {row.expandableContent()}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {mode === "datatable" && (
        <Box sx={{ padding: 2, borderTop: "1px solid var(--elevation-level5)" }}>
          <TablePagination
            labelRowsPerPage="Linhas por página"
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}–${to} de ${count !== -1 ? count : `mais do que ${to}`}`
            }}
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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
                      bgcolor: "var(--elevation-level5)"
                    }
                  }
                }
              }
            }}
          />
        </Box>
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
      formatter: PropTypes.func,
      renderComponent: PropTypes.elementType
    })
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      expandableContent: PropTypes.func
    })
  ).isRequired,
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
          !action.tooltip ||
          typeof action.tooltip !== "string" ||
          !action.onClick ||
          typeof action.onClick !== "function"
        ) {
          return new Error(
            `Invalid action object supplied to ${componentName}. Each action object must have keys 'icon' (a React element), 'tooltip' (a string), and 'onClick' (a function).`
          )
        }
      }
    }
  }
}

export default Table
