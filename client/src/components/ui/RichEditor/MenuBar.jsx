import React from "react"

import { useCurrentEditor } from "@tiptap/react"

import { Box, Stack, IconButton, Tooltip, Divider } from "@mui/material"

import { ButtonDropDownSelect, ListButton } from "@components/ui"
import {
  Undo,
  Redo,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  WrapText,
  FormatClear
} from "@mui/icons-material"

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  const textModes = [
    {
      label: "Muito grande",
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
    },
    {
      label: "Grande",
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      label: "Normal",
      command: () => editor.chain().focus().setParagraph().run()
    },
    {
      label: "Pequeno",
      command: () => editor.chain().focus().toggleHeading({ level: 5 }).run()
    },
    {
      label: "Muito pequeno",
      command: () => editor.chain().focus().toggleHeading({ level: 6 }).run()
    }
  ]

  const getCurrentTextMode = () => {
    if (editor.isActive("heading", { level: 1 })) {
      return "Muito grande"
    } else if (editor.isActive("heading", { level: 2 })) {
      return "Grande"
    } else if (editor.isActive("heading", { level: 5 })) {
      return "Pequeno"
    } else if (editor.isActive("heading", { level: 6 })) {
      return "Muito pequeno"
    } else {
      return "Normal"
    }
  }

  const currentTextMode = getCurrentTextMode()

  return (
    <Stack
      sx={{
        borderInline: "2px solid var(--elevation-level5)",
        borderTop: "2px solid var(--elevation-level5)",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
      }}
    >
      <Stack
        sx={{
          display: "flex",
          flexFlow: "wrap",
          alignItems: "center",
          gap: 1,
          overflow: "hidden",
          overflowX: "auto",
          padding: 2
        }}
      >
        <Stack sx={{ display: "flex", flexFlow: "wrap", gap: 0.5 }}>
          <Tooltip title="Desfazer">
            <IconButton
              aria-label="Desfazer"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refazer">
            <IconButton
              aria-label="Refazer"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <Redo />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <Box>
          <ButtonDropDownSelect title={currentTextMode}>
            <ListButton
              buttons={textModes.map(({ label, command }) => ({
                label,
                onClick: () => {
                  command()
                },
                selected: label === currentTextMode
              }))}
            />
          </ButtonDropDownSelect>
        </Box>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <Stack sx={{ display: "flex", flexFlow: "wrap", gap: 0.5 }}>
          <Tooltip title="Negrito">
            <IconButton
              aria-label="Negrito"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="Itálico">
            <IconButton
              aria-label="Itálico"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatItalic />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sublinhado">
            <IconButton
              aria-label="Sublinhado"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatUnderlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Riscado">
            <IconButton
              aria-label="Riscado"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <StrikethroughS />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <Stack sx={{ display: "flex", flexFlow: "wrap", gap: 0.5 }}>
          <Tooltip title="Lista com marcadores">
            <IconButton
              aria-label="Lista com marcadores"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatListBulleted />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lista numerada">
            <IconButton
              aria-label="Lista numerada"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatListNumbered />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <Stack sx={{ display: "flex", flexFlow: "wrap", gap: 0.5 }}>
          <Tooltip title="Alinhar à esquerda">
            <IconButton
              aria-label="Alinhar à esquerda"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatAlignLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alinhar ao centro">
            <IconButton
              aria-label="Alinhar ao centro"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatAlignCenter />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alinhar à direita">
            <IconButton
              aria-label="Alinhar à direita"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatAlignRight />
            </IconButton>
          </Tooltip>
          <Tooltip title="Justificar">
            <IconButton
              aria-label="Justificar"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatAlignJustify />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            borderColor: "var(--elevation-level5)",
            borderWidth: 1
          }}
        />
        <Stack sx={{ display: "flex", flexFlow: "wrap", gap: 0.5 }}>
          <Tooltip title="Quebrar texto">
            <IconButton
              aria-label="Quebrar texto"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <WrapText />
            </IconButton>
          </Tooltip>
          <Tooltip title="Limpar formatação">
            <IconButton
              aria-label="Limpar formatação"
              size="normal"
              onClick={() => null}
              sx={{ borderRadius: "8px !important" }}
            >
              <FormatClear />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default MenuBar
