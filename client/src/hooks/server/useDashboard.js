import { useQuery, useQueryClient } from "@tanstack/react-query"

import { getEmployeeSummary } from "@api/routes/user"
import { getClientSummary } from "@api/routes/client"
import { getEquipmentSummary } from "@api/routes/equipment"
import { getRepairSummary } from "@api/routes/repair"
import { getEmailSummary } from "@api/routes/email"
import { getSmsSummary } from "@api/routes/sms"

export const useDashboard = () => {
  const queryClient = useQueryClient()

  const findEmployeeSummary = useQuery({
    queryKey: ["dashboard", "emplyoees", "summary"],
    queryFn: getEmployeeSummary,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard", "emplyoees", "summary"], data)
    }
  })

  const findClientSummary = useQuery({
    queryKey: ["dashboard", "clients", "summary"],
    queryFn: getEmployeeSummary,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard", "clients", "summary"], data)
    }
  })

  const findEquipmentSummary = useQuery({
    queryKey: ["dashboard", "equipments", "summary"],
    queryFn: getEmployeeSummary,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard", "equipments", "summary"], data)
    }
  })

  const findRepairSummary = useQuery({
    queryKey: ["dashboard", "repairs", "summary"],
    queryFn: getEmployeeSummary,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard", "repairs", "summary"], data)
    }
  })

  const findEmailSummary = useQuery({
    queryKey: ["dashboard", "emails", "summary"],
    queryFn: getEmployeeSummary,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard", "emails", "summary"], data)
    }
  })

  const findSmsSummary = useQuery({
    queryKey: ["dashboard", "smses", "summary"],
    queryFn: getEmployeeSummary,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard", "smses", "summary"], data)
    }
  })

  return {
    findEmployeeSummary,
    findClientSummary,
    findEquipmentSummary,
    findRepairSummary,
    findEmailSummary,
    findSmsSummary
  }
}
