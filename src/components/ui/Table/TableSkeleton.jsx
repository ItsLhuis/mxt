import PropTypes from "prop-types"

import React from "react"

import { Stack, Skeleton } from "@mui/material"

const TableSkeleton = ({ mode }) => {
  return (
    <Stack sx={{ gap: 2, paddingInline: 3 }}>
      {mode === "datatable" && (
        <Stack sx={{ flexDirection: "row" }}>
          <Skeleton variant="text" sx={{ fontSize: 13 }} width={180} />
        </Stack>
      )}
      <Skeleton variant="rounded" height={30} />
      <Skeleton variant="rounded" height={30} />
      <Skeleton variant="rounded" height={30} />
      <Skeleton variant="rounded" height={30} />
      <Skeleton variant="rounded" height={30} />
      {mode === "datatable" && (
        <Stack
          sx={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 2 }}
        >
          <Skeleton variant="text" sx={{ fontSize: 13 }} width={150} />
          <Skeleton variant="text" sx={{ fontSize: 13 }} width={80} />
          <Skeleton variant="rounded" height={30} width={180} />
        </Stack>
      )}
    </Stack>
  )
}

TableSkeleton.propTypes = {
  mode: PropTypes.oneOf(["normal", "datatable"])
}

export default TableSkeleton
