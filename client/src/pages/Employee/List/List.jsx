import React, { Suspense } from "react"

import { useNavigate } from "react-router-dom"

import { useUser } from "@hooks/server/useUser"

import { Box, Container } from "@mui/material"
import { Add } from "@mui/icons-material"

import { PageLoader, HeaderPage } from "@components/ui"
import { EmployeeTable } from "./components"

import { motion } from "framer-motion"

const EmployeeListPage = () => {
  const navigate = useNavigate()

  const { findAllEmployees } = useUser()

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Lista de Funcionários"
              breadcrumbs={[{ name: "Funcionário" }, { name: "Lista" }]}
              isRefetchEnable={!findAllEmployees.isFetching}
              refetchFunction={() => findAllEmployees.refetch()}
              isRefetching={findAllEmployees.isRefetching && !findAllEmployees.isRefetchError}
              button={{
                startIcon: <Add fontSize="large" />,
                title: "Adicionar Funcionário",
                onClick: () => navigate("/employee/add")
              }}
            />
            <EmployeeTable />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default EmployeeListPage
