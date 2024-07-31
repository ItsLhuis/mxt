import React, { useState, useMemo } from "react"

import { BASE_URL } from "@api"
import { useRepair } from "@hooks/server/useRepair"

import { Stack, Paper, Box, Typography, Divider, Tooltip, IconButton, Chip } from "@mui/material"
import { MoreVert, Edit, Delete } from "@mui/icons-material"

import {
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton,
  Caption,
  Modal
} from "@components/ui"
import { RepairStatusEditModal } from "."

import { showSuccessToast, showErrorToast } from "@config/toast"

import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"

const RepairStatusTable = () => {
  const { findAllRepairStatuses, deleteRepairStatus } = useRepair()
  const { data: statuses, isLoading: isStatusesLoading } = findAllRepairStatuses

  const [editRepairStatusModal, setEditRepairStatusModal] = useState({
    isOpen: false,
    status: null
  })
  const openEditRepairStatusModal = (status) => {
    setEditRepairStatusModal({ isOpen: true, status: status })
  }
  const closeEditRepairStatusModal = () => {
    setEditRepairStatusModal({ isOpen: false, status: null })
  }

  const [deleteRepairStatusModal, setDeleteRepairStatusModal] = useState({
    isOpen: false,
    statusId: null
  })
  const openDeleteRepairStatusModal = (id) => {
    setDeleteRepairStatusModal({ isOpen: true, statusId: id })
  }
  const closeDeleteRepairStatusModal = () => {
    setDeleteRepairStatusModal({ isOpen: false, statusId: null })
  }

  const handleDeleteRepairStatus = () => {
    return new Promise((resolve, reject) => {
      if (deleteRepairStatusModal.statusId) {
        deleteRepairStatus
          .mutateAsync({ statusId: deleteRepairStatusModal.statusId })
          .then(() => {
            showSuccessToast("Estado eliminado com sucesso!")
            closeDeleteRepairStatusModal()
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "REP-008") {
              closeDeleteRepairStatusModal()
              showErrorToast(
                "Este estado está associado a uma ou mais reparações e não pode ser eliminado!",
                { duration: 6000 }
              )
              reject()
              return
            }

            closeDeleteRepairStatusModal()
            showErrorToast("Erro ao eliminar estado")
            reject()
          })
      } else {
        closeDeleteRepairStatusModal()
        reject()
      }
    })
  }

  const statusesTableColumns = useMemo(
    () => [
      {
        id: "name",
        label: "Nome",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            {row?.name}
            {row?.description && <Caption fontSize="small" title={row?.description} />}
          </Stack>
        )
      },
      {
        id: "color",
        label: "Cor",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Chip color={row.color} sx={{ borderRadius: "50% !important", width: 20, height: 20 }} />
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
                  onClick: () => openEditRepairStatusModal(row)
                },
                {
                  label: "Eliminar",
                  icon: <Delete fontSize="small" color="error" />,
                  color: "error",
                  divider: true,
                  onClick: () => openDeleteRepairStatusModal(row?.id)
                }
              ]}
            />
          </ButtonDropDownSelect>
        )
      }
    ],
    []
  )

  const statusesTableExportColumns = useMemo(
    () => [
      {
        id: "name",
        label: "Estado"
      },
      {
        id: "color",
        label: "Cor",
        color: (value) => value,
        formatter: () => ""
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

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3 }}>
        <Loadable
          isLoading={isStatusesLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table
              mode="datatable"
              data={statuses ?? []}
              columns={statusesTableColumns}
              exportFileName="estados_reparacao"
              exportColumns={statusesTableExportColumns}
            />
          }
        />
        <RepairStatusEditModal
          status={editRepairStatusModal.status}
          open={editRepairStatusModal.isOpen}
          onClose={closeEditRepairStatusModal}
        />
        <Modal
          mode="delete"
          title="Eliminar Estado"
          open={deleteRepairStatusModal.isOpen}
          onClose={closeDeleteRepairStatusModal}
          onSubmit={handleDeleteRepairStatus}
          description="Tem a certeza que deseja eliminar este estado?"
          subDescription="Ao eliminar este estado, os dados serão removidos de forma permanente."
        />
      </Box>
    </Paper>
  )
}

export default RepairStatusTable
