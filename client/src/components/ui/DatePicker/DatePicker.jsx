import React from "react"

import { startOfDay, isBefore, isAfter } from "date-fns"

import { DateTimePicker  } from "@mui/x-date-pickers"
import { DialogActions, Button, FormHelperText } from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

const CustomActionBar = (props) => {
  const { onAccept, onCancel, ownerState, className } = props

  const isMobile = ownerState.wrapperVariant !== "desktop"

  if (isMobile) {
    return (
      <DialogActions className={className}>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={onAccept}>
          Selecionar
        </Button>
      </DialogActions>
    )
  }
}

const DatePicker = (props) => {
  const { minDate, maxDate, value } = props

  const stripTime = (date) => {
    return date ? startOfDay(date) : null
  }

  const strippedValue = stripTime(value)
  const strippedMinDate = stripTime(minDate)
  const strippedMaxDate = stripTime(maxDate)

  const isBeforeMinDate =
    strippedMinDate && strippedValue && isBefore(strippedValue, strippedMinDate)
  const isAfterMaxDate = strippedMaxDate && strippedValue && isAfter(strippedValue, strippedMaxDate)

  const hasHelperText = isBeforeMinDate || isAfterMaxDate || props.helperText

  return (
    <>
      <DateTimePicker
        slots={{
          switchViewIcon: KeyboardArrowDown,
          actionBar: CustomActionBar
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
      {hasHelperText && (
        <FormHelperText
          sx={{ color: (props.error || isBeforeMinDate || isAfterMaxDate) && "rgb(211, 47, 47)" }}
        >
          {(isBeforeMinDate && "A data selecionada está antes do limite mínimo") ||
            (isAfterMaxDate && "A data selecionada está após o limite máximo") ||
            props.helperText}
        </FormHelperText>
      )}
    </>
  )
}

export default DatePicker
