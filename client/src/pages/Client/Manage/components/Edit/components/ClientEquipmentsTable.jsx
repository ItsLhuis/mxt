import React, { useMemo } from "react"

import { BASE_URL } from "@api"

import { Link } from "react-router-dom"
import { Box, Stack, Paper, Divider, Typography } from "@mui/material"
import { Computer } from "@mui/icons-material"

import { HeaderSection, Loadable, Table, TableSkeleton, Avatar } from "@components/ui"

import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"

const ClientEquipmentsTable = ({ client, isLoading, isError }) => {
  const isClientFinished = !isLoading && !isError

  const clientEquipmentsTableColumns = useMemo(
    () => [
      {
        id: "type.name",
        label: "Tipo",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => <Link to={`/equipment/${row?.id}`}>{row?.type?.name}</Link>
      },
      {
        id: "brand.name",
        label: "Marca ",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => <Link to={`/equipment/${row?.id}`}>{row?.brand?.name}</Link>
      },
      {
        id: "model.name",
        label: "Modelo",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => <Link to={`/equipment/${row?.id}`}>{row?.model?.name}</Link>
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

  const clientEquipmentsTableExportColumns = useMemo(
    () => [
      {
        id: "client",
        label: "Cliente",
        formatter: () => client?.[0]?.name
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
    [client]
  )

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Equipamentos"
        description="Equipamentos do cliente"
        icon={<Computer />}
      />
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
              data={isClientFinished ? client[0].equipments : []}
              columns={clientEquipmentsTableColumns}
              exportFileName="equipamentos_cliente"
              exportColumns={clientEquipmentsTableExportColumns}
            />
          </Box>
        }
      />
    </Paper>
  )
}

export default ClientEquipmentsTable
