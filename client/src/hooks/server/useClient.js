import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getAllClients,
  createClient,
  addContactClient,
  addAddressClient
} from "@api/routes/clients"

export const useClient = () => {
  const queryClient = useQueryClient()

  const findAllClients = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    onSuccess: (data) => {
      queryClient.setQueryData(["clients"], data)
    },
    refetchInterval: 5000
  })

  const createNewClient = useMutation({
    mutationFn: createClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["clients"])
    }
  })

  const addNewContactClient = useMutation({
    mutationFn: addContactClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["clients"])
    }
  })

  const addNewAddressClient = useMutation({
    mutationFn: addAddressClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["clients"])
    }
  })

  return { findAllClients, createNewClient, addNewContactClient, addNewAddressClient }
}
