import { format, isToday, isYesterday, subDays, startOfToday } from "date-fns"
import { ptBR } from "date-fns/locale"

const monthNamesByAbbreviations = {
  Jan: "Janeiro",
  Fev: "Fevereiro",
  Mar: "Março",
  Abr: "Abril",
  Mai: "Maio",
  Jun: "Junho",
  Jul: "Julho",
  Ago: "Agosto",
  Set: "Setembro",
  Out: "Outubro",
  Nov: "Novembro",
  Dez: "Dezembro"
}

const monthNamesByNumber = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro"
}

export const formatMonthDateByAbbreviation = (value) => {
  if (monthNamesByAbbreviations.hasOwnProperty(value)) {
    return monthNamesByAbbreviations[value]
  }
  return value
}

export const formatMonthDateByNumber = (value) => {
  if (monthNamesByNumber.hasOwnProperty(value)) {
    return monthNamesByNumber[value]
  }
  return value
}

export const formatMonth = (value) => {
  const date = new Date(value)
  const currentYear = new Date().getFullYear()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  let formattedMonth = monthNamesByNumber[month]

  if (!formattedMonth) {
    return value
  }

  formattedMonth = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1)

  if (year !== currentYear) {
    return `${formattedMonth} ${year}`
  }

  return formattedMonth
}

export const formatDate = (value) => {
  const date = new Date(value)

  if (isToday(date)) {
    return "Hoje"
  }

  if (isYesterday(date)) {
    return "Ontem"
  }

  const dayBeforeYesterday = subDays(startOfToday(), 2)
  if (
    date.getDate() === dayBeforeYesterday.getDate() &&
    date.getMonth() === dayBeforeYesterday.getMonth() &&
    date.getFullYear() === dayBeforeYesterday.getFullYear()
  ) {
    return "Anteontem"
  }

  const currentYear = new Date().getFullYear()
  const dateYear = date.getFullYear()
  if (dateYear !== currentYear) {
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  return format(date, "d 'de' MMMM", { locale: ptBR })
}
