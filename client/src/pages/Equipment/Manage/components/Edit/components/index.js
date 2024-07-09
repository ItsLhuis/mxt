import { lazy } from "react"

const EquipmentDetailsForm = lazy(() => import("./EquipmentDetailsForm"))
const EquipmentTransferForm = lazy(() => import("./EquipmentTransferForm"))
const EquipmentAttachments = lazy(() => import("./EquipmentAttachments"))
const EquipmentInteractionsHistoryTable = lazy(() => import("./EquipmentInteractionsHistoryTable"))

export { EquipmentDetailsForm, EquipmentTransferForm, EquipmentAttachments, EquipmentInteractionsHistoryTable }
