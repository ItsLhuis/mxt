import React, { useState, useMemo } from "react"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useEquipment } from "@hooks/server/useEquipment"

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
import { EquipmentModelEditModal } from "."

import { showSuccessToast, showErrorToast } from "@config/toast"

import { formatDateTimeExportExcel, formatDate, formatTime } from "@utils/format/date"

const EquipmentModelTable = () => {
  const { role } = useAuth()

  const { findAllEquipmentModels, deleteEquipmentModel } = useEquipment()
  const { data: models, isLoading: isModelsLoading } = findAllEquipmentModels

  const [editEquipmentModelModal, setEditEquipmentModelModal] = useState({
    isOpen: false,
    model: null
  })
  const openEditEquipmentModelModal = (model) => {
    setEditEquipmentModelModal({ isOpen: true, model: model })
  }
  const closeEditEquipmentModelModal = () => {
    setEditEquipmentModelModal({ isOpen: false, model: null })
  }

  const [deleteEquipmentModelModal, setDeleteEquipmentModelModal] = useState({
    isOpen: false,
    modelId: null
  })
  const openDeleteEquipmentModelModal = (id) => {
    setDeleteEquipmentModelModal({ isOpen: true, modelId: id })
  }
  const closeDeleteEquipmentModelModal = () => {
    setDeleteEquipmentModelModal({ isOpen: false, modelId: null })
  }

  const handleDeleteEquipmentModel = () => {
    return new Promise((resolve, reject) => {
      if (deleteEquipmentModelModal.modelId) {
        deleteEquipmentModel
          .mutateAsync({ modelId: deleteEquipmentModelModal.modelId })
          .then(() => {
            showSuccessToast("Modelo eliminado com sucesso!")
            closeDeleteEquipmentModelModal()
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "EQU-011") {
              closeDeleteEquipmentModelModal()
              showErrorToast(
                "Este modelo está associado a um ou mais equipamentos e não pode ser eliminado!",
                { duration: 6000 }
              )
              reject()
              return
            }

            closeDeleteEquipmentModelModal()
            showErrorToast("Erro ao eliminar modelo")
            reject()
          })
      } else {
        closeDeleteEquipmentModelModal()
        reject()
      }
    })
  }

  const modelsTableColumns = useMemo(
    () => [
      {
        id: "brand.name",
        label: "Marca",
        align: "left",
        sortable: true
      },
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
                  onClick: () => openEditEquipmentModelModal(row)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openDeleteEquipmentModelModal(row?.id)
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

  const modelsTableExportColumns = useMemo(
    () => [
      {
        id: "brand.name",
        label: "Marca"
      },
      {
        id: "name",
        label: "Modelo"
      },
      {
        id: "created_by_user.username",
        label: "Criado por"
      },
      {
        id: "created_at_datetime",
        label: "Data de criação",
        formatter: formatDateTimeExportExcel
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
          isLoading={isModelsLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table
              mode="datatable"
              data={models ?? []}
              columns={modelsTableColumns}
              exportFileName="modelos_equipamento"
              exportColumns={modelsTableExportColumns}
            />
          }
        />
        <EquipmentModelEditModal
          model={editEquipmentModelModal.model}
          open={editEquipmentModelModal.isOpen}
          onClose={closeEditEquipmentModelModal}
        />
        <Modal
          mode="delete"
          title="Eliminar Modelo"
          open={deleteEquipmentModelModal.isOpen}
          onClose={closeDeleteEquipmentModelModal}
          onSubmit={handleDeleteEquipmentModel}
          description="Tem a certeza que deseja eliminar este modelo?"
          subDescription="Ao eliminar este modelo, os dados serão removidos de forma permanente."
        />
      </Box>
    </Paper>
  )
}

export default EquipmentModelTable
