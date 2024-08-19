import PropTypes from "prop-types"

import React, { forwardRef } from "react"

const PrintLayout = forwardRef(({ header, body, footer }, ref) => {
  return (
    <div ref={ref} style={{ position: "relative", height: "100%" }}>
      <style>
        {`
        th, td {
          text-align: left;
        }
        thead th {
          padding: 16px;
        }
        tbody td {
          padding: 8px 16px;
        }
        tfoot td {
          padding: 16px;
        }
       `}
      </style>
      <table style={{ display: "table", borderCollapse: "collapse" }}>
        <thead style={{ visibility: "hidden" }}>
          <tr>
            <th>{header}</th>
          </tr>
        </thead>
        <thead
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}
        >
          <tr
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1
            }}
          >
            <th
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1
              }}
            >
              {header}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{body}</td>
          </tr>
        </tbody>
        <tfoot style={{ visibility: "hidden" }}>
          <tr>
            <td>{footer}</td>
          </tr>
        </tfoot>
        <tfoot
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}
        >
          <tr
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1
            }}
          >
            <td
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1
              }}
            >
              {footer}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
})

PrintLayout.propTypes = {
  header: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired
}

export default PrintLayout
