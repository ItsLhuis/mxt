import React, { useState, useMemo } from "react"

import { BASE_URL } from "@api"
import { useRepair } from "@hooks/server/useRepair"

import { Stack, Paper, Box, Typography, Divider, Tooltip, IconButton } from "@mui/material"
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
import { RepairInterventionAccessoryUsedEditModal } from "."

import { showSuccessToast, showErrorToast } from "@config/toast"

import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"

const RepairInterventionAccessoryUsedTable = () => {
  const { findAllInterventionAccessoriesUsed, deleteInterventionAccessoryUsed } = useRepair()
  const { data: interventionAccessoriesUsed, isLoading: isInterventionAccessoriesUsedLoading } =
    findAllInterventionAccessoriesUsed

  const [editRepairInterventionAccessoryUsedModal, setEditRepairInterventionAccessoryUsedModal] =
    useState({
      isOpen: false,
      interventionAccessoryUsed: null
    })
  const openEditRepairInterventionAccessoryUsedModal = (interventionAccessoryUsed) => {
    setEditRepairInterventionAccessoryUsedModal({
      isOpen: true,
      interventionAccessoryUsed: interventionAccessoryUsed
    })
  }
  const closeEditRepairInterventionAccessoryUsedModal = () => {
    setEditRepairInterventionAccessoryUsedModal({ isOpen: false, interventionAccessoryUsed: null })
  }

  const [
    deleteRepairInterventionAccessoryUsedModal,
    setDeleteRepairInterventionAccessoryUsedModal
  ] = useState({
    isOpen: false,
    interventionAccessoryUsedId: null
  })
  const openDeleteRepairInterventionAccessoryUsedModal = (id) => {
    setDeleteRepairInterventionAccessoryUsedModal({ isOpen: true, interventionAccessoryUsedId: id })
  }
  const closeDeleteRepairInterventionAccessoryUsedModal = () => {
    setDeleteRepairInterventionAccessoryUsedModal({
      isOpen: false,
      interventionAccessoryUsedId: null
    })
  }

  const handleDeleteRepairInterventionAccessoryUsed = () => {
    return new Promise((resolve, reject) => {
      if (deleteRepairInterventionAccessoryUsedModal.interventionAccessoryUsedId) {
        deleteInterventionAccessoryUsed
          .mutateAsync({
            interventionAccessoryUsedId:
              deleteRepairInterventionAccessoryUsedModal.interventionAccessoryUsedId
          })
          .then(() => {
            showSuccessToast("Acessório da intervenção eliminado com sucesso!")
            closeDeleteRepairInterventionAccessoryUsedModal()
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "REP-020") {
              closeDeleteRepairInterventionAccessoryUsedModal()
              showErrorToast(
                "Este acessório da intervenção está associado a uma ou mais reparações e não pode ser eliminado!",
                { duration: 6000 }
              )
              reject()
              return
            }

            closeDeleteRepairInterventionAccessoryUsedModal()
            showErrorToast("Erro ao eliminar acessório da intervenção")
            reject()
          })
      } else {
        closeDeleteRepairInterventionAccessoryUsedModal()
        reject()
      }
    })
  }

  const interventionAccessoriesUsedTableColumns = useMemo(
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
                  onClick: () => openEditRepairInterventionAccessoryUsedModal(row)
                },
                {
                  label: "Eliminar",
                  icon: <Delete fontSize="small" color="error" />,
                  color: "error",
                  divider: true,
                  onClick: () => openDeleteRepairInterventionAccessoryUsedModal(row?.id)
                }
              ]}
            />
          </ButtonDropDownSelect>
        )
      }
    ],
    []
  )

  const interventionAccessoriesUsedTableExportColumns = useMemo(
    () => [
      {
        id: "name",
        label: "Acessório da intervenção"
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
          isLoading={isInterventionAccessoriesUsedLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table
              mode="datatable"
              data={interventionAccessoriesUsed ?? []}
              columns={interventionAccessoriesUsedTableColumns}
              exportFileName="acessorios_intervencao_reparacao"
              exportColumns={interventionAccessoriesUsedTableExportColumns}
            />
          }
        />
        <RepairInterventionAccessoryUsedEditModal
          interventionAccessoryUsed={
            editRepairInterventionAccessoryUsedModal.interventionAccessoryUsed
          }
          open={editRepairInterventionAccessoryUsedModal.isOpen}
          onClose={closeEditRepairInterventionAccessoryUsedModal}
        />
        <Modal
          mode="delete"
          title="Eliminar Acessório da Intervenção"
          open={deleteRepairInterventionAccessoryUsedModal.isOpen}
          onClose={closeDeleteRepairInterventionAccessoryUsedModal}
          onSubmit={handleDeleteRepairInterventionAccessoryUsed}
          description="Tem a certeza que deseja eliminar este acessório da intervenção?"
          subDescription="Ao eliminar este acessório da intervenção, os dados serão removidos de forma permanente."
        />
      </Box>
    </Paper>
  )
}

export default RepairInterventionAccessoryUsedTable
