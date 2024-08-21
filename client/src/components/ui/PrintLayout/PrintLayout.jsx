import PropTypes from "prop-types"

import React, { forwardRef } from "react"

const PrintLayout = forwardRef(({ header, body, footer, isToAnalyze = false }, ref) => {
  return (
    <div ref={ref} style={{ height: "100%" }}>
      <style>
        {`
          th, td {
            text-align: left;
          }
          thead th {
            padding: 32px 32px 24px 32px;
          }
          tbody td {
            padding: 0 32px;
          }
          tfoot td {
            padding: 24px 32px 32px 32px;
          }
          tbody blockquote {
            border-left: 1px solid #ccc;
            padding-left: 16px;
          }
          tbody  hr {
            margin: 16px 0;
          }
       `}
      </style>
      <table style={{ display: "table", borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ visibility: !isToAnalyze && "hidden" }}>
          <tr>
            <th>{header}</th>
          </tr>
        </thead>
        {!isToAnalyze && (
          <thead style={{ position: "fixed", top: 0, width: "100%" }}>
            <tr>
              <th
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0
                }}
              >
                {header}
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          <tr>
            <td>{body}</td>
          </tr>
        </tbody>
        <tfoot style={{ visibility: !isToAnalyze && "hidden" }}>
          <tr>
            <td>{footer}</td>
          </tr>
        </tfoot>
        {!isToAnalyze && (
          <tfoot style={{ position: "fixed", bottom: 0, width: "100%" }}>
            <tr>
              <td
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0
                }}
              >
                {footer}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
})

PrintLayout.propTypes = {
  header: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  isToAnalyze: PropTypes.bool
}

export default PrintLayout
