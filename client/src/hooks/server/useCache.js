import { useMutation } from "@tanstack/react-query"

import { deleteCache as deleteCacheApi } from "@api/routes/cache"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useCache = () => {
  const deleteCache = useMutation({
    mutationFn: deleteCacheApi,
    onSuccess: () => {
      showSuccessToast("Cache limpa com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao limpar cache!")
    }
  })

  return { deleteCache }
}
