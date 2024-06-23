import PropTypes from "prop-types"

import React from "react"

import { Link } from "react-router-dom"
import { Box, Typography, Breadcrumbs, Button } from "@mui/material"
import { Home } from "@mui/icons-material"

const HeaderPage = ({ title, breadcrumbs, button }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 3
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h4" component="h4">
          {title}
        </Typography>
        <Breadcrumbs
          separator={
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "var(--outline)"
              }}
            />
          }
          aria-label="breadcrumb"
          sx={{ color: "var(--onSurface)", fontSize: 13 }}
        >
          <Home fontSize="small" />
          {breadcrumbs.map((breadcrumb, index) => (
            <Box key={index}>
              {breadcrumb.link ? (
                <Link to={breadcrumb.link}>{breadcrumb.name}</Link>
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
      {button && (
        <Button
          variant="contained"
          color="primary"
          startIcon={button.startIcon}
          onClick={button.onClick}
        >
          {button.title}
        </Button>
      )}
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
  ).isRequired,
  button: PropTypes.shape({
    startIcon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })
}

export default HeaderPage
