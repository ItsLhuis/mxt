import { api } from ".."

export const getClientSummary = async () => {
  const response = await api.get("/clients/summary")
  return response.data
}

export const getAllClients = async () => {
  const response = await api.get("/clients")
  return response.data
}

export const getClientById = async ({ clientId }) => {
  const response = await api.get(`/clients/${clientId}`)
  return response.data
}

export const createClient = async ({ name, description }) => {
  const response = await api.post("/clients", { name, description })
  return response.data
}

export const updateClient = async ({ clientId, name, description }) => {
  const response = await api.put(`/clients/${clientId}`, { name, description })
  return response.data
}

export const deleteClient = async ({ clientId }) => {
  const response = await api.delete(`/clients/${clientId}`)
  return response.data
}

export const addContactClient = async ({ clientId, type, contact, description }) => {
  const response = await api.post(`/clients/${clientId}/contacts`, { type, contact, description })
  return response.data
}

export const updateContactClient = async ({ clientId, contactId, type, contact, description }) => {
  const response = await api.put(`/clients/${clientId}/contacts/${contactId}`, {
    type,
    contact,
    description
  })
  return response.data
}

export const deleteContactClient = async ({ clientId, contactId }) => {
  const response = await api.delete(`/clients/${clientId}/contacts/${contactId}`)
  return response.data
}

export const addAddressClient = async ({
  clientId,
  country,
  city,
  locality,
  address,
  postalCode
}) => {
  const response = await api.post(`/clients/${clientId}/addresses`, {
    country,
    city,
    locality,
    address,
    postalCode
  })
  return response.data
}

export const updateAddressClient = async ({
  clientId,
  addressId,
  country,
  city,
  locality,
  address,
  postalCode
}) => {
  const response = await api.put(`/clients/${clientId}/addresses/${addressId}`, {
    country,
    city,
    locality,
    address,
    postalCode
  })
  return response.data
}

export const deleteAddressClient = async ({ clientId, addressId }) => {
  const response = await api.delete(`/clients/${clientId}/addresses/${addressId}`)
  return response.data
}
