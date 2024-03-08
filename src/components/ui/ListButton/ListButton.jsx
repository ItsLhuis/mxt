import PropTypes from "prop-types"

import React from "react"

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material"

const ListButton = ({ buttons }) => {
  return (
    <List sx={{ minWidth: "90px" }}>
      {buttons.map((button, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={button.action}>
            <ListItemText primary={button.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

ListButton.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired
    })
  ).isRequired
}

export default ListButton
