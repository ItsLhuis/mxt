import { api } from ".."

const getCompany = async () => {
  const response = await api.get("/company")
  return response.data[0]
}

const updateCompany = async ({
  name,
  address,
  city,
  locality,
  country,
  postalCode,
  phoneNumber,
  email,
  website,
  logo
}) => {
  const formData = new FormData()
  formData.append("name", name)
  formData.append("country", country)
  formData.append("city", city)
  formData.append("locality", locality)
  formData.append("address", address)
  formData.append("postalCode", postalCode)
  formData.append("phoneNumber", phoneNumber)
  formData.append("email", email)
  formData.append("website", website)

  if (logo instanceof File) {
    formData.append("logo", logo)
  }

  const response = await api.put("/company", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

const updateCompanyLogo = async ({
  name,
  address,
  city,
  locality,
  country,
  postalCode,
  phoneNumber,
  email,
  logo
}) => {
  const formData = new FormData()
  formData.append("name", name)
  formData.append("country", country)
  formData.append("city", city)
  formData.append("locality", locality)
  formData.append("address", address)
  formData.append("postalCode", postalCode)
  formData.append("phoneNumber", phoneNumber)
  formData.append("email", email)

  if (logo instanceof File) {
    formData.append("logo", logo)
  }

  const response = await api.put("/company", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

export { getCompany, updateCompany, updateCompanyLogo }
