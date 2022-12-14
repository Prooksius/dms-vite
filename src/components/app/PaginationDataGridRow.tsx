import classNames from "classnames"
import React, { ReactNode } from "react"
import { UnmountClosed } from "react-collapse"
import { ColumnData } from "./PaginationDataGrid"

interface PaginationDataGridRowProps<T> {
  item: T
  columns: ColumnData<T>[]
  editRowID: number
  selectColumn: boolean
  selectedIds?: number[]
  setSelected?: (ids: number[]) => void
  getExpanded: (row: T) => string | ReactNode
}

export const PaginationDataGridRow = <T extends Record<string, any>>({
  item,
  columns,
  editRowID,
  selectColumn,
  selectedIds,
  setSelected,
  getExpanded,
}: PaginationDataGridRowProps<T>) => {
  return (
    <div
      key={item.id}
      className={classNames(
        "pagination-tablelist__row",
        { open: item.record_open },
        { edited: item.popup_open },
        { editing: editRowID === item.id }
      )}
    >
      <div className="pagination-tablelist__row-up">
        {selectColumn && (
          <div className="pagination-tablelist__td select-all-td">
            <div className="checkbox" style={{ marginBottom: 0 }}>
              <div className="checkbox-inner">
                <input
                  type="checkbox"
                  checked={selectedIds.indexOf(item.id) > -1}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [
                            ...selectedIds.filter(
                              (selectedItem) => selectedItem !== item.id
                            ),
                            item.id,
                          ]
                        : selectedIds.filter(
                            (selectedItem) => selectedItem !== item.id
                          )
                    )
                  }
                />
                <i></i>
              </div>
            </div>
          </div>
        )}
        {columns.map((column, index) => (
          <div
            key={index + "-" + column.title + "row" + item.id}
            className={classNames("pagination-tablelist__td", {
              "button-td": column.width === "unset",
            })}
            style={{
              flex: column.width,
              display: column.display ? column.display : "flex",
              flexDirection: column.direction ? column.direction : "row",
              alignItems: column.align ? column.align : "center",
              justifyContent: column.justify ? column.justify : "flex-start",
              gap: column.gap ? column.gap : 0,
            }}
          >
            {column.getValue(item)}
          </div>
        ))}
      </div>
      <UnmountClosed isOpened={item.record_open}>
        {getExpanded(item)}
      </UnmountClosed>
    </div>
  )
}

export default PaginationDataGridRow
