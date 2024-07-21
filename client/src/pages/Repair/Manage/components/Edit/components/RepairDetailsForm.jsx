import React, { useState, useEffect } from "react"

import { useForm, useFormState, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateRepairSchema } from "@schemas/repair"

import { useRepair } from "@hooks/server/useRepair"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Stack,
  Tabs,
  Tab,
  FormControl,
  Skeleton,
  Typography,
  Switch
} from "@mui/material"

import {
  HeaderSection,
  Loadable,
  DatePicker,
  Select,
  MultipleSelectCheckmarks,
  RichEditor
} from "@components/ui"
import { Construction } from "@mui/icons-material"

import { showSuccessToast, showErrorToast } from "@config/toast"

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <Box
      sx={{ margin: 3 }}
      role="tabpanel"
      hidden={value !== index}
      id={`repair-tabpanel-${index}`}
      aria-labelledby={`repair-tab-${index}`}
      {...other}
    >
      {children}
    </Box>
  )
}

const tabProps = (index) => {
  return {
    id: `repair-tab-${index}`,
    "aria-controls": `repair-tabpanel-${index}`
  }
}

const RepairDetailsForm = ({ repair, isLoading, isError }) => {
  const isRepairFinished = !isLoading && !isError

  const [tabValue, setTabValue] = useState(0)
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue)
  }

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateRepairSchema)
  })

  const initialValues = {
    statusId: repair?.[0]?.status?.id || "",
    entryDatetime: repair?.[0]?.entry_datetime ? new Date(repair?.[0]?.entry_datetime) : null,
    entryAccessories: repair?.[0]?.entry_accessories?.map((accessory) => accessory.id) || [],
    entryAccessoriesDescription: repair?.[0]?.entry_accessories_description || "",
    entryReportedIssues: repair?.[0]?.entry_reported_issues?.map((issue) => issue.id) || [],
    entryReportedIssuesDescription: repair?.[0]?.entry_reported_issues_description || "",
    entryDescription: repair?.[0]?.entry_description || "",
    interventionWorksDone: repair?.[0]?.intervention_works_done?.map((work) => work.id) || [],
    interventionWorksDoneDescription: repair?.[0]?.intervention_works_done_description || "",
    interventionAccessoriesUsed:
      repair?.[0]?.intervention_accessories_used?.map((accessory) => accessory.id) || [],
    interventionAccessoriesUsedDescription:
      repair?.[0]?.intervention_accessories_used_description || "",
    conclusionDatetime: repair?.[0]?.conclusion_datetime
      ? new Date(repair?.[0]?.conclusion_datetime)
      : null,
    deliveryDatetime: repair?.[0]?.delivery_datetime
      ? new Date(repair?.[0]?.delivery_datetime)
      : null,
    isClientNotified: Boolean(repair?.[0]?.is_client_notified) || false,
    interventionDescription: repair?.[0]?.intervention_description || ""
  }

  const { isDirty } = useFormState({ control })
  const isFormUnchanged = () => {
    return !isDirty
  }

  useEffect(() => {
    if (isRepairFinished && repair && repair[0]) {
      reset(initialValues)
    }
  }, [isRepairFinished, repair])

  const {
    findAllRepairStatuses,
    findAllEntryAccessories,
    findAllEntryReportedIssues,
    findAllInterventionWorksDone,
    findAllInterventionAccessoriesUsed,
    updateRepair
  } = useRepair()

  const onSubmit = async (data) => {
    if (!isRepairFinished || isFormUnchanged()) return

    await updateRepair
      .mutateAsync({
        repairId: repair[0].id,
        ...data,
        entryAccessoriesDescription:
          data.entryAccessoriesDescription === "" ? null : data.entryAccessoriesDescription,
        entryReportedIssuesDescription:
          data.entryReportedIssuesDescription === "" ? null : data.entryReportedIssuesDescription,
        entryDescription: data.entryDescription === "" ? null : data.entryDescription,
        interventionWorksDoneDescription:
          data.interventionWorksDoneDescription === ""
            ? null
            : data.interventionWorksDoneDescription,
        interventionAccessoriesUsedDescription:
          data.interventionAccessoriesUsedDescription === ""
            ? null
            : data.interventionAccessoriesUsedDescription,
        interventionDescription:
          data.interventionDescription === "" ? null : data.interventionDescription
      })
      .then(() => showSuccessToast("Reparação atualizada com sucesso!"))
      .catch((error) => {
        if (error.error.code === "EQU-008") {
          setError("sn", {
            type: "manual",
            message: "Número de série já existente"
          })
          return
        }

        showErrorToast("Erro ao atualizar reparação!")
      })
  }

  const watchClientNotified = useWatch({ control, name: "isClientNotified" })

  return (
    <Paper elevation={1}>
      <HeaderSection title="Detalhes" description="Dados da reparação" icon={<Construction />} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Stack>
            <Stack sx={{ padding: 3, paddingBottom: 0 }}>
              <Loadable
                isLoading={!isRepairFinished || findAllRepairStatuses.isLoading}
                LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                LoadedComponent={
                  <FormControl fullWidth>
                    <Controller
                      name="statusId"
                      control={control}
                      defaultValue=""
                      render={({ field }) => {
                        const equipmentStatuses = findAllRepairStatuses.data ?? []
                        const statusNames = ["", ...equipmentStatuses.map((item) => item.name)]

                        const selectedId =
                          equipmentStatuses.find((item) => item.id === field.value)?.name || ""

                        return (
                          <Select
                            ref={field.ref}
                            label="Estado"
                            data={statusNames}
                            value={selectedId}
                            onChange={(selectedName) => {
                              const selectedItem = equipmentStatuses.find(
                                (item) => item.name === selectedName
                              )
                              field.onChange(selectedItem?.id || "")
                            }}
                            error={!!errors.statusId}
                            helperText={errors.statusId?.message}
                          />
                        )
                      }}
                    />
                  </FormControl>
                }
              />
            </Stack>
            <Box
              sx={{
                border: "2px solid var(--elevation-level5)",
                borderRadius: 2,
                margin: 3
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="repair-tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ borderBottom: "2px solid var(--elevation-level5)", paddingInline: 3 }}
              >
                <Tab label="Entrada" {...tabProps("Entrada")} />
                <Tab label="Intervenção" {...tabProps("Intervenção")} />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <Stack sx={{ gap: 2 }}>
                  <Loadable
                    isLoading={!isRepairFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <Controller
                        name="entryDatetime"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            label="Data de entrada"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.entryDatetime}
                            helperText={errors.entryDatetime?.message}
                            InputLabelProps={{ shrink: getValues("entryDatetime")?.length > 0 }}
                          />
                        )}
                      />
                    }
                  />
                  <Loadable
                    isLoading={!isRepairFinished || findAllEntryAccessories.isLoading}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <Controller
                          name="entryAccessories"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => {
                            const repairEntryAccessories = findAllEntryAccessories.data ?? []
                            const entryAccessoryNames = repairEntryAccessories.map((item) => ({
                              id: item.id,
                              name: item.name
                            }))

                            return (
                              <MultipleSelectCheckmarks
                                label="Acessórios"
                                data={entryAccessoryNames}
                                selectedIds={field.value}
                                onChange={(selectedIds) => {
                                  field.onChange(selectedIds)
                                }}
                                error={!!errors.entryAccessories}
                                helperText={errors.entryAccessories?.message}
                              />
                            )
                          }}
                        />
                      </FormControl>
                    }
                  />
                  <Controller
                    name="entryAccessoriesDescription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RichEditor
                        label="Descrição dos acessórios"
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={!isRepairFinished}
                      />
                    )}
                  />
                  <Loadable
                    isLoading={!isRepairFinished || findAllEntryReportedIssues.isLoading}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <Controller
                          name="entryReportedIssues"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => {
                            const repairReportedIssues = findAllEntryReportedIssues.data ?? []
                            const reportedIssueNames = repairReportedIssues.map((item) => ({
                              id: item.id,
                              name: item.name
                            }))

                            return (
                              <MultipleSelectCheckmarks
                                label="Problemas reportados"
                                data={reportedIssueNames}
                                selectedIds={field.value}
                                onChange={(selectedIds) => {
                                  field.onChange(selectedIds)
                                }}
                                error={!!errors.entryReportedIssues}
                                helperText={errors.entryReportedIssues?.message}
                              />
                            )
                          }}
                        />
                      </FormControl>
                    }
                  />
                  <Controller
                    name="entryReportedIssuesDescription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RichEditor
                        label="Descrição dos problemas reportados"
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={!isRepairFinished}
                      />
                    )}
                  />
                  <Controller
                    name="entryDescription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RichEditor
                        label="Descrição da entrada"
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={!isRepairFinished}
                      />
                    )}
                  />
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Stack sx={{ gap: 2 }}>
                  <Loadable
                    isLoading={!isRepairFinished || findAllInterventionWorksDone.isLoading}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <Controller
                          name="interventionWorksDone"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => {
                            const repairInterventionWorksDone =
                              findAllInterventionWorksDone.data ?? []
                            const interventionWorkNames = repairInterventionWorksDone.map(
                              (item) => ({
                                id: item.id,
                                name: item.name
                              })
                            )

                            return (
                              <MultipleSelectCheckmarks
                                label="Trabalhos realizados"
                                data={interventionWorkNames}
                                selectedIds={field.value}
                                onChange={(selectedIds) => {
                                  field.onChange(selectedIds)
                                }}
                                error={!!errors.interventionWorksDone}
                                helperText={errors.interventionWorksDone?.message}
                              />
                            )
                          }}
                        />
                      </FormControl>
                    }
                  />
                  <Controller
                    name="interventionWorksDoneDescription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RichEditor
                        label="Descrição dos trabalhos realizados"
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={!isRepairFinished}
                      />
                    )}
                  />
                  <Loadable
                    isLoading={!isRepairFinished || findAllInterventionAccessoriesUsed.isLoading}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <Controller
                          name="interventionAccessoriesUsed"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => {
                            const repairInterventionAccessoriesUsed =
                              findAllInterventionAccessoriesUsed.data ?? []
                            const interventionAccessoryNames =
                              repairInterventionAccessoriesUsed.map((item) => ({
                                id: item.id,
                                name: item.name
                              }))

                            return (
                              <MultipleSelectCheckmarks
                                label="Acessórios usados"
                                data={interventionAccessoryNames}
                                selectedIds={field.value}
                                onChange={(selectedIds) => {
                                  field.onChange(selectedIds)
                                }}
                                error={!!errors.interventionAccessoriesUsed}
                                helperText={errors.interventionAccessoriesUsed?.message}
                              />
                            )
                          }}
                        />
                      </FormControl>
                    }
                  />
                  <Controller
                    name="interventionAccessoriesUsedDescription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RichEditor
                        label="Descrição dos acessórios usados"
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={!isRepairFinished}
                      />
                    )}
                  />
                  <Loadable
                    isLoading={!isRepairFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <Controller
                        name="conclusionDatetime"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            label="Data de conclusão"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.conclusionDatetime}
                            helperText={errors.conclusionDatetime?.message}
                            InputLabelProps={{
                              shrink: getValues("conclusionDatetime")?.length > 0
                            }}
                          />
                        )}
                      />
                    }
                  />
                  <Loadable
                    isLoading={!isRepairFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <Controller
                        name="deliveryDatetime"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            label="Data de entrega"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.deliveryDatetime}
                            helperText={errors.deliveryDatetime?.message}
                            InputLabelProps={{ shrink: getValues("deliveryDatetime")?.length > 0 }}
                          />
                        )}
                      />
                    }
                  />
                  <Loadable
                    isLoading={!isRepairFinished}
                    LoadingComponent={<Skeleton variant="rounded" width="100%" height={52} />}
                    LoadedComponent={
                      <FormControl fullWidth>
                        <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                          <Controller
                            name="isClientNotified"
                            control={control}
                            render={({ field }) => (
                              <Switch
                                edge="start"
                                value={field.value}
                                onChange={field.onChange}
                                defaultChecked={initialValues.isClientNotified}
                              />
                            )}
                          />
                          <Stack>
                            <Typography variant="p" component="p">
                              Cliente notificado
                            </Typography>
                            <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                              {watchClientNotified ? "Sim" : "Não"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </FormControl>
                    }
                  />
                  <Controller
                    name="interventionDescription"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RichEditor
                        label="Descrição da intervenção"
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={!isRepairFinished}
                      />
                    )}
                  />
                </Stack>
              </TabPanel>
            </Box>
          </Stack>
          <Box sx={{ padding: 3, paddingTop: 0, marginLeft: "auto" }}>
            <LoadingButton
              loading={updateRepair.isPending}
              type="submit"
              variant="contained"
              disabled={!isRepairFinished || isFormUnchanged()}
            >
              Atualizar Reparação
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Paper>
  )
}

export default RepairDetailsForm
