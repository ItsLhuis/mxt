import React, { useMemo } from "react"

import { useNavigate } from "react-router-dom"

import { BASE_URL } from "@api"
import { useSms } from "@hooks/server/useSms"

import { Link } from "react-router-dom"
import { Stack, Paper, Box, Typography, Divider, Tooltip, IconButton } from "@mui/material"
import { Visibility } from "@mui/icons-material"

import { Loadable, Table, TableSkeleton, Avatar, Caption } from "@components/ui"

import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const SmsTable = () => {
  const navigate = useNavigate()

  const { findAllSmses } = useSms()
  const { data: smses, isLoading: isSmsesLoading } = findAllSmses

  const smsesTableColumns = useMemo(
    () => [
      {
        id: "client.name",
        label: "Cliente",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Link to={`/client/${row?.client?.id}`}>{row?.client?.name}</Link>
            {row?.client?.description && (
              <Caption title={row?.client?.description} />
            )}
          </Stack>
        )
      },
      {
        id: "to",
        label: "Para",
        align: "left",
        sortable: true,
        formatter: formatPhoneNumber
      },
      {
        id: "message",
        label: "Mensagem",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => <Link to={`/sms/${row?.id}`}>{row?.message}</Link>
      },
      {
        id: "sent_by_user",
        visible: false
      },
      {
        id: "created_at_datetime",
        label: "Enviado por",
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
                {!row?.sent_by_user ? (
                  <Typography variant="p" component="p" color="var(--outline)">
                    Utilizador removido
                  </Typography>
                ) : (
                  <>
                    <Avatar
                      alt={row?.sent_by_user?.username}
                      src={`${BASE_URL}/users/${row?.sent_by_user?.id}/avatar?size=80`}
                      name={row?.sent_by_user?.username}
                    />
                    <Stack
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <Typography variant="p" component="p" fontWeight={500}>
                        {row?.sent_by_user?.username}
                      </Typography>
                      <Typography variant="p" component="p" color="var(--outline)">
                        {row?.sent_by_user?.role}
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
        id: "view_file",
        align: "right",
        sortable: false,
        renderComponent: ({ row }) => (
          <Tooltip title="Ver SMS" sx={{ margin: -1 }}>
            <IconButton onClick={() => navigate(`/sms/${row?.id}`)}>
              <Visibility />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    []
  )

  const smsesTableExportColumns = useMemo(
    () => [
      {
        id: "client.name",
        label: "Cliente"
      },
      {
        id: "to",
        label: "Para",
        formatter: formatPhoneNumber
      },
      {
        id: "message",
        label: "Mensagem"
      },
      {
        id: "sent_by_user.username",
        label: "Enviado por"
      },
      {
        id: "created_at_datetime",
        label: "Data de envio",
        formatter: (value) => (value ? formatDateTimeExportExcel(value) : "")
      }
    ],
    []
  )

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3 }}>
        <Loadable
          isLoading={isSmsesLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table
              mode="datatable"
              data={smses ?? []}
              columns={smsesTableColumns}
              exportFileName="sms"
              exportColumns={smsesTableExportColumns}
            />
          }
        />
      </Box>
    </Paper>
  )
}

export default SmsTable
