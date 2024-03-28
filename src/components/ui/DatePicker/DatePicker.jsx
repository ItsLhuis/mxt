import React from "react"

import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers"
import { FormHelperText } from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

const DatePicker = (props) => {
  return (
    <>
      <MuiDatePicker
        slots={{
          switchViewIcon: KeyboardArrowDown
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: props.error && "rgb(211, 47, 47) !important"
          },
          "& .MuiFormLabel-root": {
            color: props.error && "rgb(211, 47, 47)!important"
          }
        }}
        {...props}
      />
      <FormHelperText sx={{ color: props.error && "rgb(211, 47, 47)" }}>
        {props.helperText}
      </FormHelperText>
    </>
  )
}

export default DatePicker
