import React from "react"

import { EditorProvider } from "@tiptap/react"

import { Color } from "@tiptap/extension-color"
import ListItem from "@tiptap/extension-list-item"
import TextStyle from "@tiptap/extension-text-style"
import Placeholder from "@tiptap/extension-placeholder"

import StarterKit from "@tiptap/starter-kit"

import MenuBar from "./MenuBar"

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
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
  Placeholder.configure({
    placeholder: () => {
      return "Escreva qualquer coisa fantástica..."
    }
  })
]

const RichEditor = () => {
  return <EditorProvider slotBefore={<MenuBar />} extensions={extensions} />
}

export default RichEditor
