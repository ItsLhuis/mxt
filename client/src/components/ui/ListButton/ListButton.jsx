import PropTypes from "prop-types"

import React from "react"

import { List, ListItem, Divider, Button, Typography, Stack, Skeleton } from "@mui/material"

import { Loadable } from ".."

const ListButton = ({ buttons, onClose }) => {
  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: "90px"
      }}
    >
      {buttons.map((button, index) => (
        <Stack key={index}>
          {button.divider && (
            <Divider
              sx={{
                marginBottom: 0.5,
                marginTop: 0.5,
                borderColor: "var(--elevation-level5)",
                borderWidth: 1
              }}
            />
          )}
          {button.title && (
            <>
              <Typography
                variant="p"
                component="p"
                sx={{ marginInline: 1, color: "var(--outline)", fontWeight: 600 }}
              >
                {button.title}
              </Typography>
              <Divider
                sx={{
                  marginBottom: 0.5,
                  marginTop: 0.5,
                  borderColor: "var(--elevation-level5)",
                  borderWidth: 1
                }}
              />
            </>
          )}
          <Stack sx={{ margin: "0 8px !important" }}>
            <ListItem
              key={index}
              disablePadding
              sx={{ marginBottom: index !== buttons.length - 1 && "4px" }}
            >
              <Loadable
                isLoading={button.isSkeletonLoading || false}
                LoadingComponent={
                  <Skeleton variant="rounded" height={39} sx={{ minWidth: "100%" }}>
                    <Button sx={{ margin: "0 important", padding: "8px 14px !important" }}>
                      <Typography variant="p" component="p" sx={{ fontWeight: 400 }}>
                        {button.label}
                      </Typography>
                    </Button>
                  </Skeleton>
                }
                LoadedComponent={
                  <Button
                    color={button.color}
                    onClick={() => {
                      button.onClick()
                      onClose()
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      margin: "0 important",
                      padding: "8px 14px !important",
                      width: "100%",
                      color: button.color ?? "inherit",
                      backgroundColor: button.selected && "rgba(88, 101, 242, 0.08)",
                      minHeight: "unset !important",
                      "&:hover": {
                        backgroundColor: button.selected
                          ? "rgba(88, 101, 242, 0.12) !important"
                          : button.color ?? "var(--secondaryContainer)"
                      }
                    }}
                  >
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1
                      }}
                    >
                      {button.icon}
                      <Typography variant="p" component="p" sx={{ fontWeight: 400 }}>
                        {button.label}
                      </Typography>
                    </Stack>
                  </Button>
                }
                style={{ width: "100%" }}
              />
            </ListItem>
          </Stack>
        </Stack>
      ))}
    </List>
  )
}

ListButton.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      onClick: PropTypes.func.isRequired,
      selected: PropTypes.bool,
      divider: PropTypes.bool,
      isSkeletonLoading: PropTypes.bool
    })
  ).isRequired,
  onClose: PropTypes.func
}

export default ListButton
