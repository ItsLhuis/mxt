import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getAllSmses, getSmsById, sendSms as sendSmsApi } from "@api/routes/sms"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useSms = () => {
  const queryClient = useQueryClient()

  const findAllSmses = useQuery({
    queryKey: ["smses"],
    queryFn: getAllSmses,
    onSuccess: (data) => {
      queryClient.setQueryData(["smses"], data)
    }
  })

  const findSmsById = (smsId) => {
    return useQuery({
      queryKey: ["smses", smsId],
      queryFn: () => getSmsById({ smsId }),
      onSuccess: (data) => {
        queryClient.setQueryData(["smses", smsId], data)
      },
      enabled: !!smsId
    })
  }

  const sendSms = useMutation({
    mutationFn: sendSmsApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["smses"])
      showSuccessToast("SMS enviado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao enviar SMS!")
    }
  })

  return {
    findAllSmses,
    findSmsById,
    sendSms
  }
}
