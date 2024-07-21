import PropTypes from "prop-types"

import React from "react"

import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Checkbox,
  FormHelperText
} from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

const MultipleSelectCheckmarks = ({ label, error, helperText, data, selectedIds, onChange }) => {
  const handleChange = (event) => {
    const {
      target: { value }
    } = event
    onChange(value)
  }

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="multiple-checkbox-label" error={error}>
        {label}
      </InputLabel>
      <Select
        labelId="multiple-checkbox-label"
        id="multiple-checkbox"
        multiple
        value={selectedIds}
        onChange={handleChange}
        label={label}
        sx={{ fontSize: 13 }}
        renderValue={(selected) =>
          selected.map((id) => data.find((item) => item.id === id)?.name || "").join(", ")
        }
        IconComponent={(props) => (
          <KeyboardArrowDown {...props} sx={{ color: "var(--onSurface) !important" }} />
        )}
        error={error}
      >
        {data.map((item, index) => (
          <MenuItem
            key={item.id}
            value={item.id}
            sx={{
              padding: "4px 14px",
              margin: "0 8px",
              marginBottom: index !== data.length - 1 && "4px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "var(--secondaryContainer)"
              }
            }}
          >
            <Checkbox checked={selectedIds.indexOf(item.id) > -1} sx={{ marginLeft: -1 }} />
            <Typography
              variant="p"
              component="p"
              sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
            >
              {item.name}
            </Typography>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  )
}

MultipleSelectCheckmarks.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
    .isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string
}

export default MultipleSelectCheckmarks
