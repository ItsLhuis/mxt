import React from "react"

import {
  Box,
  Paper,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"

import { Linkify } from ".."

import { motion } from "framer-motion"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
  }

  formatStackTrace(stack) {
    return stack
      .split("\n")
      .filter((line) => line.includes("at "))
      .map((line) => line.trim())
      .join("\n")
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ height: "100vh", display: "flex" }}
        >
          {process.env.NODE_ENV === "development" ? (
            <Stack sx={{ width: "100%", margin: "auto", gap: 2, padding: 3, alignItems: "center" }}>
              <Paper
                elevation={1}
                sx={{
                  position: "relative",
                  padding: 3,
                  paddingTop: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    backgroundColor: "rgb(211, 47, 47)",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}
                />
                <Typography variant="h4" component="h4" sx={{ color: "rgb(211, 47, 47)" }}>
                  {this.state.error && this.state.error.toString()}
                </Typography>
                <Linkify
                  text={this.state.error ? this.state.error.stack : ""}
                  sx={{
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap"
                  }}
                />
                <Accordion
                  elevation={2}
                  sx={{
                    "&.Mui-expanded": { margin: 0 },
                    "& .MuiButtonBase-root .MuiTypography-root": { fontSize: 14 },
                    "::before": { content: "unset" }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ cursor: "pointer" }}>
                    <Typography>{this.state.errorInfo && "Error details"}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Linkify
                      text={
                        this.state.errorInfo
                          ? this.formatStackTrace(this.state.errorInfo.componentStack)
                          : ""
                      }
                      sx={{
                        fontSize: 12,
                        color: "var(--outline)",
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap"
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Stack>
          ) : (
            <Stack sx={{ width: "100%", margin: "auto", gap: 2, padding: 3, alignItems: "center" }}>
              <Stack sx={{ textAlign: "center", gap: 1.5 }}>
                <Typography variant="h3" component="h3">
                  Ocorreu um erro inesperado!
                </Typography>
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "var(--outline)", fontSize: 14 }}
                >
                  Por favor, atualize a página. Se o problema persistir, entre em contato com o
                  suporte.
                </Typography>
              </Stack>
            </Stack>
          )}
        </motion.div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
