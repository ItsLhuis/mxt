import { lazy } from "react"

const RepairEntryReportedIssueTable = lazy(() => import("./RepairEntryReportedIssueTable"))
const RepairEntryReportedIssueAddModal = lazy(() => import("./RepairEntryReportedIssueAddModal"))
const RepairEntryReportedIssueEditModal = lazy(() => import("./RepairEntryReportedIssueEditModal"))

export { RepairEntryReportedIssueTable, RepairEntryReportedIssueAddModal, RepairEntryReportedIssueEditModal }
