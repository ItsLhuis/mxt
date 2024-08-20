import React, { forwardRef } from "react"

import { BASE_URL } from "@api"

import { formatPhoneNumber } from "@utils/format/phone"

const RepairStamp = forwardRef(({ equipmentId, companyData, isFinished }, ref) => {
  if (!isFinished) return
  
  const { website, phone_number: phoneNumber } = companyData

  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px"
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
          {formatPhoneNumber(phoneNumber)}
          {phoneNumber && website && <strong> | </strong>}
          {website}
        </p>
      </div>
    </div>
  )
})

export default RepairStamp
