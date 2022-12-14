import classNames from "classnames"
import React, { CSSProperties, ReactNode, useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import PaginationList, { HeaderSlot } from "@components/app/PaginationList"
import range from "lodash.range"
import { StatusType } from "./forms/formWrapper/types"
import { UnmountClosed } from "react-collapse"
import { SortIcon } from "./icons/SortIcon"
import ReactTooltip from "react-tooltip"
import { listTooltipShow, setTootipShow } from "@store/slices/globalsSlice"
import { useSelector, useDispatch } from "react-redux"
import PaginationDataGridRow from "./PaginationDataGridRow"
import PaginationDataGridHeader from "./PaginationDataGridHeader"
import PaginationDataGridPHolder from "./PaginationDataGridPHolder"

export type ColumnData<T> = {
  title: string
  width: string
  sort?: string
  sortTitle?: string
  display?: CSSProperties["display"]
  direction?: CSSProperties["flexDirection"]
  align?: CSSProperties["alignItems"]
  justify?: CSSProperties["justifyContent"]
  gap?: CSSProperties["gap"]
  getValue: (row: T) => string | ReactNode
}

interface PaginationDataGridProps<T> {
  data: T[]
  status: StatusType
  editRowID?: number
  filterChanges: number
  page: number
  setPage: (page: number) => void
  setItemsInPage: (pitemsInPageage: number) => void
  itemsInPage: number
  itemsCount: number
  sort?: string
  setSort?: (sort: string) => void
  selectColumn?: boolean
  selectedIds?: number[]
  setSelected?: (ids: number[]) => void
  columns: ColumnData<T>[]
  rowHeight?: number
  reloadPage: () => void
  getFilterComponent: () => string | ReactNode
  getExpanded: (row: T) => string | ReactNode
}

const useQuery = () => {
  // Use the URLSearchParams API to extract the query parameters
  // useLocation().search will have the query parameters eg: ?foo=bar&a=b
  const loc = useLocation()
  return { route: loc.pathname, query: new URLSearchParams(loc.search) }
}

export const PaginationDataGrid = <T extends Record<string, any>>({
  data,
  status,
  editRowID = 0,
  filterChanges,
  page = 1,
  setPage,
  setItemsInPage,
  itemsInPage,
  itemsCount,
  sort = "default",
  setSort,
  selectColumn = false,
  selectedIds = [],
  setSelected = null,
  columns,
  rowHeight,
  reloadPage,
  getFilterComponent,
  getExpanded,
}: PaginationDataGridProps<T>) => {
  const emptyItemsCount = range(Math.max(data.length, 2))

  const { route, query } = useQuery()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const tooltipShow = useSelector(listTooltipShow)

  const [sorting, setSorting] = useState<boolean>(false)

  const setSortHandler = (value: string) => {
    setSorting(true)
    dispatch(setTootipShow(false))
    if (value) query.set("sort", value)
    else query.delete("sort")
    navigate(`${route}?${query.toString()}`)
    setSort(value)
    setSelected && setSelected([])
  }

  const setPageHandler = (value: number) => {
    setPage(value)
    setSelected && setSelected([])
  }

  const setItemsInPageHandler = (value: number) => {
    setItemsInPage(value)
    setSelected && setSelected([])
  }

  const tooltipOn = () => {
    if (!tooltipShow) {
      dispatch(setTootipShow(true))
    }
  }

  useEffect(() => {
    tooltipOn()
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    console.log("soring off")
    setTimeout(() => {
      setSorting(false)
    }, 100)
  }, [sort])

  useEffect(() => {
    if (query.get("page") && +query.get("page") !== page) {
      setPage(+query.get("page"))
    } else if (!query.get("page")) {
      setPage(1)
    }
    if (setSort) {
      if (query.get("sort") && query.get("sort") !== sort) {
        setSortHandler(query.get("sort"))
      } else if (!query.get("sort")) {
        setSortHandler("")
      }
    }

    tooltipOn()
    setSorting(false)

    if (status === "idle" && !filterChanges) reloadPage()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <PaginationList
        title={"Список провайдеров"}
        loadedPage={+page}
        listStatus={status}
        pushState={true}
        containerClass={"notes-container"}
        listClass={"notes-list"}
        itemsCount={itemsCount}
        itemsInPage={itemsInPage}
        pageChangedCallback={(value: number) => setPageHandler(value)}
        itemsInPageChangedCallback={(value: number) =>
          setItemsInPageHandler(value)
        }
      >
        <HeaderSlot>{getFilterComponent()}</HeaderSlot>
        <div className="pagination-tablelist">
          <PaginationDataGridHeader
            columns={columns}
            data={data}
            selectColumn={selectColumn}
            setSortHandler={setSortHandler}
            sorting={sorting}
            setSort={setSort}
            selectedIds={selectedIds}
            setSelected={setSelected}
            sort={sort}
          />
          <div className="pagination-tablelist__part pagination-tablelist__tbody">
            {status === "succeeded" &&
              data.length > 0 &&
              data.map((item) => (
                <PaginationDataGridRow
                  columns={columns}
                  editRowID={editRowID}
                  item={item}
                  getExpanded={getExpanded}
                  selectColumn={selectColumn}
                  key={item.id}
                  selectedIds={selectedIds}
                  setSelected={setSelected}
                />
              ))}
            {status === "succeeded" && data.length === 0 && (
              <div className="pagination-tablelist__row">
                <div className="pagination-tablelist__td">
                  Записей не найдено
                </div>
              </div>
            )}
            {status === "loading" &&
              emptyItemsCount.map((emptyItem) => (
                <PaginationDataGridPHolder
                  key={emptyItem}
                  emptyItem={emptyItem}
                  columns={columns}
                  rowHeight={rowHeight}
                />
              ))}
          </div>
        </div>
      </PaginationList>
      {tooltipShow && (
        <>
          <ReactTooltip id="for-bottom" effect="solid" place="bottom" />
          <ReactTooltip id="for-top" effect="solid" place="top" />
          <ReactTooltip id="for-left" effect="solid" place="left" />
          <ReactTooltip id="for-sort" effect="solid" place="top" />
          <ReactTooltip
            id="for-monitoring"
            effect="solid"
            place="top"
            getContent={(dataTip) => {
              const data = dataTip ? dataTip.split("###") : []
              return (
                <div style={{ textAlign: "center" }}>
                  {data[1] && <h3>{data[0]}</h3>}
                  <h4>Последняя проверка</h4>
                  <br />
                  <p>{data[1] ? data[1] : data[0]}</p>
                </div>
              )
            }}
          />
        </>
      )}
    </>
  )
}
