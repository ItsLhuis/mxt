import PropTypes from "prop-types"

import React, { useState } from "react"

import { Button, Box, Typography, Popover, Stack } from "@mui/material"
import { KeyboardArrowUp } from "@mui/icons-material"

const ButtonDropDownSelect = ({
  title,
  subTitle,
  description,
  mode = "normal",
  customButton,
  disabled,
  children
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    if (disabled) return
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "button-drop-down-select-popover" : undefined

  return (
    <Box>
      {mode === "normal" ? (
        <Button
          variant="contained"
          color="secondary"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "8px 14px !important",
            paddingRight: "8px !important",
            minHeight: "40px !important",
            borderRadius: 2,
            color: "var(--onSurface)"
          }}
          onClick={handleClick}
          disabled={disabled}
        >
          <Stack
            sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
            gap={1}
          >
            {title && (
              <Typography
                variant="p"
                component="p"
                sx={{ textAlign: "left", whiteSpace: "nowrap", paddingTop: 0.3 }}
              >
                {title}
              </Typography>
            )}
            <KeyboardArrowUp
              className={`arrow-but-drop-down ${open && "__arrow-but-drop-down__rotate"}`}
            />
          </Stack>
        </Button>
      ) : (
        <>
          {mode === "advanced" ? (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
                borderRadius: 2,
                color: "var(--onSurface)"
              }}
              onClick={handleClick}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 2,
                  padding: 1
                }}
              >
                <Stack>
                  <Typography variant="h5" component="h5" textAlign="left">
                    {title}
                  </Typography>
                  {subTitle && (
                    <Typography
                      variant="p"
                      component="p"
                      sx={{ textAlign: "left", color: "var(--outline)", fontWeight: 400 }}
                    >
                      {subTitle}
                    </Typography>
                  )}
                </Stack>
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {description && (
                    <Typography
                      variant="p"
                      component="p"
                      sx={{ textAlign: "left", color: "var(--outline)", fontWeight: 500 }}
                    >
                      {description}
                    </Typography>
                  )}
                  <KeyboardArrowUp
                    className={`arrow-but-drop-down ${open && "__arrow-but-drop-down__rotate"}`}
                  />
                </Stack>
              </Stack>
            </Button>
          ) : (
            <>{mode === "custom" && <div onClick={handleClick}>{customButton}</div>}</>
          )}
        </>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onClose: handleClose })
        )}
      </Popover>
    </Box>
  )
}

ButtonDropDownSelect.propTypes = {
  title: function (props, propName, componentName) {
    if (props.mode !== "custom" && !props[propName]) {
      return new Error(
        `The prop '${propName}' is required when mode is not 'custom' in '${componentName}'.`
      )
    }
    return null
  },
  subTitle: PropTypes.string,
  description: PropTypes.string,
  mode: PropTypes.oneOf(["normal", "advanced", "custom"]),
  customButton: function (props, propName, componentName) {
    if (props.mode === "custom" && !props[propName]) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. customButton can only be provided when mode is 'custom'.`
      )
    }
    return null
  },
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired
}

export default ButtonDropDownSelect
