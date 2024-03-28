import React from "react"
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers"
import { FormHelperText } from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

const DatePicker = (props) => {
  const { minDate, maxDate, value } = props
  const isBeforeMinDate = minDate && value && value < minDate
  const isAfterMaxDate = maxDate && value && value > maxDate

  return (
    <>
      <MuiDatePicker
        slots={{
          switchViewIcon: KeyboardArrowDown
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              (props.error || isBeforeMinDate || isAfterMaxDate) && "rgb(211, 47, 47) !important"
          },
          "& .MuiFormLabel-root": {
            color:
              (props.error || isBeforeMinDate || isAfterMaxDate) && "rgb(211, 47, 47) !important"
          }
        }}
        {...props}
      />
      <FormHelperText
        sx={{ color: (props.error || isBeforeMinDate || isAfterMaxDate) && "rgb(211, 47, 47)" }}
      >
        {(isBeforeMinDate && "A data selecionada está antes do limite mínimo") ||
          (isAfterMaxDate && "A data selecionada está após o limite máximo") ||
          props.helperText}
      </FormHelperText>
    </>
  )
}

export default DatePicker
