import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getCompany,
  updateCompany as updateCompanyApi,
  updateCompanyLogo as updateCompanyLogoApi
} from "@api/routes/company"

export const useCompany = () => {
  const queryClient = useQueryClient()

  const findCompany = useQuery({
    queryKey: ["company"],
    queryFn: getCompany,
    onSuccess: (data) => {
      queryClient.setQueryData(["company"], data)
    }
  })

  const updateCompany = useMutation({
    mutationFn: updateCompanyApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["company"])
    }
  })

  const updateCompanylogo = useMutation({
    mutationFn: updateCompanyLogoApi
  })

  return { findCompany, updateCompany, updateCompanylogo }
}
