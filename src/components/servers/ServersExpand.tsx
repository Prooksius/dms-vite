import React from "react"
import { ServersRecord } from "@store/slices/serversSlice"

interface ServersExpandProps {
  row: ServersRecord
}

export const ServersExpand: React.FC<ServersExpandProps> = ({ row }) => {
  return (
    <div className="pagination-tablelist__row-down with-button-td">
      <div className="pagination-tablelist__info">
        <span className="title">Доступы к ПУ</span>
        <span className="value">{row.login_link_cp}</span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">Веб-панель (опционально)</span>
        <span className="value">{row.web_panel}</span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">IP-адреса</span>
        <span className="value">
          {row.ip_addr &&
            row.ip_addr.map((ipItem) => (
              <span
                key={ipItem.ip_addr}
                style={{
                  display: "block",
                  color: ipItem.server_status === "up" ? "green" : "red",
                  fontWeight: 600,
                }}
              >
                {ipItem.ip_addr}
              </span>
            ))}
        </span>
      </div>
    </div>
  )
}
