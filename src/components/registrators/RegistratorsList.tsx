import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { askConfirm, formatDateTime, toastAlert } from "@config"
import {
  listRegistrators,
  archiveRegistrator,
  deleteRegistrator,
  listRegistratorsSort,
  listRegistratorsPage,
  listRegistratorsItemsCount,
  listRegistratorsStatus,
  listRegistratorsItemsInPage,
  listRegistratorsFilter,
  listRegistratorsFilterChanges,
  listRegistratorsSearch,
  setPage,
  setSort,
  setSearch,
  setItemsInPage,
  toggleRegistratorOpen,
  toggleRegistratorPopup,
  closeRegistratorPopups,
  reloadPage,
} from "@store/slices/registratorsSlice"
import { DotsIcon } from "@components/app/icons/DotsIcon"
import { PlusIcon } from "@components/app/icons/PlusIcon"
import Popuper, { PopupHeaderSlot } from "@components/app/Popuper"
import { RegistratorsFilter } from "./RegistratorsFilter"
import { RegistratorEditForm } from "./RegistratorEditForm"
import { SearchEntity } from "@components/app/SearchEntity"
import { EyeIcon } from "@components/app/icons/EyeIcon"
import { PaginationDataGrid } from "@components/app/PaginationDataGrid"
import { useConfirm } from "@components/app/hooks/useConfirm"
import { AppDispatch } from "@store/store"

export const RegistratorsList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [editOpened, setEditOpened] = useState(false)

  const { ask } = useConfirm()

  const dispatch = useDispatch<AppDispatch>()

  const items = useSelector(listRegistrators)

  const status = useSelector(listRegistratorsStatus)
  const sort = useSelector(listRegistratorsSort)
  const page = useSelector(listRegistratorsPage)
  const itemsInPage = useSelector(listRegistratorsItemsInPage)
  const search = useSelector(listRegistratorsSearch)
  const filter = useSelector(listRegistratorsFilter)
  const filterChanges = useSelector(listRegistratorsFilterChanges)
  const itemsCount = useSelector(listRegistratorsItemsCount)

  const deleteHandler = async (id: number) => {
    ask("", askConfirm).then((result) => {
      if (result === true) {
        dispatch(deleteRegistrator(id))
      }
    })
  }

  const archiveHandler = async (id: number) => {
    ask("", askConfirm).then((result) => {
      if (result === true) {
        dispatch(archiveRegistrator(id))
      }
    })
  }

  const changePage = (value: number) => {
    dispatch(setPage(value))
    setEditId(0)
  }

  const changeItemsInPage = (value: number) => {
    dispatch(setItemsInPage(value))
    setEditId(0)
  }

  const changeSort = (value: string) => {
    dispatch(setSort(value))
    setEditId(0)
  }

  const toggleRecordPopup = (id: number) => {
    dispatch(toggleRegistratorPopup(id))
  }

  const toggleRecordOpen = (id: number) => {
    dispatch(toggleRegistratorOpen(id))
  }

  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(closeRegistratorPopups())
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
        rowHeight={125}
        data={items}
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
            title: "Название",
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
            title: "Провайдер",
            width: "1 1",
            getValue: (row) => row.provider_name,
          },
          {
            title: "Доступы",
            width: "1 1",
            direction: "column",
            align: "flex-start",
            justify: "center",
            gap: "5px",
            getValue: (row) => (
              <>
                <div>
                  <a href={row.login_link} rel="noreferrer" target="_blank">
                    Вход
                  </a>
                </div>
                <div>{row.login}</div>
                <div>
                  {row.record_open && row.password}
                  {!row.record_open && "**********"}
                  <button
                    type="button"
                    className="btn btn-simple"
                    onClick={() => toggleRecordOpen(row.id)}
                  >
                    <EyeIcon open={row.record_open} />
                  </button>
                </div>
              </>
            ),
          },
          {
            title: "Почта",
            width: "1 1",
            getValue: (row) => row.email,
          },
          {
            title: "Добавлен",
            width: "1 1",
            sort: "created_at",
            sortTitle: "дате добавления",
            getValue: (row) => (
              <>
                {row.created_at &&
                  row.created_at !== "None" &&
                  formatDateTime(row.created_at, "datetime")}
              </>
            ),
          },
          {
            title: "",
            width: "unset",
            getValue: (row) => (
              <>
                <button
                  type="button"
                  className="btn btn-simple"
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
                    Удалить
                  </button>
                  <button
                    style={{ display: "none" }}
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
              <RegistratorsFilter />
              <div
                className="add-record__container"
                style={{ marginLeft: "auto" }}
              >
                <button
                  type="button"
                  data-tip="Создать новый аккаунт"
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
              </div>
            </div>
          </div>
        )}
      />
      <Popuper
        opened={editOpened}
        closeHandler={() => setEditOpened(false)}
        unmountHandler={() => setEditId(0)}
        width={"650px"}
        height={undefined}
        contentType={undefined}
      >
        <PopupHeaderSlot>
          <h3>{editId ? "Изменить" : "Добавить"} аккаунт</h3>
        </PopupHeaderSlot>
        <RegistratorEditForm
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
