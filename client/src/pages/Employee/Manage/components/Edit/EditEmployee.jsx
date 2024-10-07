import React, { Suspense } from "react"

import { useParams } from "react-router-dom"

import { useAuth } from "@contexts/auth"

import { BASE_URL } from "@api"
import { useUser } from "@hooks/server/useUser"

import { Stack, Alert, Paper, Skeleton, Typography, Grid } from "@mui/material"
import { AccountBox } from "@mui/icons-material"

import { PageLoader, HeaderSection, Loadable, Avatar } from "@components/ui"
import { EmployeeRoleForm, EmployeeStatusForm } from "./components"

import { formatPhoneNumber } from "@utils/format/phone"

import { motion } from "framer-motion"

const EditEmployee = () => {
  const { employeeId } = useParams()

  const { id, role } = useAuth()

  const { findEmployeeByUserId } = useUser()
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError
  } = findEmployeeByUserId(employeeId)

  const isUserFinished = !isUserLoading && !isUserError && user

  const canEdit =
    (role === "Chefe" || (role === "Administrador" && user?.user.role === "Funcionário")) &&
    Number(employeeId) !== id

  const userFields = [
    { label: "User", value: user?.user },
    { label: "E-mail", value: user?.user.email },
    { label: "Nome", value: user?.name },
    { label: "Contacto", value: formatPhoneNumber(user?.phone_number) },
    { label: "País", value: user?.country },
    { label: "Cidade", value: user?.city },
    { label: "Localidade", value: user?.locality },
    { label: "Endereço", value: user?.address },
    { label: "Código Postal", value: user?.postal_code }
  ]

  return (
    <Suspense fallback={<PageLoader />}>
      <Stack sx={{ marginTop: 3, gap: 3 }}>
        {!canEdit && isUserFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: "sticky", top: 16, zIndex: 1 }}
          >
            <Alert severity="error" elevation={1} sx={{ width: "100%" }}>
              Não tem permissão para editar este utilizador!
            </Alert>
          </motion.div>
        )}
        {isUserError && userError.error.code === "USR-003" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: "sticky", top: 16, zIndex: 1 }}
          >
            <Alert severity="error" elevation={1} sx={{ width: "100%" }}>
              Funcionário não encontrado!
            </Alert>
          </motion.div>
        )}
        <Stack sx={{ gap: 3 }}>
          <Paper elevation={1}>
            <HeaderSection
              title="Detalhes"
              description="Utilizador, email, nome, contacto... do funcionário"
              icon={<AccountBox />}
            />
            <Grid container spacing={2} sx={{ paddingInline: 3, paddingBottom: 3 }}>
              {userFields.map((field, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Loadable
                    isLoading={!isUserFinished || !canEdit}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <Stack>
                        {field.label === "User" ? (
                          field.value ? (
                            <Stack
                              sx={{
                                flexDirection: "row",
                                justifyContent: "",
                                alignItems: "center",
                                gap: 1
                              }}
                            >
                              <Avatar
                                alt={isUserFinished ? "Avatar de utilizador" : field.value.username}
                                src={
                                  isUserFinished
                                    ? `${BASE_URL}/users/${field.value.id}/avatar?size=80`
                                    : ""
                                }
                                name={isUserFinished ? field.value.username : ""}
                              />
                              <Stack
                                sx={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis"
                                }}
                              >
                                <Typography variant="p" component="p" fontWeight={500}>
                                  {field.value.username}
                                </Typography>
                                <Typography variant="p" component="p" color="var(--outline)">
                                  {field.value.role}
                                </Typography>
                              </Stack>
                            </Stack>
                          ) : (
                            <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                              Sem valor
                            </Typography>
                          )
                        ) : (
                          <>
                            <Typography
                              variant="p"
                              component="p"
                              sx={{ color: "var(--outline)", fontWeight: 550 }}
                            >
                              {field.label}
                            </Typography>
                            {field.value ? (
                              <Typography variant="p" component="p">
                                {field.value}
                              </Typography>
                            ) : (
                              <Typography
                                variant="p"
                                component="p"
                                sx={{ color: "var(--outline)" }}
                              >
                                Sem valor
                              </Typography>
                            )}
                          </>
                        )}
                      </Stack>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
          <EmployeeRoleForm user={user} isUserFinished={isUserFinished && canEdit} />
          <EmployeeStatusForm user={user} isUserFinished={isUserFinished && canEdit} />
        </Stack>
      </Stack>
    </Suspense>
  )
}

export default EditEmployee
