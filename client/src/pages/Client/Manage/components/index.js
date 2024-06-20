import { lazy } from "react"

const AddClientForm = lazy(() => import("./Add/AddClientForm"))
const EditClient = lazy(() => import("./Edit/EditClient"))

export { AddClientForm, EditClient }
