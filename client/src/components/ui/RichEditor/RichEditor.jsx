import React, { useState, useRef, useEffect } from "react"

import { EditorContent, useEditor } from "@tiptap/react"

import StarterKit from "@tiptap/starter-kit"
import Color from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import ListItem from "@tiptap/extension-list-item"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"

import { Box, Stack, Typography, Skeleton } from "@mui/material"

import { Loadable } from ".."

import MenuBar from "./MenuBar"

import { debounce } from "@utils/debounce"

const RichEditor = ({ label, value, onChange, isLoading = false }) => {
  const [isFinished, setIsFinished] = useState(false)
  const isFirstRender = useRef(true)
  const timeoutRef = useRef(null)

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

  useEffect(() => {
    if (isFinished && value) {
      if (isFirstRender.current) {
        isFirstRender.current = false
        editor.commands.setContent(value || "")
      }
    }
  }, [value, isFinished])

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (editor && !isLoading) {
        setIsFinished(true)
      }
    }, 200)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [editor, isLoading])

  useEffect(() => {
    if (!isFinished) return

    if (!value) {
      editor.commands.setContent("")
    }
  }, [value])

  return (
    <Loadable
      isLoading={!isFinished}
      LoadingComponent={<Skeleton variant="rounded" width="100%" height={425} />}
      LoadedComponent={
        <Box>
          {label && (
            <Typography variant="p" component="p" sx={{ marginBottom: 1 }}>
              {label}
            </Typography>
          )}
          <MenuBar editor={editor} fullscreen={fullscreen} toggleFullscreen={toggleFullscreen} />
          {fullscreen && (
            <Stack
              className="tiptap-fullscreen"
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 900,
                height: "100%",
                width: "100%",
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
