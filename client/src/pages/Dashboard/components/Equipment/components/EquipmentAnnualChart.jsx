import React, { useState } from "react"

import { useEquipment } from "@hooks/server/useEquipment"

import { Stack, Box, Skeleton } from "@mui/material"

import { ButtonDropDownSelect, ListButton, HeaderSection, Loadable } from "@components/ui"
import { LineChart } from "@components/ui/Charts"

const EquipmentAnnualChart = () => {
  const [selectedType, setSelectedType] = useState("")

  const { findAllEquipmentTypes } = useEquipment()
  const equipmentTypes = findAllEquipmentTypes.data || []

  const handleTypeChange = (type) => {
    setSelectedType(type)
  }

  const data = [
    {
      name: "Equipamentos",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 400))
    }
  ]

  return (
    <Stack>
      <HeaderSection title="Gráfico Anual" description="Gráfico anual dos equipamentos" />
      <Box sx={{ width: "100%", padding: 3, paddingTop: 0 }}>
        <Stack sx={{ marginTop: 1, flexDirection: "row", justifyContent: "flex-end", gap: 1 }}>
          <Loadable
            isLoading={findAllEquipmentTypes.isLoading}
            LoadingComponent={<Skeleton variant="rounded" width={87} height={40} />}
            LoadedComponent={
              <ButtonDropDownSelect title={"2024"}>
                <ListButton
                  buttons={[
                    {
                      label: "2024",
                      onClick: () => null,
                      selected: true
                    },
                    {
                      label: "2023",
                      onClick: () => null
                    },
                    {
                      label: "2022",
                      onClick: () => null
                    }
                  ]}
                />
              </ButtonDropDownSelect>
            }
          />
          <Loadable
            isLoading={findAllEquipmentTypes.isLoading}
            LoadingComponent={<Skeleton variant="rounded" width={154} height={40} />}
            LoadedComponent={
              <ButtonDropDownSelect title={selectedType || "Todos os tipos"}>
                <ListButton
                  buttons={[
                    {
                      label: "Todos os tipos",
                      onClick: () => handleTypeChange(""),
                      selected: selectedType === ""
                    },
                    ...equipmentTypes.map((type, index) => ({
                      label: type.name,
                      onClick: () => handleTypeChange(type.name),
                      selected: type.name === selectedType,
                      divider: index === 0 && true
                    }))
                  ]}
                />
              </ButtonDropDownSelect>
            }
          />
        </Stack>
        <Box sx={{ width: "100%", height: 400 }}>
          <LineChart
            data={data}
            categories={[
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez"
            ]}
            limits={[1, 12]}
            colors={["rgb(139, 195, 74)"]}
          />
        </Box>
      </Box>
    </Stack>
  )
}

export default EquipmentAnnualChart
