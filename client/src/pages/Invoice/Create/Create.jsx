import React, { Suspense, useState, useEffect } from "react"

import { produce } from "immer"

import { z } from "zod"

import { v4 as uuidv4 } from "uuid"

import { isAfter, endOfDay } from "date-fns"

import { useNavigate } from "react-router-dom"

import { LoadingButton } from "@mui/lab"
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Add, DeleteOutline, MoreVert } from "@mui/icons-material"

import {
  PageLoader,
  HeaderPage,
  DatePicker,
  Select,
  Table,
  Modal,
  Caption,
  ButtonDropDownSelect,
  ListButton
} from "@components/ui"
import { ItemModal } from "./components"

import { motion } from "framer-motion"

import { showSuccessToast } from "@config/toast"

import { formatValueToPercentage } from "@utils/format/percentage"
import { formatValueToEuro } from "@utils/format/currency"
import { formatPhoneNumber } from "@utils/format/phone"

const invoiceSchema = z
  .object({
    client: z.object(
      {
        id: z.number(),
        name: z.string(),
        country: z.string(),
        address: z.string(),
        phone: z.string()
      },
      { invalid_type_error: "O cliente é obrigatório" }
    ),
    invoiceID: z.string(),
    state: z.string(),
    creationDate: z.date({ invalid_type_error: "A data de criação é obrigatória" }),
    dueDate: z.date({ invalid_type_error: "A data de vencimento é obrigatória" }),
    items: z.array(z.object({})).nonempty({ message: "Pelo menos um item é obrigatório" })
  })
  .refine(
    (data) => {
      return !data.dueDate || !data.creationDate || isAfter(data.dueDate, data.creationDate)
    },
    {
      message: "A data de vencimento deve ser posterior à data de criação",
      path: ["dueDate"]
    }
  )

const generateClients = () => {
  const clients = []
  for (let i = 1; i <= 231; i++) {
    clients.push({
      id: i,
      name: `Cliente ${i}`,
      country: i % 2 === 0 ? "Portugal" : "Brasil",
      address: `Endereço ${i}`,
      phone: formatPhoneNumber("987654321")
    })
  }
  return clients
}

const generateProducts = () => {
  const products = []
  for (let i = 1; i <= 385; i++) {
    products.push({
      id: i,
      title: `Produto ${i}`,
      description: `Produto ${i}`,
      service: "Venda de Produtos",
      quantity: 1,
      price: 29.99
    })
  }
  return products
}

const generateItems = () => {
  const items = []
  for (let i = 1; i <= 26; i++) {
    const id = uuidv4()
    items.push({
      id,
      title: `Produto ${i}`,
      description: `Descrição do Produto ${i}`,
      service: "Venda de Produtos",
      quantity: 1,
      price: 29.99,
      discount: 0,
      total: 29.99,
      moreOptions: {
        item: {
          id,
          title: `Produto ${i}`,
          description: `Descrição do Produto ${i}`,
          service: "Venda de Produtos",
          quantity: 1,
          price: 29.99,
          discount: 0,
          total: 29.99
        }
      }
    })
  }
  return items
}

