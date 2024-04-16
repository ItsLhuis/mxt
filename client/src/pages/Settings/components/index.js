import { lazy } from "react"

const Account = lazy(() => import("./Account/Account"))
const AppSettings = lazy(() => import("./AppSettings/AppSettings"))
const Notifications = lazy(() => import("./Notifications/Notifications"))
const Security = lazy(() => import("./Security/Security"))

export { Account, AppSettings, Notifications, Security }
