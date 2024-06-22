import React, { useMemo } from "react"

import { BASE_URL } from "@api"

import { Box, Stack, Divider, ListItemText, Typography, Tooltip, IconButton } from "@mui/material"
import { Phone, MoreVert, Edit, Delete } from "@mui/icons-material"

import {
  HeaderSection,
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton
} from "@components/ui"

import { formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const ClientContactTable = ({ client, isLoading, isError }) => {
  const isFinished = !isLoading && !isError

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
        formatter: formatPhoneNumber
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
                  onClick: () => console.log(row)
                },
                {
                  label: "Eliminar",
                  icon: <Delete fontSize="small" color="error" />,
                  color: "error",
                  divider: true,
                  onClick: () => console.log(row)
                }
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
      <HeaderSection title="Contactos" description="Contactos do cliente" icon={<Phone />} />
      <Loadable
        isLoading={!isFinished}
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
              data={isFinished ? client[0].contacts : []}
              columns={clientContactsTableColumns}
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
    </Stack>
  )
}

export default ClientContactTable
