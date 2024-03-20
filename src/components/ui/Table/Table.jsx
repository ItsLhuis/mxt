import PropTypes from "prop-types"

import React, { useState } from "react"

import {
  Box,
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
  Checkbox
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const Table = ({ columns, data, mode }) => {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("")

  const [openRows, setOpenRows] = useState([])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selected, setSelected] = useState([])

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

  const isSelected = (id) => selected.indexOf(id) !== -1

  const sortedData = stableSort(data, getComparator(order, orderBy))
  const hasExpandableContent = data.some((item) => item.expandableContent)

  return (
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
                  color="primary"
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
                      <Box sx={{ borderBottom: "1px solid var(--elevation-level5)" }}>
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
      {mode === "datatable" && (
        <TablePagination
          labelRowsPerPage="Linhas por página"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ margin: 2 }}
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
      )}
    </TableContainer>
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
  mode: PropTypes.oneOf(["normal", "datatable"])
}

export default Table
