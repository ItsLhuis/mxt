import PropTypes from "prop-types"

import React from "react"

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material"

const ListButton = ({ buttons }) => {
  return (
    <List sx={{ minWidth: "90px" }}>
      {buttons.map((button, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            onClick={button.onClick}
            sx={{ margin: "0 8px", marginBottom: index !== buttons.length - 1 && "4px" }}
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
      onClick: PropTypes.func.isRequired
    })
  ).isRequired
}

export default ListButton
