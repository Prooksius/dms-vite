import classNames from "classnames"
import React, { ReactNode } from "react"
import { UnmountClosed } from "react-collapse"
import { SortIcon } from "./icons/SortIcon"
import { ColumnData } from "./PaginationDataGrid"

interface PaginationDataGridHeaderProps<T> {
  data: T[]
  columns: ColumnData<T>[]
  selectColumn: boolean
  selectedIds?: number[]
  setSelected?: (ids: number[]) => void
  sort?: string
  sorting: boolean
  setSort?: (sort: string) => void
  setSortHandler: (value: string) => void
}

export const PaginationDataGridHeader = <T extends Record<string, any>>({
  data,
  columns,
  selectColumn,
  selectedIds,
  setSelected,
  sort,
  sorting,
  setSort,
  setSortHandler,
}: PaginationDataGridHeaderProps<T>) => {
  return (
    <div className="pagination-tablelist__part pagination-tablelist__thead">
      <div className="pagination-tablelist__row-th">
        {selectColumn && (
          <div className="pagination-tablelist__th select-all-td">
            <div
              className="checkbox"
              style={{ marginBottom: 0, marginLeft: "1px" }}
            >
              <div className="checkbox-inner">
                <input
                  type="checkbox"
                  data-tip="Выбрать записи"
                  data-for="for-sort"
                  ref={(input) => {
                    if (input) {
                      input.indeterminate =
                        selectedIds.length > 0 &&
                        data.length > selectedIds.length
                    }
                  }}
                  checked={data.length === selectedIds.length}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? data.map((dataItem) => dataItem.id)
                        : []
                    )
                  }
                />
                <i></i>
              </div>
            </div>
          </div>
        )}
        {columns.map((column, index) => {
          const direction =
            sort && sort.replace("-", "") === column.sort
              ? Array.from(sort)[0] === "-"
                ? ""
                : "(убыв)"
              : "(возр)"
          return (
            <div
              key={index + "-" + column.title}
              className={classNames(
                "pagination-tablelist__th",
                { "button-td": column.width === "unset" },
                { "sort-column": column.sort }
              )}
              style={{ flex: column.width }}
            >
              <span
                style={{ pointerEvents: sorting ? "none" : "all" }}
                data-tip={
                  column.sort &&
                  (direction ? "Сортировать по " : "Отменить сортировку по ") +
                    column.sortTitle +
                    " " +
                    direction
                }
                data-for="for-sort"
                onClick={
                  column.sort &&
                  setSort &&
                  (() =>
                    setSortHandler(
                      (sort === "" ||
                      Array.from(sort)[0] === "-" ||
                      sort.replace("-", "") !== column.sort
                        ? ""
                        : "-") +
                        (Array.from(sort)[0] === "-" &&
                        sort.replace("-", "") === column.sort
                          ? ""
                          : column.sort)
                    ))
                }
              >
                {column.title}
                {column.sort && sort.replace("-", "") === column.sort && (
                  <SortIcon
                    order={Array.from(sort)[0] === "-" ? "DESC" : "ASC"}
                  />
                )}
                {column.sort && sort.replace("-", "") !== column.sort && (
                  <SortIcon />
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PaginationDataGridHeader
