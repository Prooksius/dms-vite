import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useSearchParams } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { askConfirm, formatDateTime, toastAlert } from "@config"
import { CSVLink, CSVDownload } from "react-csv"
import {
  listDomains,
  listDomainsAll,
  archiveDomain,
  deleteDomain,
  listDomainsPage,
  listDomainsSort,
  listDomainsItemsCount,
  listDomainsStatus,
  listDomainsEditStatus,
  listDomainsEditRowId,
  listDomainsAllStatus,
  listDomainsItemsInPage,
  listDomainsFilter,
  listDomainsFilterChanges,
  listDomainsSearch,
  listDomainsLoaded,
  setPage,
  setSearch,
  setFilter,
  setEditRowID,
  setSort,
  setItemsInPage,
  toggleDomainOpen,
  toggleDomainPopup,
  closeDomainPopups,
  reloadPage,
  DomainsRecord,
  fetchDomainAll,
  clearDomains,
  switchMonitoringDomain,
} from "@store/slices/domainsSlice"
import { CaretIcon } from "@components/app/icons/CaretIcon"
import { DotsIcon } from "@components/app/icons/DotsIcon"
import { DownloadIcon } from "@components/app/icons/DownloadIcon"
import { PlusIcon } from "@components/app/icons/PlusIcon"
import PaginationList, { HeaderSlot } from "@components/app/PaginationList"
import Popuper, { PopupHeaderSlot } from "@components/app/Popuper"
import { DomainsFilter } from "./DomainsFilter"
import { DomainEditForm } from "./DomainEditForm"
import { SearchEntity } from "@components/app/SearchEntity"
import { DataGrid } from "@components/app/DataGrid"
import { PaginationDataGrid } from "@components/app/PaginationDataGrid"
import { SslCheckIcon } from "@components/app/icons/SslCheckIcon"
import { RknCheckIcon } from "@components/app/icons/RknCheckIcon"
import { DateCheckIcon } from "@components/app/icons/DateCheckIcon"
import { Success } from "@components/app/icons/Success"
import { ErrorsIcon } from "@components/app/icons/ErrorsIcon"
import { DeleteIcon } from "@components/app/icons/DeleteIcon"
import { MinusIcon } from "@components/app/icons/MinusIcon"
import { AvailableIcon } from "@components/app/icons/AvailableIcon"
import { UnavailableIcon } from "@components/app/icons/UnavailableIcon"
import { MonitorIcon } from "@components/app/icons/MonitorIcon"
import { useConfirm } from "@components/app/hooks/useConfirm"
import { DomainExpand } from "./DomainExpand"
import { AppDispatch } from "@store/store"

interface ConditionNames {
  [key: string]: string
}
const codeNames: ConditionNames = {
  available: "200",
  unavailable: "404",
}

const ResonseCodeColor = (code: string): string => {
  const codeNumber = parseInt(code)
  if (codeNumber) {
    if (codeNumber < 300) return "green"
    if (codeNumber < 500) return "orange"
  }
  return "red"
}

