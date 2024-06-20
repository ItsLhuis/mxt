import React, { useState } from "react"

import { EditorContent, useEditor } from "@tiptap/react"

import StarterKit from "@tiptap/starter-kit"
import Color from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import ListItem from "@tiptap/extension-list-item"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"

import { Box, Stack, Typography, CircularProgress } from "@mui/material"

import { Loadable } from ".."

import MenuBar from "./MenuBar"

import { debounce } from "@utils/debounce"

const RichEditor = ({ label, value, onChange }) => {
  const [fullscreen, setFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Placeholder.configure({
        placeholder: () => {
          return "Escreva qualquer coisa fantástica..."
        }
      }),
      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
          "blockQuote",
          "listItem",
          "codeBlock",
          "image",
          "taskItem",
          "orderedList",
          "bulletList"
        ]
      }),
      Underline,
      Link.configure({ openOnClick: true, defaultProtocol: "https" })
    ],
    content: value,
    onUpdate: debounce(({ editor }) => {
      const htmlContent = editor.getHTML()
      onChange(htmlContent)
    }, 100)
  })

  return (
    <Loadable
      isLoading={!editor}
      LoadingComponent={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--elevation-level2)",
            width: "100%",
            height: 360,
            borderRadius: "8px"
          }}
        >
          <CircularProgress />
        </Box>
      }
      LoadedComponent={
        <Box>
          <Typography variant="p" component="p" sx={{ marginBottom: 1.5 }}>
            {label}
          </Typography>
          <MenuBar editor={editor} fullscreen={fullscreen} toggleFullscreen={toggleFullscreen} />
          {fullscreen && (
            <Stack
              sx={{
                position: "fixed",
                top: 14,
                left: 14,
                zIndex: 1300,
                width: "calc(100% - 28px)",
                height: "calc(100% - 28px)",
                overflow: "hidden"
              }}
            >
              <MenuBar
                editor={editor}
                fullscreen={fullscreen}
                toggleFullscreen={toggleFullscreen}
              />
              <EditorContent
                className={`tiptap-editor ${fullscreen && "fullscreen"}`}
                editor={editor}
              />
            </Stack>
          )}
          {!fullscreen && <EditorContent editor={editor} />}
        </Box>
      }
    />
  )
}

export default RichEditor
