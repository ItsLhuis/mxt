import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getAllEmails, getEmailById, sendEmail as sendEmailApi } from "@api/routes/email"

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

  const findEmailById = (emailId) => {
    return useQuery({
      queryKey: ["emails", emailId],
      queryFn: () => getEmailById({ emailId }),
      onSuccess: (data) => {
        queryClient.setQueryData(["emails", emailId], data)
      },
      enabled: !!emailId
    })
  }

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
    findEmailById,
    sendEmail
  }
}
