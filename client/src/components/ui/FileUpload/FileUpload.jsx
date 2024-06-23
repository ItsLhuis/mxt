import PropTypes from "prop-types"

import React, { useState } from "react"

import { useDropzone } from "react-dropzone"

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

const FileUpload = ({
  value = [],
  onChange,
  acceptedFiles = "image/*,application/pdf",
  maxSize = 5 * 1024 * 1024,
  ...props
}) => {
  const [validFiles, setValidFiles] = useState([])
  const [invalidFiles, setInvalidFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})

  const onDrop = (acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      const progressInterval = setInterval(() => {
        if (uploadProgress[file.name] < 100) {
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: prevProgress[file.name] ? prevProgress[file.name] + 5 : 5
          }))
        } else {
          clearInterval(progressInterval)
          const updatedFiles = [...validFiles, file]
          setValidFiles(updatedFiles)
          onChange(updatedFiles)
        }
      }, 200)
    })

    setInvalidFiles(
      rejectedFiles.map((rej) => ({
        file: rej.file,
        errors: rej.errors.map((e) => e.message).join(", ")
      }))
    )
  }

  const handleClickInput = (e) => {
    e.stopPropagation()
  }

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files)
    onDrop(files, [])
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    maxSize
  })

  const removeFile = (file, type) => {
    if (type === "valid") {
      const updatedFiles = validFiles.filter((f) => f !== file)
      setValidFiles(updatedFiles)
      onChange(updatedFiles)
    } else {
      setInvalidFiles(invalidFiles.filter((f) => f.file !== file))
    }
  }

  const renderFiles = (files, type) => (
    <List>
      {files.map((file, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={file.name}
            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
            sx={{ color: type === "invalid" ? "red" : "black" }}
          />
          {uploadProgress[file.name] && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress[file.name]}
              sx={{ width: "50%", marginLeft: "10px" }}
            />
          )}
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => removeFile(file, type)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )

  return (
    <Box>
      <Box {...getRootProps()} sx={styles.dropzone} onClick={handleClickInput}>
        <input {...getInputProps()} onChange={handleInputChange} />
        <Typography variant="body2">
          Arraste e solte arquivos aqui ou clique para selecionar arquivos
        </Typography>
        <em>
          (Apenas arquivos aceitos: {acceptedFiles}, com tamanho máximo de {maxSize / 1024 / 1024}
          MB)
        </em>
      </Box>
      <Typography variant="h6">Arquivos Válidos</Typography>
      {renderFiles(validFiles, "valid")}
      <Typography variant="h6" sx={{ color: "red" }}>
        Arquivos Inválidos
      </Typography>
      {renderFiles(invalidFiles, "invalid")}
    </Box>
  )
}

const styles = {
  dropzone: {
    border: "2px dashed #cccccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    marginTop: "20px",
    cursor: "pointer"
  }
}

FileUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  acceptedFiles: PropTypes.string,
  maxSize: PropTypes.number
}

export default FileUpload
