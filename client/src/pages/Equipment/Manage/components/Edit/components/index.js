import { lazy } from "react"

const EquipmentDetailsForm = lazy(() => import("./EquipmentDetailsForm"))
const EquipmentRepairsTable = lazy(() => import("./EquipmentRepairsTable"))
const EquipmentAttachments = lazy(() => import("./EquipmentAttachments"))
const EquipmentInteractionsHistoryTable = lazy(() => import("./EquipmentInteractionsHistoryTable"))
const EquipmentTransferForm = lazy(() => import("./EquipmentTransferForm"))

export {
  EquipmentDetailsForm,
  EquipmentRepairsTable,
  EquipmentAttachments,
  EquipmentInteractionsHistoryTable,
  EquipmentTransferForm
}
