import React, { useState, useMemo } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useClient } from "@hooks/server/useClient"

import { Link } from "react-router-dom"
import { Stack, Paper, Box, Typography, Divider, Tooltip, IconButton } from "@mui/material"
import { MoreVert, Edit, Delete, Phone, Place, History, Check, Close } from "@mui/icons-material"

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

import { formatHTML } from "@utils/format/formatHTML"
import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const ClientTable = () => {
  const navigate = useNavigate()

  const { role } = useAuth()

  const { findAllClients, deleteClient } = useClient()
  const { data: clients, isLoading: isClientsLoading } = findAllClients

  const [deleteClientModal, setDeleteClientModal] = useState({ isOpen: false, clientId: null })
  const openDeleteClientModal = (id) => {
    setDeleteClientModal({ isOpen: true, clientId: id })
  }
  const closeDeleteClientModal = () => {
    setDeleteClientModal({ isOpen: false, clientId: null })
  }

  const handleDeleteClient = () => {
    return new Promise((resolve, reject) => {
      if (deleteClientModal.clientId) {
        deleteClient
          .mutateAsync({ clientId: deleteClientModal.clientId })
          .then(() => {
            closeDeleteClientModal()
            resolve()
          })
          .catch(() => {
            closeDeleteClientModal()
            reject()
          })
      } else {
        closeDeleteClientModal()
        reject()
      }
    })
  }

  const clientsTableColumns = useMemo(
    () => [
      {
        id: "name",
        label: "Nome",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => <Link to={`/client/${row.id}`}>{row.name}</Link>
      },
      {
        id: "created_by_user",
        label: "Criado por",
        align: "left",
        sortable: false,
        renderComponent: ({ row }) => (
          <>
            {row.created_by_user ? (
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
                  <Stack
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
                  </Stack>
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
                    {formatDate(row.created_at_datetime)}
                  </Typography>
                  <Typography variant="p" component="p" color="var(--outline)">
                    {formatTime(row.created_at_datetime)}
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Utilizador removido
              </Typography>
            )}
          </>
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
                  <Stack
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
                  </Stack>
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
                    {formatDate(row.last_modified_datetime)}
                  </Typography>
                  <Typography variant="p" component="p" color="var(--outline)">
                    {formatTime(row.last_modified_datetime)}
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
        id: "moreOptions",
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
                  onClick: () => navigate(`/client/${row.id}`)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openDeleteClientModal(row.id)
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

  const ExpandableClientsTableContent = useMemo(
    () =>
      ({ row }) => {
        const contactsTableColumns = useMemo(
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
              formatter: formatPhoneNumber
            },
            {
              id: "created_by_user",
              label: "Criado por",
              align: "left",
              sortable: false,
              renderComponent: ({ row }) => (
                <>
                  {row.created_by_user ? (
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
                        <Stack
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
                        </Stack>
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
                          {formatDate(row.created_at_datetime)}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {formatTime(row.created_at_datetime)}
                        </Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography variant="p" component="p" color="var(--outline)">
                      Utilizador removido
                    </Typography>
                  )}
                </>
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
                        <Stack
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
                        </Stack>
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
                          {formatDate(row.last_modified_datetime)}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {formatTime(row.last_modified_datetime)}
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
            }
          ],
          []
        )

        const addressesTableColumns = useMemo(
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
                <>
                  {row.created_by_user ? (
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
                        <Stack
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
                        </Stack>
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
                          {formatDate(row.created_at_datetime)}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {formatTime(row.created_at_datetime)}
                        </Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography variant="p" component="p" color="var(--outline)">
                      Utilizador removido
                    </Typography>
                  )}
                </>
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
                        <Stack
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
                        </Stack>
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
                          {formatDate(row.last_modified_datetime)}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {formatTime(row.last_modified_datetime)}
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
            }
          ],
          []
        )

        const interactionsHistoryTableColumns = useMemo(
          () => [
            {
              id: "type",
              label: "Atividade",
              align: "left",
              sortable: true
            },
            {
              id: "responsible_user",
              label: "Responsável",
              align: "left",
              sortable: false,
              renderComponent: ({ row }) => (
                <>
                  {row.responsible_user ? (
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
                          alt={row.responsible_user.username}
                          src={`${BASE_URL}/users/${row.responsible_user.id}/avatar?size=80`}
                          name={row.responsible_user.username}
                        />
                        <Stack
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          <Typography variant="p" component="p" fontWeight={500}>
                            {row.responsible_user.username}
                          </Typography>
                          <Typography variant="p" component="p" color="var(--outline)">
                            {row.responsible_user.role}
                          </Typography>
                        </Stack>
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
                          {formatDate(row.created_at_datetime)}
                        </Typography>
                        <Typography variant="p" component="p" color="var(--outline)">
                          {formatTime(row.created_at_datetime)}
                        </Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography variant="p" component="p" color="var(--outline)">
                      Utilizador removido
                    </Typography>
                  )}
                </>
              )
            }
          ],
          []
        )

        const ExpandableClientsInteractionsHistoryTableContent = useMemo(
          () =>
            ({ row }) => {
              const interactionsHistoryDetailsTableColumns = useMemo(
                () => [
                  {
                    id: "field",
                    label: "Campo",
                    align: "left",
                    sortable: true
                  },
                  {
                    id: "before",
                    label: "Antes",
                    align: "left",
                    sortable: true,
                    renderComponent: ({ row }) => {
                      if (row.field === "Descrição") {
                        if (row.before) {
                          return (
                            <Box
                              sx={{
                                maxHeight: 300,
                                overflow: "hidden",
                                overflowY: "auto",
                                borderRadius: "8px",
                                border: "1px solid var(--elevation-level5)",
                                padding: 2
                              }}
                            >
                              <span
                                className="table-cell-tiptap-editor"
                                dangerouslySetInnerHTML={formatHTML(row.before)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row.field === "Contacto") {
                        if (row.before) {
                          return formatPhoneNumber(row.before)
                        }
                      }

                      return row.before ? (
                        row.before
                      ) : (
                        <Typography variant="p" component="p" color="var(--outline)">
                          Sem valor
                        </Typography>
                      )
                    }
                  },
                  {
                    id: "after",
                    label: "Depois",
                    align: "left",
                    sortable: true,
                    renderComponent: ({ row }) => {
                      if (row.field === "Descrição") {
                        if (row.after) {
                          return (
                            <Box
                              sx={{
                                maxHeight: 300,
                                overflow: "hidden",
                                overflowY: "auto",
                                borderRadius: "8px",
                                border: "1px solid var(--elevation-level5)",
                                padding: 2
                              }}
                            >
                              <span
                                className="table-cell-tiptap-editor"
                                dangerouslySetInnerHTML={formatHTML(row.after)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row.field === "Contacto") {
                        if (row.after) {
                          return formatPhoneNumber(row.after)
                        }
                      }

                      return row.after ? (
                        row.after
                      ) : (
                        <Typography variant="p" component="p" color="var(--outline)">
                          Sem valor
                        </Typography>
                      )
                    }
                  },
                  {
                    id: "changed",
                    label: "Alterado",
                    align: "left",
                    sortable: true,
                    renderComponent: ({ row }) => (
                      <>{row.changed ? <Check color="success" /> : <Close color="error" />}</>
                    )
                  }
                ],
                []
              )

              return (
                <Box
                  sx={{
                    border: "1px solid var(--elevation-level5)",
                    borderRadius: 2,
                    overflow: "hidden",
                    margin: 3
                  }}
                >
                  <Table
                    data={row.details ?? []}
                    columns={interactionsHistoryDetailsTableColumns}
                  />
                </Box>
              )
            },
          []
        )

        return (
          <Stack sx={{ margin: 3, gap: 3 }}>
            <Box
              sx={{
                border: "1px solid var(--elevation-level5)",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <HeaderSection
                title="Contactos"
                description="Contactos do cliente"
                icon={<Phone />}
              />
              <Table mode="datatable" data={row.contacts ?? []} columns={contactsTableColumns} />
            </Box>
            <Box
              sx={{
                border: "1px solid var(--elevation-level5)",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <HeaderSection title="Moradas" description="Moradas do cliente" icon={<Place />} />
              <Table mode="datatable" data={row.addresses ?? []} columns={addressesTableColumns} />
            </Box>
            {role !== "Funcionário" && (
              <Box
                sx={{
                  border: "1px solid var(--elevation-level5)",
                  borderRadius: 2,
                  overflow: "hidden"
                }}
              >
                <HeaderSection
                  title="Histórico de Atividades"
                  description="Histórico de atividades sobre os clientes"
                  icon={<History />}
                />
                <Table
                  mode="datatable"
                  data={row.interactions_history ?? []}
                  columns={interactionsHistoryTableColumns}
                  ExpandableContentComponent={ExpandableClientsInteractionsHistoryTableContent}
                />
              </Box>
            )}
          </Stack>
        )
      },
    []
  )

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3 }}>
        <Loadable
          isLoading={isClientsLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table
              mode="datatable"
              data={clients ?? []}
              columns={clientsTableColumns}
              ExpandableContentComponent={ExpandableClientsTableContent}
            />
          }
        />
        <Modal
          mode="delete"
          title="Eliminar Cliente"
          open={deleteClientModal.isOpen}
          onClose={closeDeleteClientModal}
          onSubmit={handleDeleteClient}
          description="Tem a certeza que deseja eliminar este cliente?"
          subDescription="Ao eliminar este cliente, todos os dados relacionados, incluindo contactos, moradas, equipamentos e reparações associadas, serão removidos de forma permanente."
        />
      </Box>
    </Paper>
  )
}

export default ClientTable
