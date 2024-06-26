import React, { useState, useMemo } from "react"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useClient } from "@hooks/server/useClient"

import { Box, Stack, Divider, ListItemText, Typography, Tooltip, IconButton } from "@mui/material"
import { Place, MoreVert, Edit, Delete } from "@mui/icons-material"

import {
  HeaderSection,
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton,
  Modal
} from "@components/ui"
import ClientAddressEditModal from "./ClientAddressEditModal"

import { formatDate, formatTime } from "@utils/format/date"

const ClientAddressTable = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const { role } = useAuth()

  const { deleteAddressClient } = useClient()

  const [clientEditAddressModal, setClientAddressEditModal] = useState({
    isOpen: false,
    clientAddress: null
  })
  const openClientAddressEditModal = (clientAddress) => {
    setClientAddressEditModal({ isOpen: true, clientAddress: clientAddress })
  }
  const closeClientAddressEditModal = () => {
    setClientAddressEditModal({ isOpen: false, clientAddress: null })
  }

  const [clientDeleteAddressModal, setClientDeleteAddressModal] = useState({
    isOpen: false,
    clientAddress: null
  })
  const openClientDeleteAddressModal = (clientAddress) => {
    setClientDeleteAddressModal({ isOpen: true, clientAddress: clientAddress })
  }
  const closeClientDeleteAddressModal = () => {
    setClientDeleteAddressModal({ isOpen: false, clientAddress: null })
  }

  const handleDeleteClientAddress = () => {
    return new Promise((resolve, reject) => {
      if (clientDeleteAddressModal.clientAddress) {
        deleteAddressClient
          .mutateAsync({
            clientId: clientDeleteAddressModal.clientAddress.client_id,
            addressId: clientDeleteAddressModal.clientAddress.id
          })
          .then(() => {
            closeClientDeleteAddressModal()
            resolve()
          })
          .catch(() => {
            closeClientDeleteAddressModal()
            reject()
          })
      } else {
        closeClientDeleteAddressModal()
        reject()
      }
    })
  }

  const clientAddressesTableColumns = useMemo(
    () => [
      {
        id: "country",
        label: "País",
        align: "left",
        sortable: true
      },
      {
        id: "city",
        label: "Cidade",
        align: "left",
        sortable: true
      },
      {
        id: "locality",
        label: "Localidade",
        align: "left",
        sortable: true
      },
      {
        id: "address",
        label: "Morada",
        align: "left",
        sortable: true
      },
      {
        id: "postal_code",
        label: "Código postal",
        align: "left",
        sortable: true
      },
      {
        id: "created_by_user",
        label: "Criado por",
        align: "left",
        sortable: false,
        renderComponent: ({ row }) => (
          <Stack
            sx={{
              flexDirection: "row",
              gap: 2
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 1
              }}
            >
              <Avatar
                alt={row.created_by_user.username}
                src={`${BASE_URL}/users/${row.created_by_user.id}/avatar?size=80`}
                name={row.created_by_user.username}
              />
              <ListItemText
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <Typography variant="p" component="p" fontWeight={500}>
                  {row.created_by_user.username}
                </Typography>
                <Typography variant="p" component="p" color="var(--outline)">
                  {row.created_by_user.role}
                </Typography>
              </ListItemText>
            </Stack>
            <Divider
              sx={{
                borderColor: "var(--elevation-level5)",
                borderWidth: 1
              }}
            />
            <ListItemText
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              <Typography variant="p" component="p" fontWeight={500}>
                {formatDate(row.created_at_datetime)}
              </Typography>
              <Typography variant="p" component="p" color="var(--outline)">
                {formatTime(row.created_at_datetime)}
              </Typography>
            </ListItemText>
          </Stack>
        )
      },
      {
        id: "last_modified_by_user",
        label: "Modificado pela última vez por",
        align: "left",
        sortable: false,
        renderComponent: ({ row }) => (
          <>
            {row.last_modified_by_user ? (
              <Stack
                sx={{
                  flexDirection: "row",
                  gap: 2
                }}
              >
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Avatar
                    alt={row.last_modified_by_user.username}
                    src={`${BASE_URL}/users/${row.last_modified_by_user.id}/avatar?size=80`}
                    name={row.last_modified_by_user.username}
                  />
                  <ListItemText
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    <Typography variant="p" component="p" fontWeight={500}>
                      {row.last_modified_by_user.username}
                    </Typography>
                    <Typography variant="p" component="p" color="var(--outline)">
                      {row.last_modified_by_user.role}
                    </Typography>
                  </ListItemText>
                </Stack>
                <Divider
                  sx={{
                    borderColor: "var(--elevation-level5)",
                    borderWidth: 1
                  }}
                />
                <ListItemText
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <Typography variant="p" component="p" fontWeight={500}>
                    {formatDate(row.last_modified_datetime)}
                  </Typography>
                  <Typography variant="p" component="p" color="var(--outline)">
                    {formatTime(row.last_modified_datetime)}
                  </Typography>
                </ListItemText>
              </Stack>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Ainda não foi modificado
              </Typography>
            )}
          </>
        )
      },
      {
        id: "moreOptions",
        align: "right",
        sortable: false,
        renderComponent: ({ row }) => (
          <ButtonDropDownSelect
            mode="custom"
            customButton={
              <Tooltip title="Mais opções" placement="bottom" sx={{ margin: -1 }}>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Tooltip>
            }
          >
            <ListButton
              buttons={[
                {
                  label: "Editar",
                  icon: <Edit fontSize="small" />,
                  onClick: () => openClientAddressEditModal(row)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openClientDeleteAddressModal(row)
                      }
                    ]
                  : [])
              ]}
            />
          </ButtonDropDownSelect>
        )
      }
    ],
    []
  )

  return (
    <Stack>
      <HeaderSection title="Moradas" description="Moradas do cliente" icon={<Place />} />
      <Loadable
        isLoading={!isClientFinished}
        LoadingComponent={<TableSkeleton mode="datatable" />}
        LoadedComponent={
          <Box
            sx={{
              margin: 3,
              border: "1px solid var(--elevation-level5)",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            <Table
              mode="datatable"
              data={isClientFinished ? client[0].addresses : []}
              columns={clientAddressesTableColumns}
            />
          </Box>
        }
      />
      <Divider
        sx={{
          borderColor: "var(--elevation-level5)",
          borderWidth: 1
        }}
      />
      <ClientAddressEditModal
        clientAddress={clientEditAddressModal.clientAddress}
        open={clientEditAddressModal.isOpen}
        onClose={closeClientAddressEditModal}
      />
      <Modal
        mode="delete"
        title="Eliminar Morada"
        open={clientDeleteAddressModal.isOpen}
        onClose={closeClientDeleteAddressModal}
        onSubmit={handleDeleteClientAddress}
        description="Tem a certeza que deseja eliminar esta morada?"
        subDescription="Ao eliminar esta morada, os dados serão removidos de forma permanente."
      />
    </Stack>
  )
}

export default ClientAddressTable
