import React from "react"
import { ErrorsRecord } from "@store/slices/errorsSlice"

interface ErrorsExpandProps {
  row: ErrorsRecord
}

export const ErrorsExpand: React.FC<ErrorsExpandProps> = ({ row }) => {
  return (
    <div className="pagination-tablelist__row-down with-button-td">
      <div className="pagination-tablelist__info">
        <span className="title">Какой-то заголовок</span>
        <span className="value">Какой-то текст</span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">Какой-то заголовок</span>
        <span className="value">Какой-то текст</span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">Какой-то заголовок</span>
        <span className="value">
          Какой-то текст
          <br />
          Какой-то текст
          <br />
          Какой-то текст <br />
          Какой-то текст
        </span>
      </div>
      <div className="pagination-tablelist__info">
        <span className="title">Какой-то заголовок</span>
        <span className="value">Какой-то текст</span>
      </div>
    </div>
  )
}
