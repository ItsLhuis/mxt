import { lazy } from "react"

const EquipmentBrandTable = lazy(() => import("./EquipmentBrandTable"))
const EquipmentBrandAddModal = lazy(() => import("./EquipmentBrandAddModal"))
const EquipmentBrandEditModal = lazy(() => import("./EquipmentBrandEditModal"))

export { EquipmentBrandTable, EquipmentBrandAddModal, EquipmentBrandEditModal }