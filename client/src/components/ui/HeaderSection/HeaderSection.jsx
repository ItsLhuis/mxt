import PropTypes from "prop-types"

import React from "react"

import { Stack, Typography, Divider } from "@mui/material"

const HeaderSection = ({ title, description, icon }) => {
  return (
    <Stack>
      <Stack sx={{ gap: 0.4, padding: 3 }}>
        <Typography variant="h5" component="h5">
          {title}
        </Typography>
        <Typography variant="p" component="p" color="var(--outline)">
          {description}
        </Typography>
      </Stack>
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
    </Stack>
  )
}

HeaderSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
}

export default HeaderSection
