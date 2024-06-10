import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { LoadingButton } from "@mui/lab"
import {
  Dialog,
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Button,
  Pagination,
  PaginationItem,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { Close, Search } from "@mui/icons-material"

import { NoData } from ".."

import { formatNumber } from "@utils/format/number"

const Modal = ({
  open,
  onClose,
  title,
  description,
  mode = "normal",
  cancelButtonText = "Cancelar",
  submitButtonText = "Ok",
  onSubmit,
  data,
  placeholder,
  buttonStructure,
  children
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [load, setLoad] = useState(false)

  const handleClose = () => {
    if (!load) {
      onClose()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoad(true)

    try {
      const result = await onSubmit()

      setLoad(false)
      if (result) {
        onClose()
      }
    } catch (error) {
      setLoad(false)
    }
  }

  const getDataCountText = (dataSize) => {
    return dataSize === 1 ? "resultado encontrado" : "resultados encontrados"
  }

  let content

  switch (mode) {
    case "delete":
      content = (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              paddingLeft: 3
            }}
          >
            <Typography variant="h4" component="h4">
              {!title ? "Eliminar" : title}
            </Typography>
            <Tooltip title="Fechar" placement="bottom">
              <IconButton aria-label="close" onClick={handleClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="p"
            component="p"
            sx={{
              padding: 3,
              paddingTop: 0,
              paddingBottom: 0,
              height: fullScreen ? "100%" : "auto"
            }}
          >
            {description}
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: 3,
              gap: 1
            }}
          >
            <LoadingButton
              loading={load}
              variant="contained"
              color="secondary"
              onClick={handleClose}
            >
              {cancelButtonText}
            </LoadingButton>
            <LoadingButton loading={load} variant="contained" color="error" onClick={handleSubmit}>
              {!title ? "Eliminar" : title}
            </LoadingButton>
          </Box>
        </>
      )
      break
    case "form":
      content = (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              paddingLeft: 3
            }}
          >
            <Typography variant="h4" component="h4">
              {title}
            </Typography>
            <Tooltip title="Fechar" placement="bottom">
              <IconButton aria-label="close" onClick={handleClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider
            sx={{
              borderColor: "var(--elevation-level5)",
              borderWidth: 1
            }}
          />
          <Box sx={{ overflow: "auto", height: fullScreen ? "100%" : "auto", minHeight: 64 }}>
            <form onSubmit={handleSubmit} style={{ height: "100%" }}>
              {children}
              <Button sx={{ display: "none" }} type="submit" onClick={handleSubmit} />
            </form>
          </Box>
          <Divider
            sx={{
              borderColor: "var(--elevation-level5)",
              borderWidth: 1
            }}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: 3,
              gap: 1
            }}
          >
            <LoadingButton
              loading={load}
              variant="contained"
              color="secondary"
              onClick={handleClose}
            >
              {cancelButtonText}
            </LoadingButton>
            <LoadingButton loading={load} type="submit" variant="contained" onClick={handleSubmit}>
              {submitButtonText}
            </LoadingButton>
          </Box>
        </>
      )
      break
    case "data":
      const inputRef = useRef(null)
      const [text, setText] = useState("")

      const [currentPage, setCurrentPage] = useState(1)
      const pageSize = 10

      const [filteredData, setFilteredData] = useState([])

      const handlePageChange = (event, value) => {
        setCurrentPage(value)
      }

      const handleChange = (event) => {
        const searchText = event.target.value
        setCurrentPage(1)
        setText(searchText)
      }

      const filterData = () => {
        const filteredResults = data.filter((item) => {
          for (let key in item) {
            if (
              typeof item[key] === "string" &&
              item[key].toLowerCase().includes(text.toLowerCase())
            ) {
              return true
            }
          }
          return false
        })

        setFilteredData(filteredResults)
      }

      useEffect(() => {
        setText("")
        setCurrentPage(1)
        const timer = setTimeout(() => {
          if (open && inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
        return () => clearTimeout(timer)
      }, [open])

      useEffect(() => {
        filterData()
      }, [open, text, currentPage])

      const totalPages = Math.ceil(filteredData.length / pageSize)
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, filteredData.length)
      const itemsToShow = filteredData.slice(startIndex, endIndex)

      content = (
        <>
          <Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                paddingLeft: 3,
                paddingBottom: 0
              }}
            >
              <Typography variant="h4" component="h4">
                {title}
              </Typography>
              <Tooltip title="Fechar" placement="bottom">
                <IconButton aria-label="close" onClick={handleClose}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
            <Stack sx={{ padding: 3 }}>
              <TextField
                inputRef={inputRef}
                label="Pesquisar"
                placeholder={placeholder ?? "Pesquisar"}
                sx={{ width: "100%" }}
                value={text}
                onChange={handleChange}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
              <Typography variant="p" component="p" sx={{ marginTop: 2 }}>
                <b>{formatNumber(filteredData.length)}</b> {getDataCountText(filteredData.length)}
              </Typography>
            </Stack>
          </Stack>
          <Divider
            sx={{
              borderColor: "var(--elevation-level5)",
              borderWidth: 1
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflow: "auto",
              padding: 3,
              height: "100%"
            }}
          >
            {itemsToShow.length === 0 ? (
              <NoData />
            ) : (
              <>
                {itemsToShow.map((item, index) => (
                  <React.Fragment key={index}>{buttonStructure(item, onClose)}</React.Fragment>
                ))}
              </>
            )}
          </Box>
          {totalPages > 1 && (
            <>
              <Divider
                sx={{
                  borderColor: "var(--elevation-level5)",
                  borderWidth: 1
                }}
              />
              <Box sx={{ padding: 2, paddingTop: 3, paddingBottom: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  color="primary"
                  onChange={handlePageChange}
                  sx={{ "& .MuiPagination-ul": { justifyContent: "space-between" } }}
                  showFirstButton={!fullScreen}
                  showLastButton={!fullScreen}
                  siblingCount={fullScreen ? 0 : undefined}
                  renderItem={(props) => (
                    <PaginationItem {...props} page={formatNumber(props.page)} />
                  )}
                />
              </Box>
            </>
          )}
        </>
      )
      break
    default:
      content = (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              paddingLeft: 3
            }}
          >
            <Typography variant="h4" component="h4">
              {title}
            </Typography>
            <Tooltip title="Fechar" placement="bottom">
              <IconButton aria-label="close" onClick={handleClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider
            sx={{
              borderColor: "var(--elevation-level5)",
              borderWidth: 1
            }}
          />
          {children}
        </>
      )
      break
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen={fullScreen}
      disableEscapeKeyDown={load}
      sx={{ "& .MuiPaper-root": { borderRadius: fullScreen && "0 !important" } }}
    >
      {content}
    </Dialog>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  mode: PropTypes.oneOf(["normal", "delete", "form", "data"]),
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  onSubmit: function (props, propName, componentName) {
    if (
      props.mode === "form" &&
      (props[propName] === undefined || typeof props[propName] !== "function")
    ) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. onSubmit can only be provided when mode is 'form'.`
      )
    }
  },
  data: function (props, propName, componentName) {
    if (
      props.mode === "data" &&
      (props[propName] === undefined || !Array.isArray(props[propName]))
    ) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. data must be an array when mode is 'data'.`
      )
    }
  },
  placeholder: PropTypes.string,
  buttonStructure: function (props, propName, componentName) {
    if (
      props.mode === "data" &&
      (props[propName] === undefined || typeof props[propName] !== "function")
    ) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. buttonStructure must be provided when mode is 'data'.`
      )
    }
  },
  children: function (props, propName, componentName) {
    if (props.mode !== "delete" && props.mode !== "data" && props[propName] === undefined) {
      return new Error(
        `The prop ${propName} is marked as required in ${componentName}, but its value is not supplied.`
      )
    }
  }
}

export default Modal
