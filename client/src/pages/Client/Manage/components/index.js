import { lazy } from "react"

const AddClientForm = lazy(() => import("./AddClientForm"))
const EditClientForm = lazy(() => import("./EditClientForm"))

export { AddClientForm, EditClientForm }
