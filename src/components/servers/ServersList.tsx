import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { askConfirm } from "@config"
import {
  listServers,
  archiveServer,
  deleteServer,
  listServersSort,
  listServersPage,
  listServersItemsCount,
  listServersStatus,
  listServersItemsInPage,
  listServersFilterChanges,
  listServersSearch,
  listServersLoaded,
  setSort,
  setPage,
  setSearch,
  setItemsInPage,
  toggleServerOpen,
  toggleServerPopup,
  closeServerPopups,
  reloadPage,
} from "@store/slices/serversSlice"
import { CaretIcon } from "@components/app/icons/CaretIcon"
import { DotsIcon } from "@components/app/icons/DotsIcon"
import { PlusIcon } from "@components/app/icons/PlusIcon"
import Popuper, { PopupHeaderSlot } from "@components/app/Popuper"
import { ServersFilter } from "./ServersFilter"
import { ServerEditForm } from "./ServerEditForm"
import { SearchEntity } from "@components/app/SearchEntity"
import { PaginationDataGrid } from "@components/app/PaginationDataGrid"
import { useConfirm } from "@components/app/hooks/useConfirm"
import { ServersExpand } from "./ServersExpand"
import { AppDispatch, RootState } from "@store/store"
import { StatusType } from "@components/app/forms/formWrapper/types"

export const ServersList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [editOpened, setEditOpened] = useState(false)

  const { ask } = useConfirm()

  const dispatch = useDispatch<AppDispatch>()

  const items = useSelector(listServers)

  const status = useSelector(listServersStatus)
  const loaded = useSelector(listServersLoaded)
  const sort = useSelector(listServersSort)
  const page = useSelector(listServersPage)
  const itemsInPage = useSelector(listServersItemsInPage)
  const search = useSelector(listServersSearch)
  const filterChanges = useSelector(listServersFilterChanges)
  const itemsCount = useSelector(listServersItemsCount)

  const deleteHandler = async (id: number) => {
    ask("", askConfirm).then((result) => {
      if (result === true) {
        dispatch(deleteServer(id))
      }
    })
  }

  const archiveHandler = async (id: number) => {
    ask("", askConfirm).then((result) => {
      if (result === true) {
        dispatch(archiveServer(id))
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
    dispatch(toggleServerPopup(id))
  }

  const toggleRecordOpen = (id: number) => {
    dispatch(toggleServerOpen(id))
  }

  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(closeServerPopups())
    }

    if (!loaded) {
      dispatch(reloadPage())
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
        getExpanded={(row) => <ServersExpand row={row} />}
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
            title: "IPs",
            width: "1 1",
            getValue: (row) =>
              row.ip_addr.map((ipRow) => ipRow.ip_addr).join(", "),
          },
          {
            title: "Отдел",
            width: "1 1",
            getValue: (row) => row.department_name,
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
            setTimeout(() => {
              setEditOpened(false)
            }, 200)
          }}
        />
      </Popuper>
    </>
  )
}
