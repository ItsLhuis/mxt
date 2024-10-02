import React from "react"

import { Typography, Link } from "@mui/material"

const Linkify = ({ text, ...rest }) => {
  const linkRegex = /(https?:\/\/[^\s]+)/gi

  const parts = text ? text.split(linkRegex) : [""]

  return (
    <Typography variant="p" component="p" {...rest}>
      {parts.map((part, index) =>
        linkRegex.test(part) ? (
          <Link key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </Link>
        ) : (
          part
        )
      )}
    </Typography>
  )
}

export default Linkify
