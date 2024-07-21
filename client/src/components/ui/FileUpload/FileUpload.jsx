import PropTypes from "prop-types"

import React, { useState, useEffect, useRef } from "react"

import { useDropzone } from "react-dropzone"

import { useTheme } from "@contexts/theme"

import { produce } from "immer"

import {
  Stack,
  Box,
  Typography,
  IconButton,
  ButtonBase,
  Tooltip,
  ListItem,
  FormHelperText,
  InputLabel
} from "@mui/material"
import { PictureAsPdf, Image, QuestionMark, Close } from "@mui/icons-material"

import Lottie from "lottie-react"
import LottieAnimationDark from "./Lottie/dark.json"
import LottieAnimationLight from "./Lottie/light.json"

const LottieAnimation = {
  dark: LottieAnimationDark,
  light: LottieAnimationLight
}

const FileUpload = ({
  value = [],
  label,
  onChange,
  error,
  helperText,
  disabled = false,
  acceptedFiles = {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "application/pdf": [".pdf"]
  },
  maxSize = 5 * 1024 * 1024,
  maxTotalFileSize = Infinity,
  ...props
}) => {
  const { dataTheme } = useTheme()

  const inputRef = useRef(null)

  const [fileUploadError, setFileUploadError] = useState(false)
  const [validFiles, setValidFiles] = useState([])
  const [invalidFiles, setInvalidFiles] = useState([])

  useEffect(() => {
    setFileUploadError(error)
  }, [error])

  useEffect(() => {
    setValidFiles(value.filter((file) => isValidFile(file)))
  }, [value])

  const isValidFile = (file) => {
    const fileMime = file.type
    const acceptedExtensions = Object.values(acceptedFiles).flat()
    const isAcceptedFile =
      acceptedFiles !== ""
        ? acceptedExtensions.some((extension) => file.name.toLowerCase().endsWith(extension)) &&
          Object.keys(acceptedFiles).includes(fileMime)
        : true

    const isWithinSizeLimit = file.size <= maxSize

    const totalFileSize = validFiles.reduce((sum, validFile) => sum + validFile.size, 0) + file.size
    const isWithinTotalSizeLimit = totalFileSize <= maxTotalFileSize

    return isAcceptedFile && isWithinSizeLimit && isWithinTotalSizeLimit
  }

  const onDrop = (files) => {
    if (disabled) return

    setInvalidFiles([])

    const validFilesToAdd = []
    const invalidFilesToAdd = []

    files.forEach((file) => {
      if (
        validFiles.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        )
      )
        return

      if (isValidFile(file)) {
        validFilesToAdd.push(file)
      } else {
        invalidFilesToAdd.push(file)
      }
    })

    setValidFiles((currentValidFiles) =>
      produce(currentValidFiles, (draft) => {
        draft.push(...validFilesToAdd)
      })
    )

    setInvalidFiles(invalidFilesToAdd)

    if (typeof onChange === "function") onChange([...validFiles, ...validFilesToAdd])
  }

  const handleClickInput = () => {
    if (inputRef.current) {
      setInvalidFiles([])

      inputRef.current.click()
    }
  }

  const handleInputChange = (e) => {
    if (disabled) return

    const filesToAdd = Array.from(e.target.files)

    const validFilesToAdd = []
    const invalidFilesToAdd = []

    filesToAdd.forEach((file) => {
      if (
        validFiles.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        )
      )
        return

      if (isValidFile(file)) {
        validFilesToAdd.push(file)
      } else {
        invalidFilesToAdd.push(file)
      }
    })

    setValidFiles((currentValidFiles) =>
      produce(currentValidFiles, (draft) => {
        draft.push(...validFilesToAdd)
      })
    )

    setInvalidFiles(invalidFilesToAdd)

    e.target.value = null

    if (typeof onChange === "function") onChange([...validFiles, ...validFilesToAdd])
  }

  const removeFile = (fileToRemove) => {
    if (disabled) return

    setValidFiles((currentFiles) =>
      produce(currentFiles, (draft) => {
        return draft.filter((file) => file !== fileToRemove)
      })
    )

    if (typeof onChange === "function") onChange(validFiles.filter((file) => file !== fileToRemove))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    maxSize
  })

  const renderInvalidFiles = (files) => {
    const fileCount = files.length
    const isPlural = fileCount > 1

    return (
      <Box
        sx={{
          padding: 2,
          borderRadius: "8px",
          border: "2px dashed rgb(211, 47, 47)",
          color: "rgb(211, 47, 47)"
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            overflow: "hidden",
            gap: 1
          }}
        >
          <Typography
            variant="p"
            component="p"
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
          >
            {isPlural
              ? "Os seguintes ficheiros selecionados: "
              : "O seguinte ficheiro selecionado: "}
            {files.map((file, index) => (
              <ListItem key={index} sx={{ display: "list-item" }}>
                {file.name}
                {index < files.length - 1 ? ", " : ""}
              </ListItem>
            ))}
            {isPlural
              ? " serão ignorados, pois não respeitam as regras de carregamento."
              : " será ignorado, pois não respeita as regras de carregamento."}
          </Typography>
        </Stack>
      </Box>
    )
  }

  const renderFiles = (files) => {
    return (
      <Stack
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fit, minmax(200px, 1fr))",
            md: "repeat(auto-fit, minmax(400px, 1fr))"
          },
          gap: 1
        }}
      >
        {files.map((file, index) => (
          <Box key={index} sx={{ width: "100%", maxWidth: "100%" }}>
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                gap: 1,
                backgroundColor: "var(--elevation-level4)",
                borderRadius: "8px"
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  overflow: "hidden",
                  gap: 1
                }}
              >
                {file.type && file.type.startsWith("application/pdf") ? (
                  <PictureAsPdf fontSize="large" sx={{ color: "rgb(223, 88, 84)" }} />
                ) : file.type && file.type.startsWith("image/") ? (
                  <Image fontSize="large" sx={{ color: "rgb(245, 128, 8)" }} />
                ) : (
                  <QuestionMark fontSize="medium" sx={{ color: "var(--outline)" }} />
                )}
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
                    {file.name}
                  </Typography>
                  <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                    {`${
                      file.size < 1024 * 1024
                        ? (file.size / 1024).toFixed(2) + " Kb"
                        : (file.size / (1024 * 1024)).toFixed(2) + " Mb"
                    }`}
                  </Typography>
                </Stack>
              </Stack>
              <Tooltip title="Remover">
                <span>
                  <IconButton disabled={disabled} onClick={() => removeFile(file)}>
                    <Close />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Box>
        ))}
      </Stack>
    )
  }

  return (
    <Stack sx={{ padding: 0, gap: 1 }} {...props}>
      {label && (
        <InputLabel
          sx={{
            color: fileUploadError ? "rgb(211, 47, 47) !important" : "var(--onSurface)"
          }}
        >
          {label}
        </InputLabel>
      )}
      <ButtonBase
        disabled={disabled}
        {...getRootProps()}
        sx={{
          cursor: "pointer",
          borderRadius: "8px",
          border: "2px dashed",
          borderColor: fileUploadError
            ? "rgb(211, 47, 47)"
            : isDragActive
            ? "var(--primary)"
            : "var(--elevation-level6)",
          margin: 0,
          position: "relative",
          paddingInline: 3,
          "&:hover": {
            backgroundColor:
              dataTheme === "dark" ? "rgba(20, 20, 20, 0.5)" : "rgba(20, 20, 20, 0.05)",
            borderColor: !isDragActive && !fileUploadError && "var(--outline)"
          }
        }}
        onClick={handleClickInput}
      >
        <input {...getInputProps({ multiple: true })} onChange={handleInputChange} ref={inputRef} />
        <Stack sx={{ gap: 1 }}>
          <Lottie animationData={LottieAnimation[dataTheme]} style={{ height: 170 }} />
          <Stack sx={{ gap: 1, marginTop: -4, marginBottom: 4 }}>
            <Typography variant="h5" component="h5">
              <u>Clique para carregar</u> ou arraste e solte
            </Typography>
            <Stack>
              {acceptedFiles !== "" && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: fileUploadError ? "rgb(211, 47, 47)" : "var(--outline)" }}
                >
                  Permitido
                  {Object.keys(acceptedFiles).map((type, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ", "}*{acceptedFiles[type].join(", *.")}
                    </React.Fragment>
                  ))}
                </Typography>
              )}
              <Typography
                variant="p"
                component="p"
                sx={{ color: fileUploadError ? "rgb(211, 47, 47)" : "var(--outline)" }}
              >
                Tamanho máximo de {Math.floor((maxSize / (1024 * 1024)).toFixed(2))} Mb por ficheiro
              </Typography>
              {maxTotalFileSize !== Infinity && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: fileUploadError ? "rgb(211, 47, 47)" : "var(--outline)" }}
                >
                  Tamanho máximo total de{" "}
                  {Math.floor((maxTotalFileSize / (1024 * 1024)).toFixed(2))} Mb para todos os
                  ficheiros
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              dataTheme === "dark" ? "rgba(20, 20, 20, 0.5)" : "rgba(20, 20, 20, 0.05)",
            width: "100%",
            height: "100%",
            opacity: isDragActive ? 1 : 0,
            transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
          }}
        />
      </ButtonBase>
      {fileUploadError && (
        <FormHelperText error={error} sx={{ marginLeft: 2 }}>
          {helperText}
        </FormHelperText>
      )}
      {invalidFiles.length > 0 && <>{renderInvalidFiles(invalidFiles)}</>}
      {validFiles.length > 0 && <>{renderFiles(validFiles)}</>}
    </Stack>
  )
}

FileUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  acceptedFiles: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  maxSize: PropTypes.number,
  maxTotalFileSize: PropTypes.number
}

export default FileUpload
