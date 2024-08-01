import PropTypes from "prop-types"

import React from "react"

import { Tooltip, tooltipClasses } from "@mui/material"
import { Info } from "@mui/icons-material"

import { formatHTML } from "@utils/format/formatHTML"

const Caption = ({ fontSize = "small", title }) => {
  const isHtml = typeof title === "string" && /<\/?[a-z][\s\S]*>/i.test(title)

  const renderTitle = () => {
    if (isHtml) {
      return <span dangerouslySetInnerHTML={formatHTML(title)} />
    }
    return title
  }

  return (
    <Tooltip
      title={renderTitle()}
      slotProps={{
        popper: {
          className: isHtml && "MuiTooltip-popper-html",
          sx: {
            [`&.${tooltipClasses.popper} .${tooltipClasses.tooltip}`]: {
              margin: "16px",
              maxHeight: "250px",
              maxWidth: "400px",
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
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
}

export default Caption
