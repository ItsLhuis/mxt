import PropTypes from "prop-types"

import React, { useState } from "react"

import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Checkbox
} from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

const ITEM_HEIGHT = 50
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5
    }
  }
}

const MultipleSelectCheckmarks = ({ label, data, selectedItems, onChange }) => {
  const [open, setOpen] = useState(false)

  const handleChange = (event) => {
    const {
      target: { value }
    } = event
    onChange(value)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="multiple-checkbox-label">{label}</InputLabel>
      <Select
        labelId="multiple-checkbox-label"
        id="multiple-checkbox"
        multiple
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={selectedItems}
        onChange={handleChange}
        input={
          <OutlinedInput
            label={label}
            sx={{
              fontSize: "13px"
            }}
          />
        }
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
        IconComponent={(props) => (
          <KeyboardArrowDown {...props} sx={{ color: "var(--onSurface) !important" }} />
        )}
      >
        {data.map((item, index) => (
          <MenuItem
            key={item}
            value={item}
            sx={{
              margin: "0 8px",
              marginBottom: index !== data.length - 1 && "4px",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "var(--secondaryContainer)"
              }
            }}
          >
            <Checkbox checked={selectedItems.indexOf(item) > -1} sx={{ marginLeft: -1 }} />
            <Typography
              variant="p"
              component="p"
              sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
            >
              {item}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

MultipleSelectCheckmarks.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default MultipleSelectCheckmarks
