import { lazy } from "react"

const RepairStatusTable = lazy(() => import("./RepairStatusTable"))
const RepairStatusAddModal = lazy(() => import("./RepairStatusAddModal"))
const RepairStatusEditModal = lazy(() => import("./RepairStatusEditModal"))

export { RepairStatusTable, RepairStatusAddModal, RepairStatusEditModal }
