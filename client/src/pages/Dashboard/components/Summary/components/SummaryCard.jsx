import PropTypes from "prop-types"

import React from "react"

import {
  Grid,
  Paper,
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Skeleton
} from "@mui/material"

import { Loadable, Caption } from "@components/ui"

import { BasicLineChart } from "@components/ui/Charts"

const MetricSkeleton = () => (
  <Stack sx={{ gap: 1.3 }}>
    <Typography variant="h3" component="h3">
      <Skeleton width={60} />
    </Typography>
    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
      <Skeleton variant="rounded" width={70} height={32} sx={{ borderRadius: 2 }} />
      <Skeleton variant="circular" width={17} height={17} />
    </Stack>
  </Stack>
)

const SummaryCard = ({ icon, title, metricQuery, chartQuery, colorLine, mdSize, lgSize }) => {
  return (
    <Grid item xs={12} md={mdSize} lg={lgSize}>
      <Paper elevation={1}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
          <Stack
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
              padding: 3
            }}
          >
            <Stack
              sx={{
                justifyContent: "center",
                alignItems: "center",
                padding: 1.5,
                borderRadius: 2,
                backgroundColor: "var(--elevation-level3)"
              }}
            >
              {icon}
            </Stack>
            <Typography variant="p" component="p" sx={{ fontWeight: 600, marginTop: 1 }}>
              {title}
            </Typography>
            <Loadable
              isLoading={metricQuery.isLoading}
              LoadingComponent={<MetricSkeleton />}
              LoadedComponent={
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1.5
                  }}
                >
                  <Typography variant="h3" component="h3">
                    {metricQuery.data.total}
                  </Typography>
                  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={metricQuery.data.percentage.change}
                      color={metricQuery.data.percentage.color}
                      sx={{ marginTop: "auto" }}
                    />
                    <Caption title="Comparação entre os dois últimos meses completos" />
                  </Stack>
                </Stack>
              }
            />
          </Stack>
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: 165,
              width: "100%",
              marginRight: 3
            }}
          >
            <Loadable
              isLoading={chartQuery.isLoading}
              LoadingComponent={<CircularProgress />}
              LoadedComponent={
                <BasicLineChart
                  colorLine={colorLine}
                  xData={chartQuery.data.xData}
                  yData={[{ name: title, data: chartQuery.data.yData }]}
                />
              }
              style={{ width: "100%", height: "100%" }}
            />
          </Stack>
        </Stack>
      </Paper>
    </Grid>
  )
}

SummaryCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  metricQuery: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      percentage: PropTypes.shape({
        change: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  chartQuery: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      xData: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      yData: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    }).isRequired
  }).isRequired,
  colorLine: PropTypes.string.isRequired,
  mdSize: PropTypes.number,
  lgSize: PropTypes.number
}

export default SummaryCard
