import classNames from "classnames"
import React, { ReactNode } from "react"
import { UnmountClosed } from "react-collapse"
import { ColumnData } from "./PaginationDataGrid"

interface PaginationDataGridPHolderProps<T> {
  emptyItem: number
  columns: ColumnData<T>[]
  rowHeight: number
}

export const PaginationDataGridPHolder = <T extends Record<string, any>>({
  emptyItem,
  columns,
  rowHeight,
}: PaginationDataGridPHolderProps<T>) => {
  return (
    <div className="pagination-tablelist__row skeleton-box loading">
      <div
        className="pagination-tablelist__row-up"
        style={{ height: `${rowHeight || 67}px` }}
      >
        {columns.map((column, index) => (
          <div
            key={emptyItem + "-" + index}
            className={classNames("pagination-tablelist__td", {
              "button-td": column.width === "unset",
            })}
            style={{ flex: column.width }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default PaginationDataGridPHolder
