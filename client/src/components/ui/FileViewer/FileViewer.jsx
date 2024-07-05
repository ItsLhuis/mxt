import PropTypes from "prop-types"

import React, { useEffect, useState } from "react"

import {
  Backdrop,
  Box,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
  Typography,
  Alert
} from "@mui/material"
import { Close } from "@mui/icons-material"

import { Loadable } from ".."

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

import { motion } from "framer-motion"

import axios from "axios"

const FileViewer = ({ open, onClose, file, fileName, fileSize, fileType }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const [state, setState] = useState({
    fileName: "",
    fileSize: ""
  })

  useEffect(() => {
    const img = new Image()

    let cancelToken
    const source = axios.CancelToken.source()
    cancelToken = source.token

    setIsLoading(true)
    setIsError(false)

    setTimeout(() => {
      setState({ fileName: fileName, fileSize: fileSize })
    }, 50)

    const fetchData = async () => {
      try {
        if (fileType.startsWith("image/")) {
          img.src = file

          img.onload = () => {
            setIsLoading(false)
            setIsError(false)
          }

          img.onerror = () => {
            setIsLoading(false)
            setIsError(true)
          }
        } else if (fileType === "application/pdf") {
          const response = await axios.get(file, {
            responseType: "blob",
            withCredentials: true,
            cancelToken: cancelToken
          })

          if (response.status === 200) {
            setIsLoading(false)
            setIsError(false)
          } else {
            setIsLoading(false)
            setIsError(true)
          }
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false)
          setIsError(true)
        }
      }
    }

    fetchData()

    return () => {
      img.onload = null
      img.onerror = null
      source.cancel()
    }
  }, [file])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && open) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose])

  return (
    <Backdrop
      open={open}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: "var(--background)"
      }}
    >
      <Stack
        sx={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            minHeight: 64,
            backgroundColor: "var(--elevation-level1)",
            boxShadow: "0 0 0.625rem var(--boxShadow)",
            paddingInline: "1rem",
            width: "100%"
          }}
        >
          <Stack sx={{ overflow: "hidden" }}>
            <Typography
              variant="p"
              component="p"
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              }}
            >
              {state.fileName}
            </Typography>
            <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
              {`${
                state.fileSize < 1024 * 1024
                  ? (state.fileSize / 1024).toFixed(2) + " Kb"
                  : (state.fileSize / (1024 * 1024)).toFixed(2) + " Mb"
              }`}
            </Typography>
          </Stack>
          <Tooltip title="Fechar" placement="left" PopperProps={{ disablePortal: false }}>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "100%",
            maxHeight: "100%",
            height: "100%",
            width: "100%",
            overflow: "hidden"
          }}
        >
          {isError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Alert severity="error">Erro a carregar anexo!</Alert>
            </motion.div>
          ) : (
            <>
              {fileType.startsWith("image/") ? (
                <Loadable
                  isLoading={isLoading}
                  LoadingComponent={<CircularProgress />}
                  LoadedComponent={
                    <TransformWrapper>
                      <TransformComponent
                        wrapperStyle={{
                          height: "100%",
                          width: "100%",
                          cursor: "move"
                        }}
                        contentStyle={{
                          height: "100%",
                          width: "100%",
                          padding: "24px"
                        }}
                      >
                        <img
                          src={file}
                          alt={fileName}
                          loading="lazy"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain"
                          }}
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  }
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                />
              ) : (
                <Loadable
                  isLoading={isLoading}
                  LoadingComponent={<CircularProgress />}
                  LoadedComponent={
                    <iframe
                      src={file}
                      title="Documento PDF"
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  }
                  style={{
                    height: "100%",
                    width: "100%"
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Stack>
    </Backdrop>
  )
}

FileViewer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  file: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  fileName: PropTypes.string,
  fileType: PropTypes.string
}

export default FileViewer
