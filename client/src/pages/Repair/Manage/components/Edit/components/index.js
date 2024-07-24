import { lazy } from "react"

const RepairDetailsForm = lazy(() => import("./RepairDetailsForm"))
const RepairAttachments = lazy(() => import("./RepairAttachments"))
const RepairInteractionsHistoryTable = lazy(() => import("./RepairInteractionsHistoryTable"))

export { RepairDetailsForm, RepairAttachments, RepairInteractionsHistoryTable }
