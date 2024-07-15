import { lazy } from "react"

export const Auth = lazy(() => import("./Auth/Auth"))

export const Company = lazy(() => import("./Company/Company"))

export const Dashboard = lazy(() => import("./Dashboard/Dashboard"))

//Employee
export const EmployeeList = lazy(() => import("./Employee/List/List"))
export const AddEmployee = lazy(() => import("./Employee/Manage/Add"))
export const EditEmployee = lazy(() => import("./Employee/Manage/Edit"))
//----------------------------------------------------------------------

//Client
export const ClientList = lazy(() => import("./Client/List/List"))
export const AddClient = lazy(() => import("./Client/Manage/Add"))
export const EditClient = lazy(() => import("./Client/Manage/Edit"))
//----------------------------------------------------------------------

//Equipment
export const EquipmentList = lazy(() => import("./Equipment/List/List"))
export const AddEquipment = lazy(() => import("./Equipment/Manage/Add"))
export const EditEquipment = lazy(() => import("./Equipment/Manage/Edit"))

export const EquipmentTypeList = lazy(() => import("./Equipment/Attributes/Type/List"))

export const EquipmentBrandList = lazy(() => import("./Equipment/Attributes/Brand/List"))

export const EquipmentModelList = lazy(() => import("./Equipment/Attributes/Model/List"))
//----------------------------------------------------------------------

//Repair
export const RepairList = lazy(() => import("./Repair/List/List"))

export const RepairStatusList = lazy(() => import("./Repair/Attributes/Status/List"))

export const RepairEntryAccessoryList = lazy(() =>
  import("./Repair/Attributes/EntryAccessory/List")
)

export const RepairEntryReportedIssueList = lazy(() =>
  import("./Repair/Attributes/EntryReportedIssue/List")
)

export const RepairInterventionWorkDoneList = lazy(() =>
  import("./Repair/Attributes/InterventionWorkDone/List")
)

export const RepairInterventionAccessoryUsedList = lazy(() =>
  import("./Repair/Attributes/InterventionAccessoryUsed/List")
)
//----------------------------------------------------------------------

//Email
export const EmailList = lazy(() => import("./Email/List/List"))
export const SendEmail = lazy(() => import("./Email/Send/Send"))
export const GetEmail = lazy(() => import("./Email/Get/Get"))
//----------------------------------------------------------------------

export const Settings = lazy(() => import("./Settings/Settings"))
