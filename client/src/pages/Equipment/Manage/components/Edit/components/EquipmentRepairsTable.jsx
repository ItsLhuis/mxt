import React, { useMemo } from "react"

import { BASE_URL } from "@api"

import { Link } from "react-router-dom"
import { Box, Stack, Paper, Divider, Typography, Chip } from "@mui/material"
import { Construction, Check, Close } from "@mui/icons-material"

import { HeaderSection, Loadable, Table, TableSkeleton, Avatar } from "@components/ui"

import { getValidChipColor } from "@utils/getValidChipColor"
import {
  formatDateTimeExportExcel,
  formatDateTime,
  formatDate,
  formatTime
} from "@utils/format/date"

const EquipmentRepairsTable = ({ equipment, isLoading, isError }) => {
  const isEquipmentFinished = !isLoading && !isError

  const equipmentRepairsTableColumns = useMemo(
    () => [
      {
        id: "status.name",
        label: "Estado",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Link to={`/repair/${row?.id}`}>
            <Chip label={row?.status?.name} color={getValidChipColor(row?.status?.color)} />
          </Link>
        )
      },
      {
        id: "entry_datetime",
        label: "Data de entrada",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row?.entry_datetime ? (
              <>{formatDateTime(row?.entry_datetime)}</>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Sem valor
              </Typography>
            )}
          </>
        )
      },
      {
        id: "conclusion_datetime",
        label: "Data de conclusão",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row?.conclusion_datetime ? (
              <>{formatDateTime(row?.conclusion_datetime)}</>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Sem valor
              </Typography>
            )}
          </>
        )
      },
      {
        id: "delivery_datetime",
        label: "Data de entrega",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row?.delivery_datetime ? (
              <>{formatDateTime(row?.delivery_datetime)}</>
            ) : (
              <Typography variant="p" component="p" color="var(--outline)">
                Sem valor
              </Typography>
            )}
          </>
        )
      },
      {
        id: "is_client_notified",
        label: "Cliente notificado",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ alignItems: "flex-start" }}>
            {row?.is_client_notified ? <Check color="success" /> : <Close color="error" />}
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

  const equipmentRepairsTableExportColumns = useMemo(
    () => [
      {
        id: "client",
        label: "Cliente",
        formatter: () => equipment?.[0]?.client?.name
      },
      {
        id: "equipment",
        label: "Equipamento",
        formatter: () =>
          `${equipment?.[0]?.type?.name} - ${equipment?.[0]?.brand?.name} ${equipment?.[0]?.model?.name} (${equipment?.[0]?.sn})`
      },
      {
        id: "status",
        label: "Estado",
        formatter: (value) => value?.name,
        color: (value) => value?.color
      },
      {
        id: "entry_datetime",
        label: "Data de entrada",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "conclusion_datetime",
        label: "Data de conclusão",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "delivery_datetime",
        label: "Data de entrega",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      },
      {
        id: "is_client_notified",
        label: "Cliente notificado",
        formatter: (value) => (value === true ? "Sim" : "Não")
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
    [equipment]
  )

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Reparações"
        description="Reparações do equipamento"
        icon={<Construction />}
      />
      <Loadable
        isLoading={!isEquipmentFinished}
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
              data={isEquipmentFinished ? equipment[0]?.repairs : []}
              columns={equipmentRepairsTableColumns}
              exportFileName="reparacoes_equipamento"
              exportColumns={equipmentRepairsTableExportColumns}
            />
          </Box>
        }
      />
    </Paper>
  )
}

export default EquipmentRepairsTable
