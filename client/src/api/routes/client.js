import { api } from ".."

const getAllClients = async () => {
  const response = await api.get("/clients")
  return response.data
}

const getClientById = async ({ clientId }) => {
  const response = await api.get(`/clients/${clientId}`)
  return response.data
}

const createClient = async ({ name, description }) => {
  const response = await api.post("/clients", { name, description })
  return response.data
}

const addContactClient = async ({ clientId, type, contact, description }) => {
  const response = await api.post(`/clients/${clientId}/contacts`, { type, contact, description })
  return response.data
}

const addAddressClient = async ({ clientId, country, city, locality, address, postalCode }) => {
  const response = await api.post(`/clients/${clientId}/addresses`, {
    country,
    city,
    locality,
    address,
    postalCode
  })
  return response.data
}

const deleteClient = async ({ clientId }) => {
  const response = await api.delete(`/clients/${clientId}`)
  return response.data
}

export {
  getAllClients,
  getClientById,
  createClient,
  addContactClient,
  addAddressClient,
  deleteClient
}
