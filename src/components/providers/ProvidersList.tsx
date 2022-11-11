import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useSearchParams } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { toastAlert, formatDateTime, confirmationAlert } from "@config"
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
  toggleProviderPopup,
  deleteProvider,
  archiveProvider,
  setSort,
  setSelected,
  toggleProviderOpen,
  closeProviderPopups,
  listSort,
  listSelectedIds,
} from "@store/slices/providersSlice"
import PaginationList, { HeaderSlot } from "@components/app/PaginationList"
import Popuper, { PopupHeaderSlot } from "@components/app/Popuper"
import { SearchEntity } from "@components/app/SearchEntity"
import { DataGrid } from "@components/app/DataGrid"
import { PaginationDataGrid } from "@components/app/PaginationDataGrid"
import { PlusIcon } from "@components/app/icons/PlusIcon"
import { DotsIcon } from "@components/app/icons/DotsIcon"
import { ProviderEditForm } from "./ProviderEditForm"

export const ProvidersList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [editOpened, setEditOpened] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useDispatch()

  const providers = useSelector(listItems)
  const status = useSelector(listStatus)
  const page = useSelector(listPage)
  const sort = useSelector(listSort)
  const selectedIds = useSelector(listSelectedIds)
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

  const deleteHandler = async (id: number) => {
    const answer = await confirmationAlert("Вы уверены?", "Да", "Отмена")
    if (answer.isConfirmed) {
      dispatch(deleteProvider(id))
    }
  }

  const archiveHandler = async (id: number) => {
    dispatch(archiveProvider(id))
  }

  const changeSort = (value: string) => {
    dispatch(setSort(value))
    setEditId(0)
  }

  const changeSelected = (items: number[]) => {
    dispatch(setSelected(items))
  }

  const toggleRecordPopup = (id: number) => {
    dispatch(toggleProviderPopup(id))
  }

  const toggleRecordOpen = (id: number) => {
    dispatch(toggleProviderOpen(id))
  }
  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(closeProviderPopups())
    }

    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <PaginationDataGrid
        status={status}
        getExpanded={() => ""}
        rowHeight={62}
        data={providers}
        page={page}
        sort={sort}
        setPage={changePage}
        setSort={changeSort}
        setItemsInPage={changeItemsInPage}
        filterChanges={filterChanges}
        reloadPage={() => dispatch(reloadPage())}
        itemsInPage={itemsInPage}
        itemsCount={itemsCount}
        columns={[
          {
            title: "Название провайдера",
            width: "1 1",
            sort: "name",
            sortTitle: "названию",
            getValue: (row) => (
              <a
                className="edit-record-link"
                onClick={() => {
                  setEditId(row.id)
                  setEditOpened(true)
                }}
              >
                {search !== "" && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: row.name.split(search).join(`<b>${search}</b>`),
                    }}
                  ></span>
                )}
                {!search && row.name}
              </a>
            ),
          },
          {
            title: "Url",
            width: "1 1",
            sort: "url",
            sortTitle: "URL",
            getValue: (row) => row.url,
          },
          {
            title: "Добавлен",
            width: "1 1",
            sort: "created_at",
            sortTitle: "дате добавления",
            getValue: (row) => formatDateTime(row.created_at, "datetime"),
          },
          {
            title: "",
            width: "unset",
            getValue: (row) => (
              <>
                <button
                  type="button"
                  data-tip="Меню редактирования"
                  data-for="for-left"
                  className="btn btn-simple"
                  style={{ height: "30px" }}
                  onClick={() => toggleRecordPopup(row.id)}
                >
                  <DotsIcon />
                </button>
                <div
                  className={classNames([
                    "pagination-tablelist__buttons",
                    { active: row.popup_open },
                  ])}
                >
                  <button
                    type="button"
                    className="btn btn-white"
                    onClick={() => {
                      setEditId(row.id)
                      setEditOpened(true)
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="btn btn-white"
                    onClick={() => archiveHandler(row.id)}
                  >
                    В архив
                  </button>
                  <button
                    type="button"
                    className="btn btn-white"
                    onClick={() => deleteHandler(row.id)}
                  >
                    Удалить
                  </button>
                </div>
              </>
            ),
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
        <PopupHeaderSlot>
          <h3>{editId ? "Изменить" : "Добавить"} провайдера</h3>
        </PopupHeaderSlot>
        <ProviderEditForm
          id={editId}
          onDoneCallback={() => {
            setTimeout(() => {
              setEditOpened(false)
            }, 200)
          }}
        />
      </Popuper>
    </>
  )
}
