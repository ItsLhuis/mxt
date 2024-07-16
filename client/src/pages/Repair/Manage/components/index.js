import { lazy } from "react"

const AddRepairForm = lazy(() => import("./Add/AddRepairForm"))
const EditEquipment = lazy(() => import("./Edit/EditEquipment"))

export { AddRepairForm, EditEquipment }
