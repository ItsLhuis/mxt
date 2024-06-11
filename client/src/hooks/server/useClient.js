import { useQuery, useQueryClient } from "@tanstack/react-query"

import { getAllClients } from "@api/routes/clients"

export const useClient = () => {
  const queryClient = useQueryClient()

  const findAllClients = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    onSuccess: (data) => {
      queryClient.setQueryData(["clients"], data)
    },
    refetchInterval: 3000
  })

  return { findAllClients }
}
