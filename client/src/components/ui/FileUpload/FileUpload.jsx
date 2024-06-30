import PropTypes from "prop-types"

import React, { useState, useRef } from "react"

import { useDropzone } from "react-dropzone"

import { useTheme } from "@contexts/theme"

import { produce } from "immer"

import { Stack, Box, Typography, IconButton, ButtonBase, Tooltip } from "@mui/material"
import { PictureAsPdf, Image, Delete } from "@mui/icons-material"

import { motion, AnimatePresence } from "framer-motion"

import Lottie from "lottie-react"
import LottieAnimationDark from "./Lottie/dark.json"
import LottieAnimationLight from "./Lottie/light.json"

const LottieAnimation = {
  dark: LottieAnimationDark,
  light: LottieAnimationLight
}

const FileUpload = ({
  value = [],
  onChange,
  acceptedFiles = {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "application/pdf": [".pdf"]
  },
  maxSize = 5 * 1024 * 1024,
  ...props
}) => {
  const { dataTheme } = useTheme()

  const inputRef = useRef(null)

  const [validFiles, setValidFiles] = useState([])
  const [invalidFiles, setInvalidFiles] = useState([])

  const isValidFile = (file) => {
    const fileMime = file.type
    const acceptedExtensions = Object.values(acceptedFiles).flat()
    return (
      acceptedExtensions.some((extension) => file.name.toLowerCase().endsWith(extension)) &&
      Object.keys(acceptedFiles).includes(fileMime)
    )
  }

  const onDrop = (files) => {
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

    setInvalidFiles((currentInvalidFiles) =>
      produce(currentInvalidFiles, (draft) => {
        draft.push(...invalidFilesToAdd)
      })
    )

    onChange([...validFiles, ...validFilesToAdd])
  }

  const handleClickInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleInputChange = (e) => {
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

    setInvalidFiles((currentInvalidFiles) =>
      produce(currentInvalidFiles, (draft) => {
        draft.push(...invalidFilesToAdd)
      })
    )

    e.target.value = null

    onChange([...validFiles, ...validFilesToAdd])
  }

  const removeFile = (fileToRemove) => {
    setValidFiles((currentFiles) =>
      produce(currentFiles, (draft) => {
        return draft.filter((file) => file !== fileToRemove)
      })
    )
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    maxSize
  })

  const renderFiles = (files) => {
    return (
      <AnimatePresence mode="wait">
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                backgroundColor: "var(--elevation-level4)",
                borderRadius: "8px"
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {acceptedFiles["application/pdf"].includes(file.name.toLowerCase().slice(-4)) ? (
                  <PictureAsPdf fontSize="large" sx={{ color: "rgb(223, 88, 84)" }} />
                ) : (
                  <Image fontSize="large" sx={{ color: "rgb(245, 128, 8)" }} />
                )}
                <Stack>
                  <Typography variant="p" component="p">
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
                <IconButton onClick={() => removeFile(file)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          </motion.div>
        ))}
      </AnimatePresence>
    )
  }

  return (
    <Stack sx={{ padding: 0, gap: 1 }} {...props}>
      <ButtonBase
        {...getRootProps()}
        sx={{
          cursor: "pointer",
          borderRadius: "8px",
          border: isDragActive ? "2px dashed var(--primary)" : "2px dashed var(--outline)",
          margin: 0,
          position: "relative",
          paddingInline: 3,
          "&:hover": {
            backgroundColor: "rgba(20, 20, 20, 0.5)"
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
              <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                Permitido
                {Object.keys(acceptedFiles).map((type, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && ", "}*{acceptedFiles[type].join(", *.")}
                  </React.Fragment>
                ))}
              </Typography>
              <Typography variant="p" component="p" sx={{ color: "var(--outline)" }}>
                Tamanho máximo de {Math.floor((maxSize / (1024 * 1024)).toFixed(2))} Mb por ficheiro
              </Typography>
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
            backgroundColor: "rgba(20, 20, 20, 0.5)",
            width: "100%",
            height: "100%",
            opacity: isDragActive ? 1 : 0,
            transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
          }}
        />
      </ButtonBase>
      <Stack sx={{ flexWrap: "wrap", justifyContent: "flex-start", gap: 1 }}>
        {validFiles.length > 0 && <>{renderFiles(validFiles)}</>}
      </Stack>
    </Stack>
  )
}

FileUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  acceptedFiles: PropTypes.string,
  maxSize: PropTypes.number
}

export default FileUpload
