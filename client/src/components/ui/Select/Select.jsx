import PropTypes from "prop-types"

import React, { forwardRef } from "react"

import {
  FormControl,
  FormHelperText,
  Select as MuiSelect,
  InputLabel,
  MenuItem,
  Typography,
  Divider
} from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

const Select = forwardRef(
  ({ label, data, value, size, shrink, error, helperText, onChange, ...props }, ref) => {
    const handleChange = (event) => {
      const value = event.target.value
      if (onChange) {
        onChange(value)
      }
    }

    return (
      <FormControl fullWidth error={error}>
        <InputLabel id="status-select-label" size={size} shrink={shrink} error={error}>
          {label}
        </InputLabel>
        <MuiSelect
          labelId="select-label"
          id="select"
          label={label + "o"}
          value={value}
          onChange={handleChange}
          ref={ref}
          sx={{ fontSize: 13 }}
          IconComponent={(props) => (
            <KeyboardArrowDown {...props} sx={{ color: "var(--onSurface) !important" }} />
          )}
          size={size}
          error={error}
          {...props}
        >
          {data.map((item, index) => [
            <MenuItem
              key={item === "" ? "none" : item}
              value={item === "" ? "" : item}
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
                {item === "" ? "Nenhum" : item}
              </Typography>
            </MenuItem>,
            item === "" && (
              <Divider
                key={`divider-${index}`}
                sx={{
                  borderColor: "var(--elevation-level5)",
                  borderWidth: 1
                }}
              />
            )
          ])}
        </MuiSelect>
        {helperText && (
          <FormHelperText sx={{ color: error && "rgb(211, 47, 47)" }}>{helperText}</FormHelperText>
        )}
      </FormControl>
    )
  }
)

Select.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string
}

export default Select
