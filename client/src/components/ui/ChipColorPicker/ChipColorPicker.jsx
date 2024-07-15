import PropTypes from "prop-types"

import React from "react"

import { ButtonBase, Chip, Stack, Skeleton, InputLabel, FormHelperText } from "@mui/material"

import { Loadable } from ".."

const COLORS = ["default", "primary", "error", "info", "success", "warning"]

const ChipColorPicker = ({
  label,
  isLoading = false,
  selected = "default",
  onChange,
  error,
  errorMessage
}) => {
  return (
    <Stack>
      {label && (
        <InputLabel
          sx={{
            marginBottom: 1,
            color: error ? "rgb(211, 47, 47) !important" : "var(--onSurface)"
          }}
        >
          {label}
        </InputLabel>
      )}
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1 }}>
        <Loadable
          isLoading={isLoading}
          LoadingComponent={
            <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1 + "2.25px" }}>
              {COLORS.map((color) => (
                <Skeleton key={color} variant="circular" height={30} width={30} />
              ))}
            </Stack>
          }
          LoadedComponent={
            <>
              {COLORS.map((color) => (
                <ButtonBase
                  key={color}
                  onClick={() => {
                    if (typeof onChange === "function") onChange(color)
                  }}
                  sx={{
                    backgroundColor: selected === color && "var(--onSurface)",
                    borderRadius: "50%",
                    padding: 0.25
                  }}
                >
                  <Chip
                    color={color}
                    sx={{
                      borderRadius: "50% !important",
                      width: 30,
                      height: 30,
                      border: "2px solid var(--background)"
                    }}
                  />
                </ButtonBase>
              ))}
            </>
          }
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px" }}
        />
        {error && (
          <FormHelperText error={error} sx={{ marginLeft: 2, marginTop: 0.5 }}>
            {errorMessage}
          </FormHelperText>
        )}
      </Stack>
    </Stack>
  )
}

ChipColorPicker.propTypes = {
  label: PropTypes.string,
  isLoading: PropTypes.bool,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string
}

export default ChipColorPicker
