import React, { useState } from "react"

import { Box, Stack, Button, Tooltip, Divider, TextField } from "@mui/material"
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
  FormatQuote,
  HorizontalRule,
  WrapText,
  FormatClear,
  Fullscreen,
  Link,
  LinkOff,
  FullscreenExit
} from "@mui/icons-material"

import { ButtonDropDownSelect, ListButton } from "@components/ui"

const LinkForm = ({ insertLink, linkUrl, handleLinkUrlChange, onClose }) => {
  return (
    <Stack sx={{ padding: 2, minWidth: 300 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          insertLink()
          onClose()
        }}
      >
        <TextField
          label="URL do link"
          variant="outlined"
          value={linkUrl}
          onChange={handleLinkUrlChange}
          fullWidth
          sx={{ marginBottom: 1 }}
        />
        <Stack sx={{ flexDirection: "row", gap: 1 }}>
          <Button onClick={onClose} variant="contained" color="secondary" sx={{ width: "100%" }}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              insertLink()
              onClose()
            }}
            variant="contained"
            color="primary"
            disabled={!linkUrl}
            type="submit"
            sx={{ width: "100%" }}
          >
            Inserir Link
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}

const ToolBar = ({ editor, fullscreen, toggleFullscreen, disabled }) => {
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

  const canUndo = editor.can().undo()
  const canRedo = editor.can().redo()
  const canUnlink = editor.isActive("link")

  const [linkUrl, setLinkUrl] = useState("")

  const insertLink = () => {
    editor.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl("")
  }

  const handleLinkUrlChange = (event) => {
    setLinkUrl(event.target.value)
  }

  return (
    <Stack
      className="tiptap-menubar"
      sx={{
        borderInline: "2px solid var(--elevation-level5)",
        borderTop: "2px solid var(--elevation-level5)",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: "var(--background)"
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          overflow: "hidden",
          overflowX: "auto",
          padding: 2
        }}
      >
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <Tooltip title="Desfazer">
            <span>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Desfazer"
                onClick={() => editor.chain().focus().undo().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: "transparent !important"
                }}
                disabled={!canUndo || disabled}
              >
                <Undo
                  sx={{ color: !canUndo && "var(--outline) !important", opacity: !canUndo && 0.5 }}
                />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Refazer">
            <span>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Refazer"
                onClick={() => editor.chain().focus().redo().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: "transparent !important"
                }}
                disabled={!canRedo || disabled}
              >
                <Redo
                  sx={{ color: !canRedo && "var(--outline) !important", opacity: !canRedo && 0.5 }}
                />
              </Button>
            </span>
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
          <ButtonDropDownSelect title={currentTextMode} disabled={disabled}>
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
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <Tooltip title="Negrito">
            <span>
              <Button
                variant="contained"
                color={editor.isActive("bold") ? "primary" : "secondary"}
                aria-label="Negrito"
                onClick={() => editor.chain().focus().toggleBold().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: !editor.isActive("bold") && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatBold />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Itálico">
            <span>
              <Button
                variant="contained"
                color={editor.isActive("italic") ? "primary" : "secondary"}
                aria-label="Itálico"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: !editor.isActive("italic") && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatItalic />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Sublinhado">
            <span>
              <Button
                variant="contained"
                color={editor.isActive("underline") ? "primary" : "secondary"}
                aria-label="Sublinhado"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: !editor.isActive("underline") && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatUnderlined />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Riscado">
            <span>
              <Button
                variant="contained"
                color={editor.isActive("strike") ? "primary" : "secondary"}
                aria-label="Riscado"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: !editor.isActive("strike") && "transparent !important"
                }}
                disabled={disabled}
              >
                <StrikethroughS />
              </Button>
            </span>
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
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <Tooltip title="Lista com marcadores">
            <span>
              <Button
                variant="contained"
                color={editor.isActive("bulletList") ? "primary" : "secondary"}
                aria-label="Lista com marcadores"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: !editor.isActive("bulletList") && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatListBulleted />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Lista numerada">
            <span>
              <Button
                variant="contained"
                color={editor.isActive("orderedList") ? "primary" : "secondary"}
                aria-label="Lista numerada"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: !editor.isActive("orderedList") && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatListNumbered />
              </Button>
            </span>
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
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <Tooltip title="Alinhamento à esquerda">
            <span>
              <Button
                variant="contained"
                color={editor.isActive({ textAlign: "left" }) ? "primary" : "secondary"}
                aria-label="Alinhamento à esquerda"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor:
                    !editor.isActive({ textAlign: "left" }) && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatAlignLeft />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Alinhamento ao centro">
            <span>
              <Button
                variant="contained"
                color={editor.isActive({ textAlign: "center" }) ? "primary" : "secondary"}
                aria-label="Alinhamento ao centro"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor:
                    !editor.isActive({ textAlign: "center" }) && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatAlignCenter />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Alinhamento à direita">
            <span>
              <Button
                variant="contained"
                color={editor.isActive({ textAlign: "right" }) ? "primary" : "secondary"}
                aria-label="Alinhamento à direita"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor:
                    !editor.isActive({ textAlign: "right" }) && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatAlignRight />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Justificar">
            <span>
              <Button
                variant="contained"
                color={editor.isActive({ textAlign: "justify" }) ? "primary" : "secondary"}
                aria-label="Justificar"
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor:
                    !editor.isActive({ textAlign: "justify" }) && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatAlignJustify />
              </Button>
            </span>
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
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <Tooltip title="Citação">
            <span>
              <Button
                variant="contained"
                color={editor.isActive("blockquote") ? "primary" : "secondary"}
                aria-label="Citação"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: !editor.isActive("blockquote") && "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatQuote />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Separador">
            <span>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Separador"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: "transparent !important"
                }}
                disabled={disabled}
              >
                <HorizontalRule />
              </Button>
            </span>
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
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <Tooltip title="Quebra de texto">
            <span>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Quebra de texto"
                onClick={() => editor.chain().focus().setHardBreak().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: "transparent !important"
                }}
                disabled={disabled}
              >
                <WrapText />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Limpar formatação">
            <span>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Limpar formatação"
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: "transparent !important"
                }}
                disabled={disabled}
              >
                <FormatClear />
              </Button>
            </span>
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
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <ButtonDropDownSelect
            mode="custom"
            customButton={
              <Tooltip title="Inserir link">
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    aria-label="Inserir link"
                    sx={{
                      minHeight: "40px !important",
                      minWidth: "40px !important",
                      padding: "0 !important",
                      backgroundColor: "transparent !important"
                    }}
                    disabled={disabled}
                  >
                    <Link />
                  </Button>
                </span>
              </Tooltip>
            }
          >
            <LinkForm
              insertLink={insertLink}
              linkUrl={linkUrl}
              handleLinkUrlChange={handleLinkUrlChange}
            />
          </ButtonDropDownSelect>
          <Tooltip title="Remover link">
            <span>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Remover link"
                onClick={() => editor.chain().focus().unsetLink().run()}
                sx={{
                  minHeight: "40px !important",
                  minWidth: "40px !important",
                  padding: "0 !important",
                  backgroundColor: "transparent !important"
                }}
                disabled={!canUnlink || disabled}
              >
                <LinkOff
                  sx={{
                    color: !canUnlink && "var(--outline) !important",
                    opacity: !canUnlink && 0.5
                  }}
                />
              </Button>
            </span>
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
        <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
          <Tooltip title={fullscreen ? "Minimizar" : "Maximizar"}>
            <Button
              variant="contained"
              color={fullscreen ? "primary" : "secondary"}
              aria-label={fullscreen ? "Minimizar" : "Maximizar"}
              onClick={toggleFullscreen}
              sx={{
                minHeight: "40px !important",
                minWidth: "40px !important",
                padding: "0 !important",
                backgroundColor: !fullscreen && "transparent !important"
              }}
            >
              {fullscreen ? <FullscreenExit /> : <Fullscreen />}
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ToolBar
