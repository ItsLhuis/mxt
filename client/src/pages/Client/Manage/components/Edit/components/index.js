import { lazy } from "react"

const ClientDetailsForm = lazy(() => import("./ClientDetailsForm"))
const ClientContact = lazy(() => import("./ClientContact"))
const ClientAddress = lazy(() => import("./ClientAddress"))
const ClientEquipmentsTable = lazy(() => import(".//ClientEquipmentsTable"))
const ClientInteractionsHistoryTable = lazy(() => import("./ClientInteractionsHistoryTable"))

export {
  ClientDetailsForm,
  ClientContact,
  ClientAddress,
  ClientEquipmentsTable,
  ClientInteractionsHistoryTable
}
