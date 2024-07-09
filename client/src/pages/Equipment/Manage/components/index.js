import { lazy } from "react"

const AddEquipmentForm = lazy(() => import("./Add/AddEquipmentForm"))
const EditEquipment = lazy(() => import("./Edit/EditEquipment"))

export { AddEquipmentForm, EditEquipment }
