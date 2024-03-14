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
  TableSortLabel
} from "@mui/material"

import { KeyboardArrowUp } from "@mui/icons-material"

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

const Table = ({ columns, data }) => {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("")
  const [openRows, setOpenRows] = useState([])

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

  const sortedData = stableSort(data, getComparator(order, orderBy))

  const hasExpandableContent = data.some((item) => item.expandableContent)

  return (
    <TableContainer component={Box}>
      <MuiTable
        sx={{
          minWidth: 650,
          color: "var(--onSurface)",
          "& .MuiTableSortLabel-root": {
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
            {hasExpandableContent && <TableCell sx={{ width: 0 }} />}
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
          {sortedData.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow
                onClick={() => handleRowClick(row.id)}
                sx={{
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)"
                  }
                }}
              >
                {hasExpandableContent && (
                  <>
                    {row.expandableContent ? (
                      <TableCell sx={{ width: 0 }}>
                        <IconButton size="small">
                          <KeyboardArrowUp
                            className={`arrow-but-drop-down icon ${
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
                  <TableCell colSpan={columns.length + 1} sx={{ padding: 0, border: "none" }}>
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
    </TableContainer>
  )
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
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
  ).isRequired
}

export default Table
