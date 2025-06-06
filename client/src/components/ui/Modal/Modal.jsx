import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { LoadingButton } from "@mui/lab"
import {
  Dialog,
  Box,
  Stack,
  CircularProgress,
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

import { NoData, Loadable } from ".."

import { formatNumber } from "@utils/format/number"

const Modal = ({
  open,
  onClose,
  title,
  description,
  subDescription,
  mode = "normal",
  cancelButtonText = "Cancelar",
  submitButtonText = "Ok",
  color = "primary",
  onSubmit,
  data,
  isLoading,
  placeholder,
  buttonStructure,
  disabled = false,
  searchKeys = [],
  children
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [load, setLoad] = useState(false)

  const removeButtonRef = useRef(null)

  useEffect(() => {
    if (!open && mode !== "delete") return

    const timer = setTimeout(() => {
      if (open && removeButtonRef.current) {
        removeButtonRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  const handleClose = () => {
    if (!load) {
      onClose()
    }
  }

  const handleSubmit = async (e) => {
    if (disabled) return

    e.preventDefault()
    setLoad(true)

    try {
      await onSubmit()

      setLoad(false)
    } catch (error) {
      setLoad(false)
    }
  }

  const getDataCountText = (dataSize) => {
    return dataSize === 1 ? "resultado encontrado" : "resultados encontrados"
  }

  const getNestedValue = (obj, path, defaultValue = undefined) => {
    const keys = path.split(".")
    let result = obj

    for (const key of keys) {
      if (Array.isArray(result)) {
        result = result.map((item) => getNestedValue(item, keys.slice(1).join("."), defaultValue))
        return result
      }
      result = result ? result[key] : defaultValue
      if (result === undefined) {
        return defaultValue
      }
    }

    return result
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
            <Tooltip title="Fechar">
              <IconButton aria-label="close" onClick={handleClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
          <Stack sx={{ display: "flex", gap: 1, height: fullScreen ? "100%" : "auto" }}>
            <Typography
              variant="h6"
              component="h6"
              sx={{
                padding: 3,
                paddingTop: 0,
                paddingBottom: 0
              }}
            >
              {description}
            </Typography>
            <Typography
              variant="p"
              component="p"
              sx={{
                padding: 3,
                paddingTop: 0,
                paddingBottom: 0
              }}
            >
              {subDescription}
            </Typography>
          </Stack>
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
              sx={{ height: "100%" }}
            >
              {cancelButtonText}
            </LoadingButton>
            <LoadingButton
              ref={removeButtonRef}
              loading={load}
              variant="contained"
              color="error"
              onClick={handleSubmit}
            >
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
            <Tooltip title="Fechar">
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
              <Button
                sx={{ display: "none" }}
                type="submit"
                onClick={handleSubmit}
                disabled={disabled}
              />
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
              sx={{ height: "100%" }}
            >
              {cancelButtonText}
            </LoadingButton>
            <LoadingButton
              loading={load}
              type="submit"
              variant="contained"
              color={color}
              onClick={handleSubmit}
              disabled={disabled}
            >
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

      const deepSearch = (value, searchText) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchText)
        } else if (Array.isArray(value)) {
          return value.some((item) => deepSearch(item, searchText))
        } else if (typeof value === "object" && value !== null) {
          return Object.values(value).some((nestedValue) => deepSearch(nestedValue, searchText))
        }

        return false
      }

      const filterData = () => {
        if (searchKeys.length === 0) {
          const filteredResults = data.filter((item) => {
            return deepSearch(item, text.toLowerCase())
          })
          setFilteredData(filteredResults)
          return
        }

        const filteredResults = data.filter((item) => {
          return searchKeys.some((key) => {
            const value = getNestedValue(item, key)
            return deepSearch(value, text.toLowerCase())
          })
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
      }, [open, data, text, currentPage])

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
              <Tooltip title="Fechar">
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
          <Loadable
            isLoading={isLoading}
            LoadingComponent={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                  minHeight: 210
                }}
              >
                <CircularProgress />
              </Box>
            }
            LoadedComponent={
              <>
                {itemsToShow.length === 0 ? (
                  <NoData style={{ height: "100%" }} />
                ) : (
                  <>
                    {itemsToShow.map((item, index) => (
                      <React.Fragment key={index}>{buttonStructure(item, onClose)}</React.Fragment>
                    ))}
                  </>
                )}
              </>
            }
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: "auto",
              padding: "24px",
              height: "100%"
            }}
          />
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
            <Tooltip title="Fechar">
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
  isLoading: PropTypes.bool,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  color: PropTypes.string,
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
  disabled: PropTypes.bool,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  children: function (props, propName, componentName) {
    if (props.mode !== "delete" && props.mode !== "data" && props[propName] === undefined) {
      return new Error(
        `The prop ${propName} is marked as required in ${componentName}, but its value is not supplied.`
      )
    }
  }
}

export default Modal
