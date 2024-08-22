import { useQuery } from "@tanstack/react-query"

import { getEmployeeSummary } from "@api/routes/user"
import { getClientSummary } from "@api/routes/client"
import { getEquipmentSummary } from "@api/routes/equipment"
import { getRepairSummary } from "@api/routes/repair"
import { getEmailSummary } from "@api/routes/email"
import { getSmsSummary } from "@api/routes/sms"

import { useEquipment } from "./useEquipment"
import { useRepair } from "./useRepair"

export const useDashboard = () => {
  const { findAllEquipments } = useEquipment()
  const { findAllRepairs } = useRepair()

  const findEmployeeSummary = useQuery({
    queryKey: ["dashboard", "employees", "summary"],
    queryFn: getEmployeeSummary
  })

  const findClientSummary = useQuery({
    queryKey: ["dashboard", "clients", "summary"],
    queryFn: getClientSummary
  })

  const findEquipmentSummary = useQuery({
    queryKey: ["dashboard", "equipments", "summary"],
    queryFn: getEquipmentSummary
  })

  const findRepairSummary = useQuery({
    queryKey: ["dashboard", "repairs", "summary"],
    queryFn: getRepairSummary
  })

  const findEmailSummary = useQuery({
    queryKey: ["dashboard", "emails", "summary"],
    queryFn: getEmailSummary
  })

  const findSmsSummary = useQuery({
    queryKey: ["dashboard", "smses", "summary"],
    queryFn: getSmsSummary
  })

  const refetchAllQueries = () => {
    return Promise.all([
      findEmployeeSummary.refetch(),
      findClientSummary.refetch(),
      findEquipmentSummary.refetch(),
      findRepairSummary.refetch(),
      findEmailSummary.refetch(),
      findSmsSummary.refetch(),
      findAllEquipments.refetch(),
      findAllRepairs.refetch()
    ])
  }

  const queries = [
    findEmployeeSummary,
    findClientSummary,
    findEquipmentSummary,
    findRepairSummary,
    findEmailSummary,
    findSmsSummary,
    findAllEquipments,
    findAllRepairs
  ]

  const isFetching = queries.some((query) => query.isFetching)
  const isRefetching = queries.some((query) => query.isRefetching)

  return {
    findEmployeeSummary,
    findClientSummary,
    findEquipmentSummary,
    findRepairSummary,
    findEmailSummary,
    findSmsSummary,
    refetchAllQueries: {
      refetch: refetchAllQueries,
      isFetching,
      isRefetching
    }
  }
}
