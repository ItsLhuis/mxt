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
      <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
        <img src={`${BASE_URL}/company/logo?size=1400`} style={{ width: "360px" }} />
        <h1 style={{ fontSize: 54 }}>{equipmentId}</h1>
      </div>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginTop: "8px"
        }}
      >
        {formatPhoneNumber(companyData?.phone_number)}
        {companyData?.phone_number && companyData?.website && <strong> | </strong>}
        {companyData?.website}
      </p>
    </div>
  )
})

export default RepairStamp
