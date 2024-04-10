import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { produce } from "immer"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { v4 as uuidv4 } from "uuid"

import {
  Box,
  Grid,
  Stack,
  Button,
  Typography,
  FormControl,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Chip
} from "@mui/material"
import { Euro, Percent, Search } from "@mui/icons-material"

import { Modal, Select } from "@components/ui"

import { showSuccessToast } from "@config/toast"

import { formatValueToEuro } from "@utils/format/currency"

const schema = z.object({
  title: z.string({ required_error: "O título é obrigatório" }).trim().min(1, {
    message: "O título é obrigatório"
  }),
  description: z.string(),
  service: z.string({ required_error: "O serviço é obrigatório" }).trim().min(1, {
    message: "O serviço é obrigatório"
  }),
  quantity: z
    .number({ invalid_type_error: "A quantidade é obrigatória" })
    .int({ message: "A quantidade deve ser número inteiro" })
    .min(1, { message: "A quantidade deve ser maior que 0" }),
  price: z.number({
    invalid_type_error: "O preço é obrigatório",
    required_error: "O preço é obrigatório"
  }),
  vat: z
    .number({ invalid_type_error: "O IVA é obrigatório", required_error: "O IVA é obrigatório" })
    .min(0, {
      message: "O IVA deve ser maior ou igual a 0"
    }),
  discount: z
    .union([
      z
        .number({ invalid_type_error: "O desconto deve ser um número" })
        .min(0, { message: "O desconto deve ser maior ou igual a 0" })
        .max(100, { message: "O desconto deve ser menor ou igual a 100" }),
      z.nan()
    ])
    .optional()
})

const ProductModal = ({ open, handleClose, onClick, services, products, initialValues }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues
  } = useForm({
    resolver: zodResolver(schema)
  })

  const [searchProductModalOpen, setSearchProductModalOpen] = useState(false)

  const [selectedProductId, setSelectedProductId] = useState(null)

  useEffect(() => {
    setSelectedProductId(null)

    reset()
  }, [open])

  const handleProductSelect = (product) => {
    setValue("title", product.title)
    setValue("description", product.description)
    setValue("service", product.service)
    setValue("quantity", product.quantity)
    setValue("price", product.price)
    setValue("vat", product.vat)

    setSelectedProductId(product.id)

    updateTotal()
  }

  const onSubmit = (data) => {
    if (data.discount === null || data.discount === undefined || isNaN(data.discount)) {
      data.discount = 0
    }

    const id = uuidv4()
    const newData = produce(data, (draft) => {
      draft.id = id
      draft.total = getValues("total")
    })
    onClick(newData)

    showSuccessToast("Item adicionado com sucesso!")
    handleClose()
  }

  const updateTotal = () => {
    const { quantity, price, discount, vat } = getValues()
    const numericQuantity = parseFloat(quantity) || 0
    const numericPrice = parseFloat(price) || 0
    const numericDiscount = parseFloat(discount) || 0
    const numericVat = parseFloat(vat) || 0

    const totalPrice = numericQuantity * numericPrice
    const discountAmount = (totalPrice * numericDiscount) / 100
    const subtotal = totalPrice - discountAmount
    const vatAmount = subtotal * (numericVat / 100)
    const total = subtotal + vatAmount

    setValue("total", total.toFixed(2), { shouldValidate: false })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      mode="form"
      title="Adicionar Produto"
      submitButtonText="Adicionar Produto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ padding: 3, paddingTop: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack sx={{ flexDirection: "row", alignItems: "flex-start", gap: 1 }}>
              <Tooltip title="Pesquisar" placement="bottom">
                <IconButton sx={{ marginTop: 1 }} onClick={() => setSearchProductModalOpen(true)}>
                  <Search />
                </IconButton>
              </Tooltip>
              <FormControl fullWidth>
                <TextField
                  name="title"
                  label="Título"
                  placeholder="Título"
                  disabled
                  value={getValues("title")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ""}
                />
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                {...register("description")}
                name="description"
                label="Descrição"
                placeholder="Descrição"
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="service"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    ref={field.ref}
                    label="Serviço"
                    data={["", ...services]}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.service}
                    helperText={errors.service ? errors.service.message : ""}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                {...register("quantity", { valueAsNumber: true })}
                name="quantity"
                label="Quantidade"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
                error={!!errors.quantity}
                helperText={errors.quantity ? errors.quantity.message : ""}
                onChange={(e) => {
                  setValue("quantity", e.target.value)
                  updateTotal()
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                name="price"
                label="Preço"
                placeholder="0,00"
                type="number"
                disabled
                value={getValues("price")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Euro fontSize="small" />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.price}
                helperText={errors.price ? errors.price.message : ""}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                name="vat"
                label="IVA"
                placeholder="0,00"
                type="number"
                disabled
                value={getValues("vat")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Percent fontSize="small" />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.vat}
                helperText={errors.vat ? errors.vat.message : ""}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                {...register("discount", {
                  valueAsNumber: true,
                  setValueAs: (value) => Number(value)
                })}
                name="discount"
                label="Desconto"
                placeholder="0,00"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Percent fontSize="small" />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.discount}
                helperText={errors.discount ? errors.discount.message : ""}
                onChange={(e) => {
                  setValue("discount", e.target.value)
                  updateTotal()
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                {...register("total")}
                name="total"
                label="Total"
                placeholder="0,00"
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Euro fontSize="small" />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Modal
        open={searchProductModalOpen}
        onClose={() => setSearchProductModalOpen(false)}
        title="Produtos"
        placeholder="Pesquise por um produto"
        mode="data"
        data={products}
        buttonStructure={(item, onClose) => {
          const isSelected = selectedProductId === item.id
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
                handleProductSelect(item)
                onClose()
              }}
            >
              <Stack
                sx={{
                  gap: 1,
                  lineHeight: 1.5,
                  alignItems: "flex-start",
                  width: "100%"
                }}
              >
                <Typography variant="body2" component="p" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="body3" component="p" color="var(--outline)">
                  {item.description}
                </Typography>
                <Typography variant="body3" component="p">
                  {formatValueToEuro(item.price)}
                </Typography>
                <Box
                  sx={{
                    marginLeft: "auto"
                  }}
                >
                  <Chip label={item.service} />
                </Box>
              </Stack>
            </Button>
          )
        }}
      />
    </Modal>
  )
}

ProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  initialValues: PropTypes.array
}

export default ProductModal
