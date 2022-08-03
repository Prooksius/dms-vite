import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { confirmationAlert, toastAlert } from "@config"
import {
  listServers,
  archiveServer,
  deleteServer,
  listServersPage,
  listServersItemsCount,
  listServersStatus,
  listServersItemsInPage,
  listServersFilter,
  listServersFilterChanges,
  listServersSearch,
  setPage,
  setSearch,
  setFilter,
  setItemsInPage,
  toggleServerOpen,
  toggleServerPopup,
  closeServerPopups,
  reloadPage,
  ServersRecord,
} from "@store/slices/serversSlice"
import { CaretIcon } from "@components/app/icons/CaretIcon"
import { DotsIcon } from "@components/app/icons/DotsIcon"
import { PlusIcon } from "@components/app/icons/PlusIcon"
import PaginationList, { HeaderSlot } from "@components/app/PaginationList"
import Popuper, { PopupHeaderSlot } from "@components/app/Popuper"
import { ServersFilter } from "./ServersFilter"
import { ServerEditForm } from "./ServerEditForm"
import { SearchEntity } from "@components/app/SearchEntity"
import { DataGrid } from "@components/app/DataGrid"
import { PaginationDataGrid } from "@components/app/PaginationDataGrid"

export const ServersList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [editOpened, setEditOpened] = useState(false)

  const dispatch = useDispatch()

  const items = useSelector(listServers)

  const status = useSelector(listServersStatus)
  const page = useSelector(listServersPage)
  const itemsInPage = useSelector(listServersItemsInPage)
  const search = useSelector(listServersSearch)
  const filter = useSelector(listServersFilter)
  const filterChanges = useSelector(listServersFilterChanges)
  const itemsCount = useSelector(listServersItemsCount)

  const deleteHandler = async (id: number) => {
    confirmationAlert("Вы уверены?", "Да", "Отмена").then(async (result) => {
      if (result.isConfirmed) {
        dispatch(deleteServer(id))
      }
    })
  }

  const archiveHandler = async (id: number) => {
    dispatch(archiveServer(id))
  }

  const changePage = (value: number) => {
    dispatch(setPage(value))
    setEditId(0)
  }

  const changeItemsInPage = (value: number) => {
    dispatch(setItemsInPage(value))
    setEditId(0)
  }

  const toggleRecordPopup = (id: number) => {
    dispatch(toggleServerPopup(id))
  }

  const toggleRecordOpen = (id: number) => {
    dispatch(toggleServerOpen(id))
  }

  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(closeServerPopups())
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
        getExpanded={(row) => (
          <div className="pagination-tablelist__row-down with-button-td">
            <div className="pagination-tablelist__info">
              <span className="title">Доступы к ПУ</span>
              <span className="value">{row.login_link_cp}</span>
            </div>
            <div className="pagination-tablelist__info">
              <span className="title">Веб-панель (опционально)</span>
              <span className="value">{row.web_panel}</span>
            </div>
          </div>
        )}
        data={items}
        page={page}
        setPage={changePage}
        setItemsInPage={changeItemsInPage}
        filterChanges={filterChanges}
        reloadPage={() => dispatch(reloadPage())}
        itemsInPage={itemsInPage}
        itemsCount={itemsCount}
        columns={[
          {
            title: "",
            width: "unset",
            getValue: (row) => (
              <button
                type="button"
                className="btn btn-simple"
                onClick={() => toggleRecordOpen(row.id)}
              >
                <CaretIcon open={row.record_open} />
              </button>
            ),
          },
          {
            title: "Название",
            width: "2 1",
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
            title: "Состояние",
            width: "1 1",
            getValue: (row) => (
              <span
                style={{
                  color: row.deleted_at ? "red" : "green",
                  fontWeight: 600,
                }}
              >
                {row.deleted_at ? "Неактивен" : "Активен"}
              </span>
            ),
          },
          {
            title: "IP",
            width: "1 1",
            getValue: (row) => row.ip_addr,
          },
          {
            title: "Отдел",
            width: "1 1",
            getValue: (row) => row.department_name,
          },
          {
            title: "UP/DOWN",
            width: "1 1",
            getValue: (row) => (
              <span
                style={{
                  color: row.status === "up" ? "green" : "red",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {row.status}
              </span>
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
              <ServersFilter />
              <div
                className="add-record__container"
                style={{ marginLeft: "auto" }}
              >
                <button
                  type="button"
                  data-tip="Создать новый сервер"
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
        width={"850px"}
        height={undefined}
        contentType={undefined}
      >
        <PopupHeaderSlot>
          <h3>{editId ? "Изменить" : "Добавить"} сервер</h3>
        </PopupHeaderSlot>
        <ServerEditForm
          id={editId}
          onDoneCallback={() => {
            setEditOpened(false)
          }}
        />
      </Popuper>
    </>
  )
}
