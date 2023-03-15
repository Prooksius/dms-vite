import React from "react"
import { DomainsRecord } from "@store/slices/domainsSlice"
import { formatDateTime } from "@config"

interface DomainExpandProps {
  row: DomainsRecord
}

export const DomainExpand: React.FC<DomainExpandProps> = ({ row }) => {
  return (
    <div className="pagination-tablelist__row-down">
      <div className="pagination-tablelist__icons"></div>
      <div className="pagination-tablelist__info">
        <span className="title">Имя регистратора</span>
        <span className="value">{row.registrator_name}</span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">Аккаунт регистратора</span>
        <span className="value">{row.registrator_acc_name}</span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">NS Записи</span>
        <span className="value">
          {row.ns &&
            row.ns.map((nsItem) => (
              <span key={nsItem}>
                {nsItem}
                <br />
              </span>
            ))}
        </span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">Дата регистрации</span>
        <span className="value">
          {formatDateTime(row.registration_date, "date")}
        </span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">Дата окончания</span>
        <span className="value">
          {formatDateTime(row.expirationtime_condition, "date")}
        </span>
      </div>
    </div>
  )
}
