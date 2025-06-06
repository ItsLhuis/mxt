import React, { useState, useMemo } from "react"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useClient } from "@hooks/server/useClient"

import { Box, Stack, Divider, Typography, Tooltip, IconButton } from "@mui/material"
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

import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"

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
        visible: false
      },
      {
        id: "created_at_datetime",
        label: "Criado por",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
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
                {!row?.created_by_user ? (
                  <Typography variant="p" component="p" color="var(--outline)">
                    Utilizador removido
                  </Typography>
                ) : (
                  <>
                    <Avatar
                      alt={row?.created_by_user?.username}
                      src={`${BASE_URL}/users/${row?.created_by_user?.id}/avatar?size=80`}
                      name={row?.created_by_user?.username}
                    />
                    <Stack
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <Typography variant="p" component="p" fontWeight={500}>
                        {row?.created_by_user?.username}
                      </Typography>
                      <Typography variant="p" component="p" color="var(--outline)">
                        {row?.created_by_user?.role}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
              <Divider
                sx={{
                  borderColor: "var(--elevation-level5)",
                  borderWidth: 1
                }}
              />
              <Stack
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <Typography variant="p" component="p" fontWeight={500}>
                  {formatDate(row?.created_at_datetime)}
                </Typography>
                <Typography variant="p" component="p" color="var(--outline)">
                  {formatTime(row?.created_at_datetime)}
                </Typography>
              </Stack>
            </Stack>
          </>
        )
      },
      {
        id: "last_modified_by_user",
        visible: false
      },
      {
        id: "last_modified_datetime",
        label: "Modificado pela última vez por",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row?.last_modified_datetime ? (
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
                  {!row?.last_modified_by_user ? (
                    <Typography variant="p" component="p" color="var(--outline)">
                      Utilizador removido
                    </Typography>
                  ) : (
                    <>
                      <Avatar
                        alt={row?.last_modified_by_user?.username}
                        src={`${BASE_URL}/users/${row?.last_modified_by_user?.id}/avatar?size=80`}
                        name={row?.last_modified_by_user?.username}
                      />
                      <Stack
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        <Typography variant="p" component="p" fontWeight={500}>
                          {row?.last_modified_by_user?.username}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {row?.last_modified_by_user?.role}
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Stack>
                <Divider
                  sx={{
                    borderColor: "var(--elevation-level5)",
                    borderWidth: 1
                  }}
                />
                <Stack
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <Typography variant="p" component="p" fontWeight={500}>
                    {formatDate(row?.last_modified_datetime)}
                  </Typography>
                  <Typography variant="p" component="p" color="var(--outline)">
                    {formatTime(row?.last_modified_datetime)}
                  </Typography>
                </Stack>
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
        id: "more_options",
        align: "right",
        sortable: false,
        renderComponent: ({ row }) => (
          <ButtonDropDownSelect
            mode="custom"
            customButton={
              <Tooltip title="Mais opções" sx={{ margin: -1 }}>
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

  const clientAddressesTableExportColumns = useMemo(
    () => [
      {
        id: "client",
        label: "Cliente",
        formatter: () => client?.[0]?.name
      },
      {
        id: "country",
        label: "País"
      },
      {
        id: "city",
        label: "Cidade"
      },
      {
        id: "locality",
        label: "Localidade"
      },
      {
        id: "address",
        label: "Morada"
      },
      {
        id: "postal_code",
        label: "Código postal"
      },
      {
        id: "created_by_user.username",
        label: "Criado por"
      },
      {
        id: "created_at_datetime",
        label: "Data de criação",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "last_modified_by_user.username",
        label: "Modificado pela última vez por"
      },
      {
        id: "last_modified_datetime",
        label: "Última data de modificação",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      }
    ],
    [client]
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
              data={isClientFinished ? client[0]?.addresses : []}
              columns={clientAddressesTableColumns}
              exportFileName="moradas_cliente"
              exportColumns={clientAddressesTableExportColumns}
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
