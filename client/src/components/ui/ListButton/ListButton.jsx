import PropTypes from "prop-types"

import React from "react"

import { List, ListItem, Divider, Button, Typography, Stack } from "@mui/material"

const ListButton = ({ buttons, onClose }) => {
  return (
    <List sx={{ display: "flex", flexDirection: "column", minWidth: "90px", gap: 0.5 }}>
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          {button.divider && (
            <Divider
              sx={{
                marginBottom: 0.5,
                marginTop: 0.5,
                borderColor: "var(--elevation-level5)",
                borderWidth: 1
              }}
            />
          )}
          <ListItem key={index} disablePadding>
            <Button
              color={button.color}
              onClick={() => {
                button.onClick()
                onClose()
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                margin: "0 8px !important",
                padding: "8px 14px !important",
                paddingLeft: button.icon && "8px !important",
                width: "100%",
                color: button.color ?? "inherit",
                marginBottom: index !== buttons.length - 1 && "4px",
                backgroundColor: button.selected && "rgba(88, 101, 242, 0.08)",
                minHeight: "unset !important",
                "&:hover": {
                  backgroundColor: button.selected
                    ? "rgba(88, 101, 242, 0.12) !important"
                    : button.color ?? "var(--secondaryContainer)"
                }
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  gap: 1
                }}
              >
                {button.icon}
                <Typography variant="p" component="p" sx={{ fontWeight: 400 }}>
                  {button.label}
                </Typography>
              </Stack>
            </Button>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  )
}

ListButton.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      onClick: PropTypes.func.isRequired,
      selected: PropTypes.bool,
      divider: PropTypes.bool
    })
  ).isRequired,
  onClose: PropTypes.func
}

export default ListButton
