import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getAllEmails, sendEmail as sendEmailApi } from "@api/routes/email"

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

  const sendEmail = useMutation({
    mutationFn: sendEmailApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["emails"])
      showSuccessToast("E-mail enviado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao enviar e-mail!")
    }
  })

  return {
    findAllEmails,
    sendEmail
  }
}