export const DomainsList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [editOpened, setEditOpened] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const [searchParams, setSearchParams] = useSearchParams()

  const { ask } = useConfirm()

  const items = useSelector(listDomains)
  const itemsAll = useSelector(listDomainsAll)

  const exportItems = itemsAll.map((item) => {
    return {
      ...item,
      ns: item.ns ? item.ns.join("; ") : "",
      subdomains: item.subdomains
        ? item.subdomains
            .map((subdomain) => subdomain.subdomain_name)
            .join("; ")
        : "",
    }
  })

  const status = useSelector(listDomainsStatus)
  const loaded = useSelector(listDomainsLoaded)
  const editStatus = useSelector(listDomainsEditStatus)
  const editRowID = useSelector(listDomainsEditRowId)
  const statusAll = useSelector(listDomainsAllStatus)
  const sort = useSelector(listDomainsSort)
  const page = useSelector(listDomainsPage)
  const itemsInPage = useSelector(listDomainsItemsInPage)
  const search = useSelector(listDomainsSearch)
  const filter = useSelector(listDomainsFilter)
  const filterChanges = useSelector(listDomainsFilterChanges)
  const itemsCount = useSelector(listDomainsItemsCount)

  const deleteHandler = (id: number) => {
    ask("", askConfirm).then((result) => {
      if (result === true) {
        dispatch(setEditRowID(id))
        dispatch(deleteDomain(id))
        dispatch(fetchDomainAll())
      }
    })
  }

  const archiveHandler = (id: number) => {
    ask("", askConfirm).then((result) => {
      if (result === true) {
        dispatch(setEditRowID(id))
        dispatch(archiveDomain(id))
        dispatch(fetchDomainAll())
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
    console.log("sorting")
    dispatch(setSort(value))
    setEditId(0)
  }

  const toggleRecordPopup = (id: number) => {
    dispatch(toggleDomainPopup(id))
  }

  const toggleRecordOpen = (id: number) => {
    dispatch(toggleDomainOpen(id))
  }

  const toggleMonitoring = (id: number, condition: boolean) => {
    console.log("Toggle monitoring")
    dispatch(setEditRowID(id))
    dispatch(switchMonitoringDomain({ id, status: condition }))
  }

  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(closeDomainPopups())
    }
    if (!loaded) {
      dispatch(reloadPage())
    }
    dispatch(fetchDomainAll())

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
        editRowID={editRowID}
        getExpanded={(row) => <DomainExpand row={row} />}
        rowHeight={71}
        data={items}
        page={page}
        setPage={changePage}
        setItemsInPage={changeItemsInPage}
        sort={sort}
        setSort={changeSort}
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
            sort: "name",
            sortTitle: "названию",
            width: "1 1",
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
            title: "Мониторинг",
            width: "1.2 1",
            getValue: (row) => (
              <div className="domain-status-line">
                <MonitorIcon
                  active={row.is_activated}
                  doSwitch={(condition) => toggleMonitoring(row.id, condition)}
                />
                <SslCheckIcon
                  enabled={row.ssl_status}
                  condition={row.ssl_condition}
                  lastUpdate={row.ssl_condition_last_updated}
                />
                <RknCheckIcon
                  enabled={row.rkn_status}
                  condition={row.rkn_condition}
                  lastUpdate={row.rkn_condition_last_updated}
                />
                <DateCheckIcon
                  enabled={row.expirationtime_status}
                  condition={row.expirationtime_condition}
                  lastUpdate={row.expirationtime_condition_last_updated}
                />
                <AvailableIcon
                  active={row.available_status}
                  condition={row.available_condition}
                  lastUpdate={row.available_condition_last_updated}
                />
              </div>
            ),
          },
          {
            title: "Отдел",
            width: "0.3 1",
            getValue: (row) => row.department_name,
          },
          {
            title: "Сервер",
            width: "0.8 1",
            getValue: (row) => row.server_name,
          },
          {
            title: "DNS-хостинг",
            width: "1 1",
            getValue: (row) => row.hosting_name,
          },
          {
            title: "Код ответа",
            width: "0.7 1",
            getValue: (row) => {
              const messageText = row.available_condition_last_updated
                ? new Date(
                    row.available_condition_last_updated
                  ).toLocaleString()
                : "-"
              return (
                <span
                  style={{
                    color: ResonseCodeColor(row.available_condition),
                    fontWeight: 600,
                  }}
                  data-tip={
                    "Проверка доступности" +
                    "###" +
                    row.available_condition +
                    "###" +
                    messageText
                  }
                  data-for="for-monitoring"
                >
                  {row.available_condition}
                </span>
              )
            },
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
              <DomainsFilter />
              <div
                className="add-record__container"
                data-tip="Экспортировать данные в csv"
                data-for="for-left"
              >
                <CSVLink data={exportItems} target="_blank">
                  <button
                    type="button"
                    disabled={statusAll !== "succeeded"}
                    className="btn btn-black"
                  >
                    <span>Экспорт</span>
                    <DownloadIcon />
                  </button>
                </CSVLink>
              </div>
              <div className="add-record__container">
                <button
                  type="button"
                  data-tip="Создать новый домен"
                  data-for="for-top"
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
        width={"1400px"}
        height={undefined}
        contentType={undefined}
      >
        <PopupHeaderSlot>
          <h3>{editId ? "Изменить" : "Добавить"} домен</h3>
        </PopupHeaderSlot>
        <DomainEditForm
          id={editId}
          onDoneCallback={() => {
            setTimeout(() => {
              setEditOpened(false)
              dispatch(fetchDomainAll())
            }, 200)
          }}
        />
      </Popuper>
    </>
  )
}
