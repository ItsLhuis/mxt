import React, { forwardRef } from "react"

import { BASE_URL } from "@api"

import { useTheme } from "@mui/material/styles"

import { PrintLayout } from "@components/ui"

import { formatHTML } from "@utils/format/formatHTML"
import { formatPhoneNumber } from "@utils/format/phone"
import { formatDateTimeExportExcel } from "@utils/format/date"

const RepairStamp = forwardRef(({ repairData, companyData, isFinished }, ref) => {
  const theme = useTheme()

  if (!isFinished) return

  const {
    id: repairId,
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
                <h1>Ficha de Reparação</h1>
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
          <span
            className="status-span"
            style={{
              backgroundColor: theme.palette[status?.color]?.main || "rgb(70, 70, 79)",
              color: theme.palette[status?.color]?.contrastText || "rgb(228, 225, 230)",
              borderRadius: "8px",
              height: "32px",
              fontWeight: theme.typography.fontWeightBold,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 12px",
              userSelect: "none",
              marginTop: "8px"
            }}
          >
            <p style={{ fontSize: "0.7125rem" }}>{status?.name}</p>
          </span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Cliente</label>
            <p>{equipment?.client?.name}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Equipamento</label>
            <p>{`${equipment?.type?.name}, ${equipment?.brand?.name} ${equipment?.model?.name}`}</p>
          </div>
          <div style={{ width: "100%", borderBottom: "1px solid #ccc", marginTop: "8px" }}>
            <h2>Entrada</h2>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Problemas reportados</label>
            <p>
              {entry_reported_issues.length > 0
                ? entry_reported_issues
                    .map((entry_reported_issue) => entry_reported_issue?.name)
                    .join(", ")
                : "Sem valor"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
            <label className="label-main">Descrição dos problemas reportados</label>
            <div
              style={
                entry_reported_issues_description && {
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "8px"
                }
              }
            >
              {entry_reported_issues_description ? (
                <span dangerouslySetInnerHTML={formatHTML(entry_reported_issues_description)} />
              ) : (
                <p>Sem valor</p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
            <label className="label-main">Descrição da entrada</label>
            <div
              style={
                entry_description && {
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "8px"
                }
              }
            >
              {entry_description ? (
                <span dangerouslySetInnerHTML={formatHTML(entry_description)} />
              ) : (
                <p>Sem valor</p>
              )}
            </div>
          </div>
          <div style={{ width: "100%", borderBottom: "1px solid #ccc", marginTop: "8px" }}>
            <h2>Intervenção</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Trabalhos realizados</label>
            <p>
              {intervention_works_done.length > 0
                ? intervention_works_done
                    .map((intervention_work_done) => intervention_work_done?.name)
                    .join(", ")
                : "Sem valor"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
            <label className="label-main">Descrição dos trabalhos realizados</label>
            <div
              style={
                intervention_works_done_description && {
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "8px"
                }
              }
            >
              {intervention_works_done_description ? (
                <span dangerouslySetInnerHTML={formatHTML(intervention_works_done_description)} />
              ) : (
                <p>Sem valor</p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Acessórios usados</label>
            <p>
              {intervention_accessories_used.length > 0
                ? intervention_accessories_used
                    .map((intervention_accessory_used) => intervention_accessory_used?.name)
                    .join(", ")
                : "Sem valor"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
            <label className="label-main">Descrição dos acessórios usados</label>
            <div
              style={
                intervention_accessories_used_description && {
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "8px"
                }
              }
            >
              {intervention_accessories_used_description ? (
                <span
                  dangerouslySetInnerHTML={formatHTML(intervention_accessories_used_description)}
                />
              ) : (
                <p>Sem valor</p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Data de conclusão</label>
            <p>
              {conclusion_datetime ? formatDateTimeExportExcel(conclusion_datetime) : "Sem valor"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Data de entrega</label>
            <p>{delivery_datetime ? formatDateTimeExportExcel(delivery_datetime) : "Sem valor"}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="label-main">Cliente notificado</label>
            <p>{is_client_notified ? "Sim" : "Não"}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
            <label className="label-main">Descrição da intervenção</label>
            <div
              style={
                intervention_description && {
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "8px"
                }
              }
            >
              {intervention_description ? (
                <span dangerouslySetInnerHTML={formatHTML(intervention_description)} />
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

export default RepairStamp
