import PropTypes from "prop-types"

import React from "react"

import { Stack, Typography } from "@mui/material"

const HeaderSection = ({ title, description, icon }) => {
  return (
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        padding: 3,
        paddingBottom: 1
      }}
    >
      {icon}
      <Stack sx={{ gap: 0.4 }}>
        <Typography variant="h5" component="h5">
          {title}
        </Typography>
        <Typography variant="p" component="p" color="var(--outline)">
          {description}
        </Typography>
      </Stack>
    </Stack>
  )
}

HeaderSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.node
}

export default HeaderSection
