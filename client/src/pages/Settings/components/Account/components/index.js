import { lazy } from "react"

const UserAvatarForm = lazy(() => import("./UserAvatarForm"))
const UserAccountDataForm = lazy(() => import("./UserAccountDataForm"))
const UserPersonalDataForm = lazy(() => import("./UserPersonalDataForm"))
const UserLogout = lazy(() => import("./UserLogout"))

export { UserAvatarForm, UserAccountDataForm, UserPersonalDataForm, UserLogout }
