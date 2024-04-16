import { lazy } from "react"

import Auth from "./Auth/Auth"

const Dashboard = lazy(() => import("./Dashboard/Dashboard"))

//Client
const ClientList = lazy(() => import("./Client/List/List"))
const AddClient = lazy(() => import("./Client/Add/Add"))
//----------------------------------------------------------------------

//Invoice
const InvoiceList = lazy(() => import("./Invoice/List/List"))
const CreateInvoice = lazy(() => import("./Invoice/Create/Create"))
//----------------------------------------------------------------------

const Settings = lazy(() => import("./Settings/Settings"))

export { Auth, Dashboard, ClientList, AddClient, InvoiceList, CreateInvoice, Settings }
