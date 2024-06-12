import React from "react"

import { BASE_URL } from "@api"
import { useClient } from "@hooks/server/useClient"

import { Stack, Paper, Box, Typography, ListItemText, Divider } from "@mui/material"

import { Loadable, Table, TableSkeleton, Avatar } from "@components/ui"

import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const ClientList = () => {
  const { findAllClients } = useClient()
  const { data: clients, isLoading: isClientsLoading } = findAllClients

  const clientsTableColumns = [
    {
      id: "name",
      label: "Nome",
      align: "left",
      sortable: true,
      renderComponent: ({ row }) => (
        <Typography variant="p" component="p">
          {row.name}
        </Typography>
      )
    },
    {
      id: "description",
      label: "Descrição",
      align: "left",
      sortable: true,
      renderComponent: ({ row }) => (
        <>
          {row.description ? (
            <Typography variant="p" component="p">
              {row.description}
            </Typography>
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem descrição
            </Typography>
          )}
        </>
      )
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
    }
  ]

  const ExpandableClientsTableContent = ({ row }) => {
    const contactsTableColumns = [
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
        id: "description",
        label: "Descrição",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row.description ? (
              <Typography variant="p" component="p">
                {row.description}
              </Typography>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Sem descrição
              </Typography>
            )}
          </>
        )
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
      }
    ]

    const addressesTableColumns = [
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
      }
    ]

    const interactionsHistoryTableColumns = [
      {
        id: "type",
        label: "Atividade",
        align: "left",
        sortable: true
      } /* 
      {
        id: "details",
        label: "Detalhes",
        align: "left",
        sortable: true
      }, */,
      {
        id: "responsible_user",
        label: "Responsável",
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
                alt={row.responsible_user.username}
                src={`${BASE_URL}/users/${row.responsible_user.id}/avatar?size=80`}
                name={row.responsible_user.username}
              />
              <ListItemText
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
      }
    ]

    return (
      <Stack sx={{ color: "var(--onSurface)", margin: 3, gap: 3 }}>
        <ListItemText>
          <Typography variant="h5" component="h5">
            {row.name}
          </Typography>
          {row.description && (
            <Typography
              variant="p"
              component="p"
              style={{
                color: "var(--outline)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "250px",
              }}
            >
              {row.description}
            </Typography>
          )}
        </ListItemText>
        <Box
          sx={{
            border: "1px solid var(--elevation-level5)",
            borderRadius: 2,
            overflow: "hidden",
            paddingBottom: 3
          }}
        >
          <Typography variant="h6" component="h6" margin={3}>
            Contactos
          </Typography>
          <Table mode="datatable" data={row.contacts ?? []} columns={contactsTableColumns} />
        </Box>
        <Box
          sx={{
            border: "1px solid var(--elevation-level5)",
            borderRadius: 2,
            overflow: "hidden",
            paddingBottom: 3
          }}
        >
          <Typography variant="h6" component="h6" margin={3}>
            Moradas
          </Typography>
          <Table mode="datatable" data={row.addresses ?? []} columns={addressesTableColumns} />
        </Box>
        <Box
          sx={{
            border: "1px solid var(--elevation-level5)",
            borderRadius: 2,
            overflow: "hidden",
            paddingBottom: 3
          }}
        >
          <Typography variant="h6" component="h6" margin={3}>
            Histórico de Atividades
          </Typography>
          <Table
            mode="datatable"
            data={row.interactions_history ?? []}
            columns={interactionsHistoryTableColumns}
          />
        </Box>
      </Stack>
    )
  }

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3, paddingBlock: 3 }}>
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
      </Box>
    </Paper>
  )
}

export default ClientList
