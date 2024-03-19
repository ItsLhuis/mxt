import React from "react"

import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers"
import { KeyboardArrowDown } from "@mui/icons-material"

const DatePicker = (props) => {
  return <MuiDatePicker slots={{ switchViewIcon: KeyboardArrowDown }} {...props} />
}

export default DatePicker
