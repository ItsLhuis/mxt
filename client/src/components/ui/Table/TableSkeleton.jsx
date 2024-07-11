import PropTypes from "prop-types"

import React from "react"

import { Stack, Grid, Skeleton } from "@mui/material"

const TableSkeleton = ({ mode }) => {
  return (
    <Stack sx={{ gap: 2, padding: 3 }}>
      <Skeleton variant="rounded" height={45} />
      <Skeleton variant="rounded" height={45} />
      <Skeleton variant="rounded" height={45} />
      <Skeleton variant="rounded" height={45} />
      <Skeleton variant="rounded" height={45} />
      <Skeleton variant="rounded" height={45} />
      {mode === "datatable" && (
        <Grid container sx={{ alignItems: "center" }}>
          <Grid item xs={12} md={6} lg={6}>
            <Skeleton variant="text" sx={{ fontSize: 13 }} width={180} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2
              }}
            >
              <Skeleton variant="text" sx={{ fontSize: 13 }} width={150} />
              <Skeleton variant="text" sx={{ fontSize: 13 }} width={80} />
              <Skeleton variant="rounded" height={30} width={180} />
            </Stack>
          </Grid>
        </Grid>
      )}
    </Stack>
  )
}

TableSkeleton.propTypes = {
  mode: PropTypes.oneOf(["normal", "datatable"])
}

export default TableSkeleton
