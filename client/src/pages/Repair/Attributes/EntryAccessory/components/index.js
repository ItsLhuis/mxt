import { lazy } from "react"

const RepairEntryAccessoryTable = lazy(() => import("./RepairEntryAccessoryTable"))
const RepairEntryAccessoryAddModal = lazy(() => import("./RepairEntryAccessoryAddModal"))
const RepairEntryAccessoryEditModal = lazy(() => import("./RepairEntryAccessoryEditModal"))

export { RepairEntryAccessoryTable, RepairEntryAccessoryAddModal, RepairEntryAccessoryEditModal }
