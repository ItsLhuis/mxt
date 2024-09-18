import React from "react"

import { useParams } from "react-router-dom"

import { useSms } from "@hooks/server/useSms"

import { Link } from "react-router-dom"
import { Paper, Stack, Grid, Box, Typography, Skeleton, Chip } from "@mui/material"
import { Sms } from "@mui/icons-material"

import { HeaderSection, Loadable, Caption } from "@components/ui"

import { getValidChipColor } from "@utils/getValidChipColor"
import { formatDateTime } from "@utils/format/date"
import { formatPhoneNumber } from "@utils/format/phone"

const GetSms = () => {
  const { smsId } = useParams()

  const { findSmsById } = useSms()
  const { data: sms, isLoading: isSmsLoading, isError: isSmsError } = findSmsById(smsId)

  const isSmsFinished = !isSmsLoading && !isSmsError

  const smsFields = [
    {
      label: "De",
      value: sms?.[0]?.from
    },
    {
      label: "Para",
      link: `/client/${sms?.[0]?.client?.id}`,
      value: `${sms?.[0]?.client?.name} </br> ${formatPhoneNumber(sms?.[0]?.to)}`,
      description: sms?.[0].client?.description,
      isHtml: true
    }
  ]

  return (
    <Paper elevation={1}>
      <Stack sx={{ marginTop: 3 }}>
        <HeaderSection title="Detalhes" description="Dados do SMS" icon={<Sms />} />
        <Stack sx={{ paddingBottom: 3 }}>
          <Stack sx={{ paddingInline: 3, paddingTop: 2 }}>
            <Loadable
              isLoading={!isSmsFinished}
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
                      label={sms?.[0]?.status?.name}
                      color={getValidChipColor(sms?.[0]?.status?.color)}
                    />
                  </Box>
                  <Typography variant="p" component="p">
                    {sms?.[0]?.sent_at_datetime && (
                      <>{formatDateTime(sms?.[0]?.sent_at_datetime)}</>
                    )}
                  </Typography>
                </Stack>
              }
            />
            <Grid container spacing={2}>
              {smsFields.map((field, index) => (
                <Grid key={index} item xs={12} md={6}>
                  <Loadable
                    isLoading={!isSmsFinished}
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
                isLoading={!isSmsFinished}
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
                    <Stack
                      sx={{
                        padding: 2,
                        width: "100%",
                        height: "500px",
                        border: "2px solid var(--elevation-level5)",
                        borderRadius: "8px",
                        overflow: "auto"
                      }}
                    >
                      {sms?.[0]?.message ? (
                        <Typography
                          variant="p"
                          component="p"
                          dangerouslySetInnerHTML={{
                            __html: sms?.[0]?.message.replace(/\n/g, "<br />")
                          }}
                        />
                      ) : (
                        <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                          Não foi possível exibir a mensagem.
                        </Typography>
                      )}
                    </Stack>
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

export default GetSms
