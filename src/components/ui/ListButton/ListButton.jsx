import PropTypes from "prop-types"

import React from "react"

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material"

const ListButton = ({ buttons, onClose }) => {
  return (
    <List sx={{ minWidth: "90px" }}>
      {buttons.map((button, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            onClick={() => {
              button.onClick()
              onClose()
            }}
            sx={{
              margin: "0 8px",
              marginBottom: index !== buttons.length - 1 && "4px",
              backgroundColor: button.selected && "rgba(88, 101, 242, 0.08)",
              "&:hover": {
                backgroundColor: button.selected && "rgba(88, 101, 242, 0.12) !important"
              }
            }}
          >
            <ListItemText primary={button.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

ListButton.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      selected: PropTypes.bool
    })
  ).isRequired,
  onClose: PropTypes.func
}

export default ListButton
