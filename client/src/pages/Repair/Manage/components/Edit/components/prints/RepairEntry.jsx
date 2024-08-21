import React, { forwardRef } from "react"

import { BASE_URL } from "@api"

import { PrintLayout } from "@components/ui"

import { formatHTML } from "@utils/format/formatHTML"
import { formatPhoneNumber } from "@utils/format/phone"
import { formatDateTimeExportExcel } from "@utils/format/date"

const RepairEntry = forwardRef(({ repairData, companyData, isFinished }, ref) => {
  if (!isFinished) return

  const {
    id: repairId,
    equipment,
    entry_datetime,
    entry_accessories,
    entry_accessories_description
  } = repairData

  const {
    name,
    email,
    website,
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
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1>Entrada do Equipamento</h1>
                <h4>{`#${repairId}`}</h4>
              </div>
              <div style={{ fontWeight: "normal" }}>
                <h4>{name}</h4>
                <p>{`${address}, ${companyPostalCode}, ${locality}`}</p>
                <p>{`${city}, ${country}`}</p>
              </div>
            </div>
            <img
              src={`${BASE_URL}/company/logo?size=1400`}
              style={{ maxHeight: 160, maxWidth: 160 }}
            />
          </div>
          <hr style={{ marginTop: "8px" }} />
        </header>
      }
      body={
        <main
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px"
          }}
        >
          <style>
            {`
              .label-main {
                font-weight: 550;
              }
            `}
          </style>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Equipamento</label>
            <p>{`${equipment?.type?.name}, ${equipment?.brand?.name} ${equipment?.model?.name} #${equipment?.sn}`}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Data de entrada</label>
            <p>{formatDateTimeExportExcel(entry_datetime) || "Sem valor"}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Acessórios</label>
            <p>
              {entry_accessories.length > 0
                ? entry_accessories.map((entry_accessory) => entry_accessory?.name).join(", ")
                : "Sem valor"}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: entry_accessories_description && "4px",
              width: "100%"
            }}
          >
            <label className="label-main">Descrição dos acessórios</label>
            <div
              style={
                entry_accessories_description && {
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "8px"
                }
              }
            >
              {entry_accessories_description ? (
                <span dangerouslySetInnerHTML={formatHTML(entry_accessories_description)} />
              ) : (
                <p>Sem valor</p>
              )}
            </div>
          </div>
        </main>
      }
      footer={
        <footer>
          <style>
            {`
            .p-footer {
              font-size: 10px;
            }
          `}
          </style>
          <p style={{ marginBottom: "8px" }} className="p-footer">
            A apresentação deste documento é obrigatória para o levantamento do equipamento
          </p>
          <hr style={{ marginBottom: "8px" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <p className="p-footer" style={{ fontWeight: "bold" }}>
                Para mais informações, entre em contacto conosco
              </p>
              <p className="p-footer">{`${formatPhoneNumber(companyPhoneNumber)} | ${email}`}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="p-footer" style={{ fontWeight: "bold" }}>
                Visite-nos
              </p>
              <p className="p-footer">{website}</p>
            </div>
          </div>
        </footer>
      }
    />
  )
})

export default RepairEntry
