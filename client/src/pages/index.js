import { lazy } from "react"

import Auth from "./Auth/Auth"

const Dashboard = lazy(() => import("./Dashboard/Dashboard"))

//Client
const ClientList = lazy(() => import("./Client/List/List"))
const AddClient = lazy(() => import("./Client/Manage/Add"))
const EditClient = lazy(() => import("./Client/Manage/Edit"))
//----------------------------------------------------------------------

//Invoice
const InvoiceList = lazy(() => import("./Invoice/List/List"))
const CreateInvoice = lazy(() => import("./Invoice/Create/Create"))
//----------------------------------------------------------------------

const Settings = lazy(() => import("./Settings/Settings"))

export { Auth, Dashboard, ClientList, AddClient, EditClient, InvoiceList, CreateInvoice, Settings }
