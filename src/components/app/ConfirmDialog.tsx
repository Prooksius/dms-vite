// src/components/ConfirmDialog.tsx
import React, { ReactNode } from "react"
import { useConfirm } from "@components/app/hooks/useConfirm"
import Popuper, { PopupHeaderSlot } from "@components/app/Popuper"

interface UseConfirmParts {
  isAsking: boolean
  message: React.ReactNode
  options?: Record<string, any>
  confirm: () => void
  deny: () => void
}

export const ConfirmDialog = () => {
  const {
    isAsking,
    options = {},
    deny,
    confirm,
  }: UseConfirmParts = useConfirm()

  return (
    <Popuper
      opened={isAsking}
      closeHandler={deny}
      unmountHandler={null}
      width={"400px"}
      height={undefined}
      contentType={undefined}
    >
      <PopupHeaderSlot>
        <br />
        <h2 style={{ textAlign: "center" }}>{options.title}</h2>
      </PopupHeaderSlot>
      {options.subtitle && options.subtitle !== "" && (
        <>
          <p style={{ textAlign: "center" }}>{options.subtitle}</p>
          <br />
        </>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button className={"btn btn-red"} onClick={deny}>
          {options.btnCancel ? options.btnCancel : "Отмена"}
        </button>
        <button className={"btn btn-blue"} onClick={confirm}>
          {options.btnConfirm ? options.btnConfirm : "OK"}
        </button>
      </div>
    </Popuper>
  )
}
