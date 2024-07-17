import React, { useState, useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
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
  TextField,
  InputAdornment,
  Skeleton,
  Typography
} from "@mui/material"

import { HeaderSection, Loadable, Select, RichEditor, Caption } from "@components/ui"
import { Construction } from "@mui/icons-material"

import { showSuccessToast, showErrorToast } from "@config/toast"

import { sanitizeHTML } from "@utils/sanitizeHTML"

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
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm({
    resolver: zodResolver(updateRepairSchema)
  })

  const initialValues = {
    typeId: repair?.[0]?.type?.id || "",
    brandId: repair?.[0]?.brand?.id || "",
    modelId: repair?.[0]?.model?.id || "",
    sn: repair?.[0]?.sn || "",
    description: repair?.[0]?.description || ""
  }

  const isFormUnchanged = () => {
    const values = watch()
    return (
      values.typeId === initialValues.typeId &&
      values.brandId === initialValues.brandId &&
      values.modelId === initialValues.modelId &&
      values.sn === initialValues.sn &&
      (sanitizeHTML(values.description) === "" ? "" : values.description) ===
        initialValues.description
    )
  }

  useEffect(() => {
    if (isRepairFinished && repair && repair[0]) {
      reset(initialValues)
    }
  }, [isRepairFinished, repair])

  const {
    findAllEntryAccessories,
    findAllEntryReportedIssues,
    findAllInterventionWorksDone,
    findAllInterventionAccessoriesUsed,
    updateRepair
  } = useRepair()

  const onSubmit = async (data) => {
    if (!isRepairFinished || isFormUnchanged()) return

    /*     await updateRepair
      .mutateAsync({
        repairId: repair[0].id,
        ...data,
        description: sanitizeHTML(data.description) === "" ? null : data.description
      })
      .then(() => showSuccessToast("Equipamento atualizado com sucesso!"))
      .catch((error) => {
        if (error.error.code === "EQU-008") {
          setError("sn", {
            type: "manual",
            message: "Número de série já existente"
          })
          return
        }

        showErrorToast("Erro ao atualizar equipamento!")
      }) */
  }

  return (
    <Paper elevation={1}>
      <HeaderSection
        title="Detalhes"
        description="Dados da entrada e da intervenção da reparação"
        icon={<Construction />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ paddingTop: 1, gap: 2 }}>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="repair-tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ paddingInline: 3 }}
            >
              <Tab label="Entrada" disableRipple {...tabProps("Entrada")} />
              <Tab label="Intervenção" disableRipple {...tabProps("Intervenção")} />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Typography>Ola</Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Typography>Olas</Typography>
            </TabPanel>
          </Box>
          <Box sx={{ margin: 3, marginLeft: "auto", marginTop: 1 }}>
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
