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
import { EquipmentBrandEditModal } from "."

import { showSuccessToast, showErrorToast } from "@config/toast"

import { formatDate, formatTime } from "@utils/format/date"

const EquipmentBrandTable = () => {
  const { role } = useAuth()

  const { findAllEquipmentBrands, deleteEquipmentBrand } = useEquipment()
  const { data: brands, isLoading: isBrandsLoading } = findAllEquipmentBrands

  const [editEquipmentBrandModal, setEditEquipmentBrandModal] = useState({
    isOpen: false,
    brand: null
  })
  const openEditEquipmentTypeModal = (brand) => {
    setEditEquipmentBrandModal({ isOpen: true, brand: brand })
  }
  const closeEditEquipmentTypeModal = () => {
    setEditEquipmentBrandModal({ isOpen: false, brand: null })
  }

  const [deleteEquipmentBrandModal, setDeleteEquipmentBrandModal] = useState({
    isOpen: false,
    brandId: null
  })
  const openDeleteEquipmentBrandModal = (id) => {
    setDeleteEquipmentBrandModal({ isOpen: true, brandId: id })
  }
  const closeDeleteEquipmentBrandModal = () => {
    setDeleteEquipmentBrandModal({ isOpen: false, brandId: null })
  }

  const handleDeleteEquipmentBrand = () => {
    return new Promise((resolve, reject) => {
      if (deleteEquipmentBrandModal.brandId) {
        deleteEquipmentBrand
          .mutateAsync({ brandId: deleteEquipmentBrandModal.brandId })
          .then(() => {
            showSuccessToast("Marca eliminada com sucesso!")
            closeDeleteEquipmentBrandModal()
            resolve()
          })
          .catch((error) => {
            if (error.error.code === "EQU-010") {
              closeDeleteEquipmentBrandModal()
              showErrorToast(
                "Esta marca está associada a um ou mais equipamentos e não pode ser eliminada!",
                { duration: 6000 }
              )
              reject()
              return
            }

            closeDeleteEquipmentBrandModal()
            showErrorToast("Erro ao eliminar marca")
            reject()
          })
      } else {
        closeDeleteEquipmentBrandModal()
        reject()
      }
    })
  }

  const brandsTableColumns = useMemo(
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
                  onClick: () => openEditEquipmentTypeModal(row)
                },
                ...(role !== "Funcionário"
                  ? [
                      {
                        label: "Eliminar",
                        icon: <Delete fontSize="small" color="error" />,
                        color: "error",
                        divider: true,
                        onClick: () => openDeleteEquipmentBrandModal(row?.id)
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

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3 }}>
        <Loadable
          isLoading={isBrandsLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table mode="datatable" data={brands ?? []} columns={brandsTableColumns} />
          }
        />
        <EquipmentBrandEditModal
          brand={editEquipmentBrandModal.brand}
          open={editEquipmentBrandModal.isOpen}
          onClose={closeEditEquipmentTypeModal}
        />
        <Modal
          mode="delete"
          title="Eliminar Marca"
          open={deleteEquipmentBrandModal.isOpen}
          onClose={closeDeleteEquipmentBrandModal}
          onSubmit={handleDeleteEquipmentBrand}
          description="Tem a certeza que deseja eliminar esta marca?"
          subDescription="Ao eliminar esta marca, todos os dados relacionados, incluindo modelos, serão removidos de forma permanente."
        />
      </Box>
    </Paper>
  )
}

export default EquipmentBrandTable
