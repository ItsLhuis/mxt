import { lazy } from "react"

const EquipmentTypeTable = lazy(() => import("./EquipmentTypeTable"))
const EquipmentTypeAddModal = lazy(() => import("./EquipmentTypeAddModal"))
const EquipmentTypeEditModal = lazy(() => import("./EquipmentTypeEditModal"))

export { EquipmentTypeTable, EquipmentTypeAddModal, EquipmentTypeEditModal }
