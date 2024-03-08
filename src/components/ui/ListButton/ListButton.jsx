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

export default ListButton
