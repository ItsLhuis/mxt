import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getAllEmails } from "@api/routes/email"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useEmail = () => {
  const queryClient = useQueryClient()

  const findAllEmails = useQuery({
    queryKey: ["emails"],
    queryFn: getAllEmails,
    onSuccess: (data) => {
      queryClient.setQueryData(["emails"], data)
    },
    refetchInterval: 60000
  })

  return {
    findAllEmails
  }
}
