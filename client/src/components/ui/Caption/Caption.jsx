import PropTypes from "prop-types"

import React from "react"

import { Tooltip, tooltipClasses } from "@mui/material"
import { Info } from "@mui/icons-material"

const Caption = ({ title }) => {
  return (
    <Tooltip
      title={title}
      placement="right"
      slotProps={{
        popper: {
          sx: {
            [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
              {
                marginLeft: "8px"
              }
          }
        }
      }}
    >
      <Info sx={{ color: "var(--outline)" }} />
    </Tooltip>
  )
}

Caption.propTypes = {
  title: PropTypes.string.isRequired
}

export default Caption
