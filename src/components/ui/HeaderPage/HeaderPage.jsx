import PropTypes from "prop-types"

import React from "react"

import { Box, Typography, Breadcrumbs, Link } from "@mui/material"
import { Home } from "@mui/icons-material"

const BreadcrumbsSeparator = () => (
  <Box
    sx={{
      width: 4,
      height: 4,
      borderRadius: "50%",
      backgroundColor: "var(--outline)"
    }}
  />
)

const HeaderPage = ({ title, breadcrumbs }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h4" component="h4">
        {title}
      </Typography>
      <Breadcrumbs
        separator={<BreadcrumbsSeparator />}
        aria-label="breadcrumb"
        sx={{ color: "var(--onSurface)", fontSize: 13 }}
      >
        <Home fontSize="small" />
        {breadcrumbs.map((breadcrumb, index) => (
          <Box key={index}>
            {breadcrumb.link ? (
              <Link underline="hover" href={breadcrumb.link} sx={{ color: "var(--onSurface)" }}>
                {breadcrumb.name}
              </Link>
            ) : (
              <Typography
                variant="p"
                component="p"
                sx={{ color: "var(--outline)", fontWeight: 500 }}
              >
                {breadcrumb.name}
              </Typography>
            )}
          </Box>
        ))}
      </Breadcrumbs>
    </Box>
  )
}

HeaderPage.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string
    })
  ).isRequired
}

export default HeaderPage
