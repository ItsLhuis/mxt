import React, { forwardRef } from "react"

import { BASE_URL } from "@api"

import { PrintLayout } from "@components/ui"

import { formatPhoneNumber } from "@utils/format/phone"

const RepairStamp = forwardRef(({ repairData, companyData }, ref) => {
  if (!repairData || !companyData) return

  /*   const {
    status,
    equipment,
    entry_datetime,
    entry_accessories,
    entry_accessories_description,
    entry_reported_issues,
    entry_reported_issues_description,
    entry_description,
    intervention_works_done,
    intervention_works_done_description,
    intervention_accessories_used,
    intervention_accessories_used_description,
    conclusion_datetime,
    delivery_datetime,
    is_client_notified,
    intervention_description
  } = repairData */

  const {
    address,
    postal_code: companyPostalCode,
    locality,
    city,
    country,
    phone_number: companyPhoneNumber
  } = companyData

  return (
    <PrintLayout
      ref={ref}
      header={
        <header>
          <img src={`${BASE_URL}/company/logo?size=1400`} style={{ width: 200 }} />
          <div>{"Page Header"}</div>
        </header>
      }
      body={
        <main>
          <p>{`${address}, ${companyPostalCode}, ${locality}`}</p>
          <p>{city}</p>
          <p>{country}</p>
          <p>{formatPhoneNumber(companyPhoneNumber)}</p>
        </main>
      }
      footer={
        <footer>
          <div style={{ borderTop: "1px solid #ccc", marginBottom: "8px" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <p>Page footer</p>
            <p>Page footer</p>
          </div>
        </footer>
      }
    />
  )
})

export default RepairStamp
