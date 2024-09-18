import React from "react"

import { useParams } from "react-router-dom"

import { useEmail } from "@hooks/server/useEmail"

import { Link } from "react-router-dom"
import { Paper, Stack, Grid, Box, Typography, Skeleton, Chip } from "@mui/material"
import { Email } from "@mui/icons-material"

import { HeaderSection, Loadable, Caption } from "@components/ui"

import { getValidChipColor } from "@utils/getValidChipColor"
import { formatDateTime } from "@utils/format/date"

const GetEmail = () => {
  const { emailId } = useParams()

  const { findEmailById } = useEmail()
  const { data: email, isLoading: isEmailLoading, isError: isEmailError } = findEmailById(emailId)

  const isEmailFinished = !isEmailLoading && !isEmailError

  const emailFields = [
    {
      label: "De",
      value: email?.[0]?.from
    },
    {
      label: "Para",
      link: `/client/${email?.[0]?.client?.id}`,
      value: `${email?.[0]?.client?.name} </br> ${email?.[0]?.to}`,
      description: email?.[0].client?.description,
      isHtml: true
    },
    {
      label: "Assunto",
      value: email?.[0]?.subject
    }
  ]

  return (
    <Paper elevation={1}>
      <Stack sx={{ marginTop: 3 }}>
        <HeaderSection title="Detalhes" description="Dados do e-mail" icon={<Email />} />
        <Stack sx={{ paddingBottom: 3 }}>
          <Stack sx={{ paddingInline: 3, paddingTop: 2 }}>
            <Loadable
              isLoading={!isEmailFinished}
              LoadingComponent={
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                  <Skeleton variant="rounded" width={80} height={32} />
                  <Skeleton variant="text" width={70} />
                </Stack>
              }
              LoadedComponent={
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                  <Box>
                    <Chip
                      label={email?.[0]?.status?.name}
                      color={getValidChipColor(email?.[0]?.status?.color)}
                    />
                  </Box>
                  <Typography variant="p" component="p">
                    {email?.[0]?.sent_at_datetime && (
                      <>{formatDateTime(email?.[0]?.sent_at_datetime)}</>
                    )}
                  </Typography>
                </Stack>
              }
            />
            <Grid container spacing={2}>
              {emailFields.map((field, index) => (
                <Grid key={index} item xs={12} md={4}>
                  <Loadable
                    isLoading={!isEmailFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <Stack>
                        <Typography
                          variant="p"
                          component="p"
                          sx={{ color: "var(--outline)", fontWeight: 550 }}
                        >
                          {field.label}
                        </Typography>
                        {field.value ? (
                          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                            <Typography variant="p" component="p">
                              {field.isHtml ? (
                                field.link ? (
                                  <Link
                                    to={field.link}
                                    dangerouslySetInnerHTML={{ __html: field.value }}
                                  />
                                ) : (
                                  <span dangerouslySetInnerHTML={{ __html: field.value }} />
                                )
                              ) : field.link ? (
                                <Link to={field.link}>{field.value}</Link>
                              ) : (
                                <span>{field.value}</span>
                              )}
                            </Typography>
                            {field.description && <Caption title={field.description} />}
                          </Stack>
                        ) : (
                          <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                            Sem valor
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ paddingTop: 3 }}>
              <Loadable
                isLoading={!isEmailFinished}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={535} />}
                LoadedComponent={
                  <Stack>
                    <Typography
                      variant="p"
                      component="p"
                      sx={{ color: "var(--outline)", fontWeight: 550, marginBottom: 0.5 }}
                    >
                      Mensagem
                    </Typography>
                    <iframe
                      title="Mensagem do e-mail"
                      srcDoc={`<html>
                              <head>
                                <style>
                                  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");

                                  * {
                                    box-sizing: border-box;
                                    font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", sans-serif !important;
                                  }

                                  body {
                                    margin: 0;
                                    padding: 0;
                                    overflow: auto;
                                    background-color: rgb(245, 243, 255);
                                  }

                                  ::-webkit-scrollbar-thumb {
                                    background-color: rgb(143, 141, 158);
                                    border: 6px solid transparent;
                                    border-radius: 8px;
                                    background-clip: padding-box;
                                  }

                                  ::-webkit-scrollbar {
                                    cursor: pointer !important;
                                    width: 16px;
                                    height: 16px;
                                  }

                                  ::-webkit-scrollbar-corner {
                                    background-color: transparent;
                                  }

                                  ::-moz-selection {
                                    -webkit-text-fill-color: rgb(228, 225, 230) !important;
                                    color: rgb(228, 225, 230) !important;
                                    background: rgb(88, 101, 242);
                                  }

                                  ::selection {
                                    -webkit-text-fill-color: rgb(228, 225, 230) !important;
                                    color: rgb(228, 225, 230) !important;
                                    background: rgb(88, 101, 242);
                                  }
                                </style>
                              </head>
                              <body>
                                ${
                                  email?.[0]?.html ||
                                  "<p style='margin: 16px; font-size: 13px'>Não foi possível exibir a mensagem.</p>"
                                }
                              </body>
                             </html>`}
                      style={{
                        width: "100%",
                        height: "500px",
                        backgroundColor: "rgb(245, 243, 255)",
                        border: "2px solid var(--elevation-level5)",
                        borderRadius: "8px",
                        overflow: "hidden"
                      }}
                    />
                  </Stack>
                }
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default GetEmail