const Create = () => {
  const navigate = useNavigate()

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [load, setLoad] = useState(false)

  const [formData, setFormData] = useState({
    client: null,
    invoiceID: "INV-9832-9123",
    state: "Rascunho",
    creationDate: new Date(),
    dueDate: null,
    items: generateItems()
  })
  const [errors, setErrors] = useState({})

  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])

  const [callBackFunc, setCallBackFunc] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    items: []
  })

  const [clientModalOpen, setClientModalOpen] = useState(false)
  const [itemModal, setItemModal] = useState({
    open: false,
    item: null,
    mode: null
  })
  const openAddItemModal = () => {
    setItemModal({
      open: true,
      item: null,
      mode: "add"
    })
  }
  const openEditItemModal = (item) => {
    setItemModal({
      open: true,
      item: item,
      mode: "edit"
    })
  }

  useEffect(() => {
    const newClients = generateClients()
    const newProducts = generateProducts()

    setClients(newClients)
    setProducts(newProducts)
  }, [])

  const tableColumns = [
    { id: "title", label: "Título", align: "left", sortable: false },
    { id: "description", label: "Descrição", align: "left", sortable: false },
    { id: "service", label: "Serviço", align: "left", sortable: false },
    { id: "quantity", label: "Quantidade", align: "left", sortable: false },
    {
      id: "price",
      label: "Preço",
      align: "left",
      sortable: false,
      formatter: formatValueToEuro
    },
    {
      id: "discount",
      label: "Desconto",
      align: "left",
      sortable: false,
      formatter: formatValueToPercentage
    },
    { id: "total", label: "Total", align: "left", sortable: false, formatter: formatValueToEuro },
    {
      id: "moreOptions",
      align: "center",
      sortable: false,
      renderComponent: ({ data }) => (
        <ButtonDropDownSelect
          mode="custom"
          customButton={
            <Tooltip title="Mais Opções"  sx={{ margin: -1 }}>
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
                onClick: () => openEditItemModal(data.item)
              },
              {
                label: "Eliminar",
                color: "error",
                divider: true,
                onClick: () => {
                  setDeleteConfirmation({ open: true, items: [data.item.id] })
                }
              }
            ]}
          />
        </ButtonDropDownSelect>
      )
    }
  ]

  const states = ["Pago", "Pendente", "Atrasado", "Rascunho"]

  const services = [
    "Reparação",
    "Configuração de Redes",
    "Backup e Recuperação de Dados",
    "Consultoria",
    "Manutenção Preventiva",
    "Venda de Produtos",
    "Formação",
    "Suporte Técnico Remoto",
    "Acessórios e Complementos"
  ]

  const updateFormData = (name, value) => {
    setFormData(
      produce((draft) => {
        draft[name] = value
      })
    )
  }

  const handleDateChange = (name, date) => {
    let updatedDate = date

    if (name === "dueDate") {
      updatedDate = endOfDay(date)
    }

    updateFormData(name, updatedDate)
  }

  const addItem = (itemData) => {
    setFormData(
      produce((draft) => {
        draft.items.push(itemData)
      })
    )
  }

  const editItem = (editedItem) => {
    setFormData(
      produce((draft) => {
        const index = draft.items.findIndex((item) => item.id === editedItem.id)
        if (index !== -1) {
          draft.items[index] = editedItem
        }
      })
    )
  }

  const removeItems = (itemIdsToRemove) => {
    const itemsToRemoveSet = new Set(itemIdsToRemove)
    setFormData(
      produce((draft) => {
        draft.items = draft.items.filter((item) => !itemsToRemoveSet.has(item.id))
      })
    )
  }

  const handleDeleteConfirmation = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        removeItems(deleteConfirmation.items)

        showSuccessToast("Item(s) eliminado(s) com sucesso!")

        if (callBackFunc) {
          callBackFunc()
        }

        setDeleteConfirmation({ open: false, items: [] })

        resolve(true)
      }, 500)
    })
  }

  const handleOnClick = () => {
    const validationResult = invoiceSchema.safeParse(formData)
    if (validationResult.success) {
      setLoad(true)
      setTimeout(() => {
        showSuccessToast("Fatura criada com sucesso!")
        navigate("/invoice/list")
      }, 1000)
    } else {
      const newErrors = {}
      validationResult.error.errors.forEach((error) => {
        const fieldName = error.path[0]
        const errorMessage = error.message
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = { message: errorMessage }
        } else {
          newErrors[fieldName].message = errorMessage
        }
      })
      setErrors(newErrors)
    }
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Box component="main" className="page-main">
          <Container maxWidth={false}>
            <HeaderPage
              title="Criar Fatura"
              breadcrumbs={[{ name: "Faturação" }, { name: "Criar" }]}
            />
            <Paper elevation={1}>
              <Box sx={{ marginTop: 3 }}>
                <Stack
                  sx={{
                    flexDirection: isMediumScreen ? "column" : "row",
                    gap: isMediumScreen ? 3 : 5,
                    padding: 3
                  }}
                >
                  <Stack sx={{ width: "100%", gap: 2 }}>
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" component="h6" sx={{ color: "var(--outline)" }}>
                        De:
                      </Typography>
                      <Caption title="Endereço padrão. Só o Chefe pode alterar." />
                    </Stack>
                    <Stack
                      sx={{
                        gap: 1,
                        padding: 2,
                        border: 2,
                        borderColor: "var(--elevation-level5)",
                        borderRadius: 2,
                        lineHeight: 1.5
                      }}
                    >
                      <Typography variant="body3" component="p">
                        Mixtura
                      </Typography>
                      <Typography variant="body3" component="p">
                        R. 15 751, 4500-159 Espinho, Portugal
                      </Typography>
                      <Typography variant="body3" component="p">
                        {formatPhoneNumber("220180486")}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider
                    sx={{
                      height: "auto",
                      borderColor: "var(--elevation-level5)",
                      borderWidth: 1
                    }}
                  />
                  <Stack sx={{ width: "100%", gap: 2 }}>
                    <Typography variant="h6" component="h6" sx={{ color: "var(--outline)" }}>
                      Para:
                    </Typography>
                    <FormControl>
                      <Button
                        startIcon={
                          !formData.client && (
                            <Add
                              fontSize="large"
                              sx={{ color: errors.client && "rgb(211, 47, 47) !important" }}
                            />
                          )
                        }
                        sx={{
                          display: "flex",
                          flexDirection: formData.client ? "column" : "row",
                          justifyContent: "center",
                          alignItems: formData.client ? "flex-start" : "center",
                          padding: "16px !important",
                          width: "100%",
                          backgroundColor: "var(--elevation-level3)",
                          border: 2,
                          borderColor: errors.client
                            ? "rgb(211, 47, 47) !important"
                            : "var(--elevation-level3)",
                          borderRadius: 2,
                          color: errors.client ? "rgb(211, 47, 47) !important" : "var(--onSurface)",
                          lineHeight: 1.5,
                          fontWeight: 400,
                          minHeight: "106px !important",
                          "&:hover": {
                            backgroundColor: "var(--elevation-level5)",
                            borderColor: "var(--primary)"
                          }
                        }}
                        onClick={() => setClientModalOpen(true)}
                      >
                        {!formData.client ? (
                          "Adicionar Cliente"
                        ) : (
                          <Stack
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "flex-start",
                              gap: 1
                            }}
                          >
                            <Typography variant="body3" component="p" textAlign="left">
                              {formData.client.name}
                            </Typography>
                            <Typography variant="body3" component="p" textAlign="left">
                              {formData.client.address}, {formData.client.country}
                            </Typography>
                            <Typography variant="body3" component="p" textAlign="left">
                              {formData.client.phone}
                            </Typography>
                          </Stack>
                        )}
                      </Button>
                      {errors.client && (
                        <FormHelperText sx={{ color: errors.client && "rgb(211, 47, 47)" }}>
                          {errors.client?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                </Stack>
                <Box sx={{ backgroundColor: "var(--elevation-level2)", padding: 3, paddingTop: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={3}>
                      <FormControl fullWidth>
                        <TextField
                          name="invoiceID"
                          label="Número da fatura"
                          value={formData.invoiceID}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <Select
                        label="Estado"
                        data={states}
                        value={formData.state}
                        onChange={(value) => updateFormData("state", value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <FormControl fullWidth>
                        <DatePicker
                          label="Data de criação"
                          value={formData.creationDate}
                          onChange={(date) => handleDateChange("creationDate", date)}
                          error={!!errors.creationDate}
                          helperText={errors.creationDate?.message}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <FormControl fullWidth>
                        <DatePicker
                          label="Data de vencimento"
                          value={formData.dueDate}
                          onChange={(date) => handleDateChange("dueDate", date)}
                          minDate={formData.creationDate}
                          error={!!errors.dueDate}
                          helperText={errors.dueDate?.message}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Stack>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 3
                    }}
                  >
                    <Typography variant="h6" component="h6" sx={{ color: "var(--outline)" }}>
                      Detalhes:
                    </Typography>
                    <Button
                      sx={{ marginLeft: "auto" }}
                      startIcon={<Add fontSize="large" sx={{ color: "var(--primary)" }} />}
                      onClick={openAddItemModal}
                    >
                      Adicionar Item
                    </Button>
                  </Stack>
                  <Table
                    data={formData.items}
                    columns={tableColumns}
                    mode="datatable"
                    actions={[
                      {
                        icon: <DeleteOutline />,
                        title: "Eliminar",
                        onClick: (selectedItems, func) => {
                          setDeleteConfirmation({ open: true, items: selectedItems })
                          setCallBackFunc(() => func)
                        }
                      }
                    ]}
                    error={!!errors.items}
                    helperText={errors.items?.message}
                  />
                  <Stack sx={{ marginLeft: "auto", padding: 1, paddingTop: 3, paddingInline: 3 }}>
                    <Typography variant="h5" component="h5">
                      Total: 43 €
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    padding: 3,
                    gap: 1
                  }}
                >
                  <LoadingButton loading={load} variant="contained" color="secondary">
                    Guardar Rascunho
                  </LoadingButton>
                  <LoadingButton loading={load} variant="contained" onClick={handleOnClick}>
                    Criar Fatura
                  </LoadingButton>
                </Stack>
              </Box>
            </Paper>
            <Modal
              open={clientModalOpen}
              onClose={() => setClientModalOpen(false)}
              title="Clientes"
              placeholder="Pesquise por um cliente"
              mode="data"
              data={clients}
              buttonStructure={(item, onClose) => {
                const isSelected = formData.client?.id === item.id
                return (
                  <Button
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      padding: "16px !important",
                      width: "100%",
                      backgroundColor: isSelected
                        ? "rgba(88, 101, 242, 0.15)"
                        : "var(--elevation-level2)",
                      border: 2,
                      borderColor: isSelected ? "var(--primary)" : "var(--elevation-level2)",
                      borderRadius: 2,
                      color: "var(--onSurface)",
                      lineHeight: 1.5,
                      fontWeight: 400,
                      minHeight: "unset !important",
                      "&:hover": {
                        backgroundColor: isSelected
                          ? "rgba(88, 101, 242, 0.23)"
                          : "var(--elevation-level4)",
                        borderColor: "var(--primary)"
                      }
                    }}
                    className="Mui-selected"
                    onClick={() => {
                      setFormData(
                        produce((draft) => {
                          draft.client = item
                        })
                      )
                      onClose()
                    }}
                  >
                    <Stack
                      sx={{
                        gap: 1,
                        lineHeight: 1.5,
                        alignItems: "flex-start"
                      }}
                    >
                      <Typography variant="body2" component="p" fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Typography variant="body3" component="p" color="var(--outline)">
                        {item.address}, {item.country}
                      </Typography>
                      <Typography variant="body3" component="p" color="var(--outline)">
                        {item.phone}
                      </Typography>
                    </Stack>
                  </Button>
                )
              }}
            />
            <ItemModal
              mode="add"
              open={itemModal.mode === "add" && itemModal.open}
              handleClose={() => setItemModal({ open: false, item: null, mode: null })}
              onClick={addItem}
              services={services}
              products={products}
            />
            <ItemModal
              mode="edit"
              open={itemModal.mode === "edit" && itemModal.open}
              handleClose={() => setItemModal({ open: false, item: null, mode: null })}
              onClick={editItem}
              services={services}
              products={products}
              initialValues={itemModal.item}
            />
            <Modal
              open={deleteConfirmation.open}
              onClose={() => setDeleteConfirmation({ open: false, items: [] })}
              onSubmit={handleDeleteConfirmation}
              mode="delete"
              description="Deseja eliminar o(s) seguinte(s) item(s)?"
            />
          </Container>
        </Box>
      </motion.div>
    </Suspense>
  )
}

export default Create
