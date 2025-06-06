import React from "react"

import { startOfDay, isBefore, isAfter } from "date-fns"

import { DateTimePicker } from "@mui/x-date-pickers"
import {
  DialogActions,
  Button,
  FormHelperText,
  FormControl,
  useTheme,
  useMediaQuery
} from "@mui/material"
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

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const isBeforeMinDate = minDate && value && isBefore(value, minDate)
  const isAfterMaxDate = maxDate && value && isAfter(value, maxDate)

  const hasError = props.error || isBeforeMinDate || isAfterMaxDate

  return (
    <FormControl fullWidth>
      <DateTimePicker
        slots={{
          switchViewIcon: KeyboardArrowDown,
          actionBar: CustomActionBar
        }}
        slotProps={{
          dialog: {
            fullScreen,
            sx: { "& .MuiPaper-root": { borderRadius: fullScreen && "0 !important" } }
          }
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: hasError && "rgb(211, 47, 47) !important"
          },
          "& .MuiFormLabel-root": {
            color: hasError && "rgb(211, 47, 47) !important"
          }
        }}
        {...props}
      />
      {hasError && (
        <FormHelperText error={hasError}>
          {(isBeforeMinDate && "A data selecionada está antes do limite mínimo") ||
            (isAfterMaxDate && "A data selecionada está após o limite máximo") ||
            props.helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default DatePicker
