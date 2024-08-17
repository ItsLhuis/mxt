import React, { forwardRef } from "react"

import { BASE_URL } from "@api"

import { formatPhoneNumber } from "@utils/format/phone"

const RepairStamp = forwardRef(({ equipmentId, companyData }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <img
          src={`${BASE_URL}/company/logo?size=1400`}
          style={{ width: 200, marginBottom: "16px" }}
        />
        <p>Mixtura, Espinho 3493-232 espinho</p>
        <p>+351 938 838 928</p>
      </div>
    </div>
  )
})

export default RepairStamp
