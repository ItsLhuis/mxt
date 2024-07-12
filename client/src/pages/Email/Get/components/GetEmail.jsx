import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { emailSchema } from "@schemas/email"

import { useClient } from "@hooks/server/useClient"
import { useEmail } from "@hooks/server/useEmail"

import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Stack,
  FormControl,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
  IconButton,
  Typography
} from "@mui/material"
import { Email, Search } from "@mui/icons-material"

import { HeaderSection, RichEditor, FileUpload, Modal, Caption } from "@components/ui"

const GetEmail = () => {
  return <>Ola</>
}

export default GetEmail
