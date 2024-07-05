import React, { useState, useMemo } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useUser } from "@hooks/server/useUser"

import { Stack, Paper, Box, Typography, Tooltip, IconButton, Chip } from "@mui/material"
import { MoreVert, Edit, Delete } from "@mui/icons-material"

import {
  Loadable,
  Table,
  TableSkeleton,
  Avatar,
  ButtonDropDownSelect,
  ListButton,
  Modal
} from "@components/ui"

import { formatPhoneNumber } from "@utils/format/phone"

const EmployeeTable = () => {
  const navigate = useNavigate()

  const { id, role } = useAuth()

  const { findAllEmployees, deleteEmployee } = useUser()
  const { data: employees, isLoading: isEmployeesLoading } = findAllEmployees

  const [deleteEmployeeModal, setDeleteEmployeeModal] = useState({ isOpen: false, userId: null })
  const openDeleteClientModal = (id) => {
    setDeleteEmployeeModal({ isOpen: true, userId: id })
  }
  const closeDeleteClientModal = () => {
    setDeleteEmployeeModal({ isOpen: false, userId: null })
  }

  const handleDeleteClient = () => {
    return new Promise((resolve, reject) => {
      if (deleteEmployeeModal.userId) {
        deleteEmployee
          .mutateAsync({ userId: deleteEmployeeModal.userId })
          .then(() => {
            closeDeleteClientModal()
            resolve()
          })
          .catch(() => {
            closeDeleteClientModal()
            reject()
          })
      } else {
        closeDeleteClientModal()
        reject()
      }
    })
  }

  const filteredEmployees = useMemo(
    () => (employees ? employees.filter((emp) => emp.user.id !== id) : []),
    [employees, id]
  )

  console.log(filteredEmployees);

  const employeesTableColumns = useMemo(
    () => [
      {
        id: "user.username",
        label: "Utilizador",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1
            }}
          >
            <Avatar
              alt={row.user.username}
              src={`${BASE_URL}/users/${row.user.id}/avatar?size=80`}
              name={row.user.username}
            />
            <Stack
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              <Typography variant="p" component="p" fontWeight={500}>
                {row.user.username}
              </Typography>
              <Typography variant="p" component="p" color="var(--outline)">
                {row.user.role}
              </Typography>
            </Stack>
          </Stack>
        )
      },
      {
        id: "user.is_active",
        label: "Estado",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) => (
          <>
            {row.user.is_active ? (
              <Chip color="success" label="Ativo" />
            ) : (
              <Chip color="error" label="Inativo" />
            )}
          </>
        )
      },
      {
        id: "name",
        label: "Nome",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.name ? (
            row.name
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "user.email",
        label: "E-mail",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.user.email ? (
            row.user.email
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "phone_number",
        label: "Contacto",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.phone_number ? (
            formatPhoneNumber(row.phone_number)
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "country",
        label: "País",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.country ? (
            row.country
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "city",
        label: "Cidade",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.city ? (
            row.city
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "locality",
        label: "Localidade",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.locality ? (
            row.locality
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "address",
        label: "Morada",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.address ? (
            row.address
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "postal_code",
        label: "Código postal",
        align: "left",
        sortable: true,
        renderComponent: ({ row }) =>
          row.postal_code ? (
            row.postal_code
          ) : (
            <Typography variant="p" component="p" color="var(--outline)">
              Sem valor
            </Typography>
          )
      },
      {
        id: "more_options",
        align: "right",
        sortable: false,
        renderComponent: ({ row }) => {
          if (
            row.user.role !== "Chefe" &&
            !(role === "Administrador" && row.user.role === "Administrador")
          ) {
            return (
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
                      onClick: () => navigate(`/employee/${row.user.id}`)
                    },
                    {
                      label: "Eliminar",
                      icon: <Delete fontSize="small" color="error" />,
                      color: "error",
                      divider: true,
                      onClick: () => openDeleteClientModal(row.user.id)
                    }
                  ]}
                />
              </ButtonDropDownSelect>
            )
          }
          return null
        }
      }
    ],
    []
  )

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3 }}>
        <Loadable
          isLoading={isEmployeesLoading}
          LoadingComponent={<TableSkeleton mode="datatable" />}
          LoadedComponent={
            <Table
              mode="datatable"
              data={filteredEmployees ?? []}
              columns={employeesTableColumns}
            />
          }
        />
        <Modal
          mode="delete"
          title="Eliminar Funcionário"
          open={deleteEmployeeModal.isOpen}
          onClose={closeDeleteClientModal}
          onSubmit={handleDeleteClient}
          description="Tem a certeza que deseja eliminar este funcionário?"
          subDescription="Ao eliminar este funcionário, os dados serão removidos de forma permanente."
        />
      </Box>
    </Paper>
  )
}

export default EmployeeTable
