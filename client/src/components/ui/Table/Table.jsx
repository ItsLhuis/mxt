import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { produce } from "immer"

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
  Stack
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"

import { NoData } from "../"

import { formatNumber } from "@utils/format/number"

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

const getSelectedText = (selectedSize) => {
  return selectedSize === 1 ? "item selecionado" : "itens selecionados"
}

const getDataCountText = (dataSize) => {
  return dataSize === 1 ? "resultado encontrado" : "resultados encontrados"
}

const Table = ({ columns, data, mode, actions, error, helperText, ExpandableContentComponent }) => {
  const tableRef = useRef(null)
  const [tableHeadHeight, setTableHeadHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (tableRef.current) {
        const tableHead = tableRef.current.querySelector("thead")
        if (tableHead) {
          setTableHeadHeight(tableHead.getBoundingClientRect().height)
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [tableRef.current])

  const [state, setState] = useState({
    order: "asc",
    orderBy: "",
    openRows: new Set(),
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [],
    selected: new Set()
  })

  useEffect(() => {
    const tableHead = tableRef.current.querySelector("thead")
    if (tableHead) {
      setTableHeadHeight(tableHead.getBoundingClientRect().height)
    }

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

  const hasSelectedRows = state.selected.size > 0
  const isSelected = (id) => state.selected.has(id)

  const sortedData = stableSort(data, getComparator(state.order, state.orderBy))
  const slicedData =
    mode === "datatable"
      ? sortedData.slice(
          state.page * state.rowsPerPage,
          state.page * state.rowsPerPage + state.rowsPerPage
        )
      : sortedData
  const hasExpandableContent = !!ExpandableContentComponent && data.length > 0

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%"
      }}
    >
      {mode === "datatable" && (
        <Typography variant="p" component="p" sx={{ marginLeft: 3, marginBottom: 3 }}>
          <b>{formatNumber(data.length)}</b> {getDataCountText(data.length)}
        </Typography>
      )}
      {hasSelectedRows && (
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "var(--elevation-level5)",
            height: tableHeadHeight,
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
              {formatNumber(state.selected.size)} {getSelectedText(state.selected.size)}
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
      <TableContainer ref={tableRef} component={Box}>
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
            <TableRow>
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
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={state.orderBy === column.id ? state.order : false}
                  sx={{ padding: "16px 24px", fontSize: 13 }}
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length !== 0 ? (
              <>
                {slicedData.map((row, index) => (
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
                            onChange={(event) => handleClick(event, row)}
                          />
                        </TableCell>
                      )}
                      {hasExpandableContent && (
                        <TableCell sx={{ width: 0 }}>
                          <Tooltip title="Expandir">
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
                      {columns.map((column) => (
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
                            <column.renderComponent row={row} />
                          ) : (
                            <>
                              {column.formatter ? column.formatter(row[column.id]) : row[column.id]}
                            </>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {hasExpandableContent && (
                      <TableRow>
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
                  sx={{ padding: 3, paddingBottom: 0 }}
                >
                  <NoData error={error} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {mode === "datatable" && data.length !== 0 && (
        <Box sx={{ padding: 2, paddingBottom: 0, borderTop: "1px solid var(--elevation-level5)" }}>
          <TablePagination
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) => {
              return `${formatNumber(from)}–${formatNumber(to)} de ${
                count !== -1 ? formatNumber(count) : `mais do que ${formatNumber(to)}`
              }`
            }}
            rowsPerPageOptions={state.rowsPerPageOptions}
            component="div"
            count={data.length}
            rowsPerPage={state.rowsPerPage}
            page={state.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showLastButton
            showFirstButton
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
        </Box>
      )}
      {error && (
        <FormHelperText sx={{ marginLeft: 3, marginTop: 1, color: error && "rgb(211, 47, 47)" }}>
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
  }
}

export default Table
