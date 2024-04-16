import { lazy } from "react"

const InvoiceList = lazy(() => import("./InvoiceList/InvoiceList"))
const InvoiceStatus = lazy(() => import("./InvoiceStatus/InvoiceStatus"))

export { InvoiceList, InvoiceStatus }
