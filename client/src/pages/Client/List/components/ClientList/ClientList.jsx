import React from "react"

import axios from "axios"

import { useQuery } from "@tanstack/react-query"

import { Paper, Box } from "@mui/material"

import { Table, TableSkeleton } from "@components/ui"

import { motion } from "framer-motion"

const fetchData = async () => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const response = await axios.get("https://dummyjson.com/products")
      resolve(response.data)
    }, 2000)
  })
}

const ClientList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchData
  })

  const tableColumns = [
    { id: "id", label: "ID", align: "left", sortable: true },
    { id: "title", label: "Title", align: "left", sortable: true },
    { id: "description", label: "Description", align: "left", sortable: true },
    { id: "price", label: "Price", align: "left", sortable: true },
    { id: "discountPercentage", label: "Discount (%)", align: "left", sortable: true },
    { id: "rating", label: "Rating", align: "left", sortable: true },
    { id: "stock", label: "Stock", align: "left", sortable: true },
    { id: "brand", label: "Brand", align: "left", sortable: true },
    { id: "category", label: "Category", align: "left", sortable: true }
  ]

  return (
    <Paper elevation={1}>
      <Box sx={{ marginTop: 3, paddingBlock: 3 }}>
        {isLoading ? (
          <TableSkeleton mode="datatable" />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Table mode="datatable" data={data?.products ?? []} columns={tableColumns} />
          </motion.div>
        )}
      </Box>
    </Paper>
  )
}

export default ClientList
