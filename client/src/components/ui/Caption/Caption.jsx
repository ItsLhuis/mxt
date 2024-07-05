import PropTypes from "prop-types"

import React from "react"

import { Tooltip, tooltipClasses } from "@mui/material"
import { Info } from "@mui/icons-material"

import { formatHTML } from "@utils/format/formatHTML"

const Caption = ({ fontSize, title, isHtml = false }) => {
  const renderTitle = () => {
    if (isHtml) {
      return <span dangerouslySetInnerHTML={formatHTML(title)} />
    }
    return title
  }

  return (
    <Tooltip
      title={renderTitle()}
      placement="right"
      slotProps={{
        popper: {
          className: isHtml && "MuiTooltip-popper-html",
          sx: {
            [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
              {
                marginLeft: "8px",
                maxHeight: "250px",
                overflow: "hidden",
                overflowY: "auto"
              }
          }
        }
      }}
    >
      <Info fontSize={fontSize} sx={{ color: "var(--outline)" }} />
    </Tooltip>
  )
}

Caption.propTypes = {
  size: PropTypes.string,
  title: PropTypes.string.isRequired,
  isHtml: PropTypes.bool
}

export default Caption
