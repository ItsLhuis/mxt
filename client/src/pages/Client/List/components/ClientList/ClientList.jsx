import React from "react"

import { BASE_URL } from "@api"
import { useClients } from "@hooks/server/useClients"

import { Stack, Paper, Box, Typography, ListItemText, Divider } from "@mui/material"

import { Loadable, Table, TableSkeleton, Avatar } from "@components/ui"

import { formatDate, formatTime } from "@utils/format/date"

const ClientList = () => {
  const { findAllClients } = useClients()
  const { data: clients, isLoading: isClientsLoading } = findAllClients

  const tableColumns = [
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

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3, paddingBlock: 3 }}>
        <Loadable
          isLoading={isClientsLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={<Table mode="datatable" data={clients ?? []} columns={tableColumns} />}
        />
      </Box>
    </Paper>
  )
}

export default ClientList
