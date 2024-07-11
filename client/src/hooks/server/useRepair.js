import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getAllRepairs } from "@api/routes/repair"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useRepair = () => {
  const queryClient = useQueryClient()

  const findAllRepairs = useQuery({
    queryKey: ["repairs"],
    queryFn: getAllRepairs,
    onSuccess: (data) => {
      queryClient.setQueryData(["repairs"], data)
    },
    refetchInterval: 60000
  })

  return {
    findAllRepairs
  }
}
