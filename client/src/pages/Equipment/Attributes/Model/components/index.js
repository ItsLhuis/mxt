import { lazy } from "react"

const EquipmentModelTable = lazy(() => import("./EquipmentModelTable"))
const EquipmentModelAddModal = lazy(() => import("./EquipmentModelAddModal"))
const EquipmentModelEditModal = lazy(() => import("./EquipmentModelEditModal"))

export { EquipmentModelTable, EquipmentModelAddModal, EquipmentModelEditModal }
