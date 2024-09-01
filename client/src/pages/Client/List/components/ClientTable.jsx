import React, { useState, useMemo } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useClient } from "@hooks/server/useClient"

import { Link } from "react-router-dom"
import { Stack, Paper, Box, Typography, Divider, Tooltip, IconButton } from "@mui/material"
import {
  MoreVert,
  Edit,
  Delete,
  Phone,
  Place,
  Computer,
  History,
  Check,
  Close
} from "@mui/icons-material"

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

import { formatHTML } from "@utils/format/formatHTML"
import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"
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
        renderComponent: ({ row }) => (
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Link to={`/client/${row?.id}`}>{row?.name}</Link>
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
                  onClick: () => navigate(`/client/${row?.id}`)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openDeleteClientModal(row?.id)
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

  const clientsTableExportColumns = useMemo(
    () => [
      {
        id: "name",
        label: "Cliente"
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
            }
          ],
          []
        )

        const contactsTableExportColumns = useMemo(
          () => [
            {
              id: "client",
              label: "Cliente",
              formatter: () => row?.name
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
            }
          ],
          []
        )

        const addressesTableExportColumns = useMemo(
          () => [
            {
              id: "client",
              label: "Cliente",
              formatter: () => row?.name
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
          []
        )

        const equipmentsTableColumns = useMemo(
          () => [
            {
              id: "type.name",
              label: "Tipo",
              align: "left",
              sortable: true,
              renderComponent: ({ row }) => (
                <Link to={`/equipment/${row?.id}`}>{row?.type?.name}</Link>
              )
            },
            {
              id: "brand.name",
              label: "Marca ",
              align: "left",
              sortable: true,
              renderComponent: ({ row }) => (
                <Link to={`/equipment/${row?.id}`}>{row?.brand?.name}</Link>
              )
            },
            {
              id: "model.name",
              label: "Modelo",
              align: "left",
              sortable: true,
              renderComponent: ({ row }) => (
                <Link to={`/equipment/${row?.id}`}>{row?.model?.name}</Link>
              )
            },
            {
              id: "sn",
              label: "Número de série",
              align: "left",
              sortable: true,
              renderComponent: ({ row }) => <Link to={`/equipment/${row?.id}`}>{row?.sn}</Link>
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
                              {row?.created_by_user.username}
                            </Typography>
                            <Typography variant="p" component="p" color="var(--outline)">
                              {row?.created_by_user.role}
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
            }
          ],
          []
        )

        const equipmentsTableExportColumns = useMemo(
          () => [
            {
              id: "client",
              label: "Cliente",
              formatter: () => row?.name
            },
            {
              id: "type.name",
              label: "Tipo"
            },
            {
              id: "brand.name",
              label: "Marca"
            },
            {
              id: "model.name",
              label: "Modelo"
            },
            {
              id: "sn",
              label: "Número de série"
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
              visible: false
            },
            {
              id: "created_at_datetime",
              label: "Responsável",
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
                      {!row?.responsible_user ? (
                        <Typography variant="p" component="p" color="var(--outline)">
                          Utilizador removido
                        </Typography>
                      ) : (
                        <>
                          <Avatar
                            alt={row?.responsible_user?.username}
                            src={`${BASE_URL}/users/${row?.responsible_user?.id}/avatar?size=80`}
                            name={row?.responsible_user?.username}
                          />
                          <Stack
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            <Typography variant="p" component="p" fontWeight={500}>
                              {row?.responsible_user?.username}
                            </Typography>
                            <Typography variant="p" component="p" color="var(--outline)">
                              {row?.responsible_user?.role}
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
                      if (row?.field === "Descrição") {
                        if (row?.before) {
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
                                dangerouslySetInnerHTML={formatHTML(row?.before)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row?.field === "Contacto") {
                        if (row?.before) {
                          return formatPhoneNumber(row?.before)
                        }
                      }

                      return row?.before ? (
                        row?.before
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
                      if (row?.field === "Descrição") {
                        if (row?.after) {
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
                                dangerouslySetInnerHTML={formatHTML(row?.after)}
                              />
                            </Box>
                          )
                        }
                      }

                      if (row?.field === "Contacto") {
                        if (row?.after) {
                          return formatPhoneNumber(row?.after)
                        }
                      }

                      return row?.after ? (
                        row?.after
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
                      <>{row?.changed ? <Check color="success" /> : <Close color="error" />}</>
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
                    data={row?.details ?? []}
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
              <Table
                mode="datatable"
                data={row?.contacts ?? []}
                columns={contactsTableColumns}
                exportFileName="contactos_cliente"
                exportColumns={contactsTableExportColumns}
              />
            </Box>
            <Box
              sx={{
                border: "1px solid var(--elevation-level5)",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <HeaderSection title="Moradas" description="Moradas do cliente" icon={<Place />} />
              <Table
                mode="datatable"
                data={row?.addresses ?? []}
                columns={addressesTableColumns}
                exportFileName="moradas_cliente"
                exportColumns={addressesTableExportColumns}
              />
            </Box>
            <Box
              sx={{
                border: "1px solid var(--elevation-level5)",
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <HeaderSection
                title="Equipamentos"
                description="Equipamentos do cliente"
                icon={<Computer />}
              />
              <Table
                mode="datatable"
                data={row?.equipments ?? []}
                columns={equipmentsTableColumns}
                exportFileName="equipamentos_cliente"
                exportColumns={equipmentsTableExportColumns}
              />
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
                  description="Histórico de atividades sobre o cliente"
                  icon={<History />}
                />
                <Table
                  mode="datatable"
                  data={row?.interactions_history ?? []}
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
              exportFileName="clientes"
              exportColumns={clientsTableExportColumns}
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
