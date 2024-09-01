import React, { useState, useMemo } from "react"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useClient } from "@hooks/server/useClient"

import { Box, Stack, Divider, Typography, Tooltip, IconButton } from "@mui/material"
import { Phone, MoreVert, Edit, Delete } from "@mui/icons-material"

import {
  HeaderSection,
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton,
  Caption,
  Modal
} from "@components/ui"
import ClientContactEditModal from "./ClientContactEditModal"

import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const ClientContactTable = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const { role } = useAuth()

  const { deleteContactClient } = useClient()

  const [clientEditContactModal, setClientContactEditModal] = useState({
    isOpen: false,
    clientContact: null
  })
  const openClientContactEditModal = (clientContact) => {
    setClientContactEditModal({ isOpen: true, clientContact: clientContact })
  }
  const closeClientContactEditModal = () => {
    setClientContactEditModal({ isOpen: false, clientContact: null })
  }

  const [clientDeleteContactModal, setClientDeleteContactModal] = useState({
    isOpen: false,
    clientContact: null
  })
  const openClientDeleteContactModal = (clientContact) => {
    setClientDeleteContactModal({ isOpen: true, clientContact: clientContact })
  }
  const closeClientDeleteContactModal = () => {
    setClientDeleteContactModal({ isOpen: false, clientContact: null })
  }

  const handleDeleteClientContact = () => {
    return new Promise((resolve, reject) => {
      if (clientDeleteContactModal.clientContact) {
        deleteContactClient
          .mutateAsync({
            clientId: clientDeleteContactModal.clientContact.client_id,
            contactId: clientDeleteContactModal.clientContact.id
          })
          .then(() => {
            closeClientDeleteContactModal()
            resolve()
          })
          .catch(() => {
            closeClientDeleteContactModal()
            reject()
          })
      } else {
        closeClientDeleteContactModal()
        reject()
      }
    })
  }

  const clientContactsTableColumns = useMemo(
    () => [
      {
        id: "type",
        label: "Tipo",
        align: "left",
        sortable: true
      },
      {
        id: "contact",
        label: "Contacto",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <>{formatPhoneNumber(row?.contact)}</>
            {row?.description && <Caption title={row?.description} />}
          </Stack>
        )
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
                  onClick: () => openClientContactEditModal(row)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openClientDeleteContactModal(row)
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

  const clientContactsTableExportColumns = useMemo(
    () => [
      {
        id: "client",
        label: "Cliente",
        formatter: () => client?.[0]?.name
      },
      {
        id: "type",
        label: "Tipo"
      },
      {
        id: "contact",
        label: "Contacto",
        formatter: formatPhoneNumber
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
      <HeaderSection title="Contactos" description="Contactos do cliente" icon={<Phone />} />
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
              data={isClientFinished ? client[0]?.contacts : []}
              columns={clientContactsTableColumns}
              exportFileName="contactos_cliente"
              exportColumns={clientContactsTableExportColumns}
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
      <ClientContactEditModal
        clientContact={clientEditContactModal.clientContact}
        open={clientEditContactModal.isOpen}
        onClose={closeClientContactEditModal}
      />
      <Modal
        mode="delete"
        title="Eliminar Contacto"
        open={clientDeleteContactModal.isOpen}
        onClose={closeClientDeleteContactModal}
        onSubmit={handleDeleteClientContact}
        description="Tem a certeza que deseja eliminar este contacto?"
        subDescription="Ao eliminar este contacto, os dados serão removidos de forma permanente."
      />
    </Stack>
  )
}

export default ClientContactTable
