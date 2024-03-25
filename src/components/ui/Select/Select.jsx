import PropTypes from "prop-types"

import React from "react"

import { FormControl, Select as MuiSelect, InputLabel, MenuItem, Typography } from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

const Select = ({ label, data, value, size, shrink, onChange }) => {
  const handleChange = (event) => {
    const value = event.target.value
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="status-select-label" size={size} shrink={shrink}>
        {label}
      </InputLabel>
      <MuiSelect
        labelId="status-select-label"
        id="status-select"
        label={label + "o"}
        value={value}
        onChange={handleChange}
        sx={{ fontSize: 13 }}
        IconComponent={(props) => (
          <KeyboardArrowDown {...props} sx={{ color: "var(--onSurface) !important" }} />
        )}
        size={size}
      >
        {data.map((item, index) => (
          <MenuItem
            key={item}
            value={item}
            sx={{
              padding: "10px 16px",
              margin: "0 8px",
              marginBottom: index !== data.length - 1 && "4px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "var(--secondaryContainer)"
              }
            }}
          >
            <Typography
              variant="p"
              component="p"
              sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
            >
              {item}
            </Typography>
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onChange: PropTypes.func.isRequired
}

export default Select
