import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useSearchParams } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { toastAlert, formatDateTime } from "@config"
import {
  listItems,
  listPage,
  listItemsCount,
  listStatus,
  listItemsInPage,
  listSearch,
  listFilterChanges,
  fetchPage,
  setPage,
  setItemsInPage,
  setSearch,
  reloadPage,
  ProvidersRecord,
} from "@store/slices/providersSlice"
import PaginationList, { HeaderSlot } from "@components/app/PaginationList"
import Popuper from "@components/app/Popuper"
import { SearchEntity } from "@components/app/SearchEntity"
import { DataGrid } from "@components/app/DataGrid"
import { PaginationDataGrid } from "@components/app/PaginationDataGrid"
import { PlusIcon } from "@components/app/icons/PlusIcon"

export const ProvidersList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [editOpened, setEditOpened] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useDispatch()

  const providers = useSelector(listItems)
  const status = useSelector(listStatus)
  const page = useSelector(listPage)
  const itemsInPage = useSelector(listItemsInPage)
  const search = useSelector(listSearch)
  const filterChanges = useSelector(listFilterChanges)
  const itemsCount = useSelector(listItemsCount)

  const changePage = (value: number) => {
    dispatch(setPage(value))
    setEditId(0)
  }

  const changeItemsInPage = (value: number) => {
    dispatch(setItemsInPage(value))
    setEditId(0)
  }

  return (
    <>
      <PaginationDataGrid
        status={status}
        getExpanded={() => ""}
        rowHeight={62}
        data={providers}
        page={page}
        setPage={changePage}
        setItemsInPage={changeItemsInPage}
        filterChanges={filterChanges}
        reloadPage={() => dispatch(reloadPage())}
        itemsInPage={itemsInPage}
        itemsCount={itemsCount}
        columns={[
          {
            title: "Название провайдера",
            width: "1 1",
            getValue: (row) => {
              if (search)
                return (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: row.name.split(search).join(`<b>${search}</b>`),
                    }}
                  ></span>
                )
              return row.name
            },
          },
          {
            title: "Url",
            width: "1 1",
            getValue: (row) => row.url
          },
          {
            title: "Добавлен",
            width: "1 1",
            getValue: (row) => formatDateTime(row.created_at, "datetime"),
          },
        ]}
        getFilterComponent={() => (
          <div className="filter-container filter-container__domains">
            <div className="filter-container__part">
              <SearchEntity
                fetchStatus={status}
                search={search}
                setSearch={(value) => dispatch(setSearch(value))}
              />
              <div className="add-record__container">
                <button
                  type="button"
                  data-tip="Создать нового провайдера"
                  data-for="for-left"
                  className="btn btn-blue btn-line"
                  onClick={() => {
                    setEditId(null)
                    setEditOpened(true)
                  }}
                >
                  <span>Добавить</span>
                  <PlusIcon />
                </button>
              </div>{" "}
            </div>
          </div>
        )}
      />
      <Popuper
        opened={editOpened}
        closeHandler={() => setEditOpened(false)}
        unmountHandler={() => setEditId(0)}
        width={"800px"}
        height={undefined}
        contentType={undefined}
      >
        <h3>Изменение</h3>
        <p>Здесь будет форма</p>
      </Popuper>
    </>
  )
}
