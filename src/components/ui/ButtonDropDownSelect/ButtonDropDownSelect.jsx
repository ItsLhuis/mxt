import PropTypes from "prop-types"

import React, { useState } from "react"

import { ButtonBase, Box, ListItemText, Typography, Popover } from "@mui/material"
import { KeyboardArrowUp } from "@mui/icons-material"

const ButtonDropDownSelect = ({
  title,
  subTitle,
  description,
  mode = "normal",
  customButton,
  children
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "button-drop-down-select-popover" : undefined

  return (
    <>
      {mode === "normal" ? (
        <ButtonBase
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "8px 14px",
            paddingRight: "8px",
            width: "100%",
            bgcolor: "var(--elevation-level3)",
            borderRadius: 2,
            "&:hover": {
              bgcolor: "var(--elevation-level5)"
            }
          }}
          onClick={handleClick}
        >
          <Box display="flex" alignItems="center" gap="8px">
            {title && (
              <Typography variant="body3" textAlign="left" fontWeight={500}>
                {title}
              </Typography>
            )}
            <KeyboardArrowUp
              className={`arrow-but-drop-down ${open && "__arrow-but-drop-down__rotate"}`}
            />
          </Box>
        </ButtonBase>
      ) : (
        <>
          {mode === "advanced" ? (
            <ButtonBase
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: 2,
                width: "100%",
                bgcolor: "var(--elevation-level3)",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "var(--elevation-level5)"
                }
              }}
              onClick={handleClick}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 2
                }}
              >
                <ListItemText>
                  <Typography variant="h6" component="h6" textAlign="left">
                    {title}
                  </Typography>
                  {subTitle && (
                    <Typography
                      variant="p"
                      component="p"
                      textAlign="left"
                      color="var(--outline)"
                      fontSize="13px"
                    >
                      {subTitle}
                    </Typography>
                  )}
                </ListItemText>
                <Box display="flex" alignItems="center" gap="8px">
                  {description && (
                    <Typography
                      variant="body3"
                      textAlign="left"
                      color="var(--outline)"
                      fontWeight={500}
                    >
                      {description}
                    </Typography>
                  )}
                  <KeyboardArrowUp
                    className={`arrow-but-drop-down ${open && "__arrow-but-drop-down__rotate"}`}
                  />
                </Box>
              </Box>
            </ButtonBase>
          ) : (
            <>{mode === "custom" && <Box onClick={handleClick}>{customButton}</Box>}</>
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
        {children}
      </Popover>
    </>
  )
}

ButtonDropDownSelect.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  mode: PropTypes.oneOf(["normal", "advanced", "custom"]),
  customButton: function (props, propName, componentName) {
    if (props.mode === "custom" && !props[propName]) {
      return new Error(
        `The prop '${propName}' is marked as required in '${componentName}' but its value is 'undefined'.`
      )
    }
    return null
  },
  children: PropTypes.node.isRequired
}

export default ButtonDropDownSelect
