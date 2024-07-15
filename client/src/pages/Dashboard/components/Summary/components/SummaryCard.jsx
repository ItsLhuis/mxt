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

import { Caption } from "@components/ui"
import { BasicLineChart } from "@components/ui/Charts"

import { motion } from "framer-motion"

const MetricSkeleton = () => {
  return (
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
}

const SummaryCard = ({ icon, title, metricQuery, chartQuery, colorLine, mdSize }) => {
  return (
    <Grid item xs={12} md={mdSize} lg={4}>
      <Paper elevation={1}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1.3,
              padding: 3
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 1.5,
                borderRadius: 2,
                backgroundColor: "var(--elevation-level3)"
              }}
            >
              {icon}
            </Box>
            <Typography variant="p" component="p" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {metricQuery.isLoading ? (
              <MetricSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "10.4px"
                }}
              >
                <Typography variant="h3" component="h3">
                  {metricQuery?.data.total}
                </Typography>
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={metricQuery?.data.change}
                    color={metricQuery?.data.color}
                    sx={{ marginTop: "auto" }}
                  />
                  <Caption title="Em comparação com o mês anterior" />
                </Stack>
              </motion.div>
            )}
          </Box>
          <Box
            sx={{
              width: "100%",
              marginRight: 3,
              display: chartQuery.isLoading && "flex",
              justifyContent: "center"
            }}
          >
            {chartQuery.isLoading ? (
              <CircularProgress />
            ) : (
              <BasicLineChart
                colorLine={colorLine}
                xData={chartQuery?.data.xData}
                yData={[{ name: title, data: chartQuery?.data.yData }]}
              />
            )}
          </Box>
        </Box>
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
      total: PropTypes.number.isRequired,
      change: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  }).isRequired,
  chartQuery: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      xData: PropTypes.arrayOf(PropTypes.string.isRequired),
      yData: PropTypes.arrayOf(PropTypes.number.isRequired)
    })
  }).isRequired,
  colorLine: PropTypes.string.isRequired,
  mdSize: PropTypes.number.isRequired
}

export default SummaryCard
