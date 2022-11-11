import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useSearchParams } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { confirmationAlert, formatDateTime, toastAlert } from "@config"
import { CSVLink, CSVDownload } from "react-csv"
import {
  listDomains,
  listDomainsAll,
  archiveDomain,
  deleteDomain,
  listDomainsPage,
  listDomainsItemsCount,
  listDomainsStatus,
  listDomainsAllStatus,
  listDomainsItemsInPage,
  listDomainsFilter,
  listDomainsFilterChanges,
  listDomainsSearch,
  setPage,
  setSearch,
  setFilter,
  setItemsInPage,
  toggleDomainOpen,
  toggleDomainPopup,
  closeDomainPopups,
  reloadPage,
  DomainsRecord,
  fetchDomainAll,
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

interface ConditionNames {
  [key: string]: string
}
const codeNames: ConditionNames = {
  available: "200",
  unavailable: "404",
}

export const DomainsList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [editOpened, setEditOpened] = useState(false)

  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

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
  const statusAll = useSelector(listDomainsAllStatus)
  const page = useSelector(listDomainsPage)
  const itemsInPage = useSelector(listDomainsItemsInPage)
  const search = useSelector(listDomainsSearch)
  const filter = useSelector(listDomainsFilter)
  const filterChanges = useSelector(listDomainsFilterChanges)
  const itemsCount = useSelector(listDomainsItemsCount)

  const deleteHandler = (id: number) => {
    confirmationAlert("Вы уверены?", "Да", "Отмена").then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDomain(id))
        dispatch(fetchDomainAll())
      }
    })
  }

  const archiveHandler = (id: number) => {
    dispatch(archiveDomain(id))
    dispatch(fetchDomainAll())
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
    dispatch(toggleDomainPopup(id))
  }

  const toggleRecordOpen = (id: number) => {
    dispatch(toggleDomainOpen(id))
  }

  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(closeDomainPopups())
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
        getExpanded={(row) => (
          <div className="pagination-tablelist__row-down">
            <div className="pagination-tablelist__icons"></div>
            <div className="pagination-tablelist__info">
              <span className="title">Имя регистратора</span>
              <span className="value">{row.registrator_name}</span>
            </div>
            <div className="pagination-tablelist__info">
              <span className="title">Аккаунт регистратора</span>
              <span className="value">{row.registrator_acc_name}</span>
            </div>
            <div className="pagination-tablelist__info">
              <span className="title">NS Записи</span>
              <span className="value">
                {row.ns &&
                  row.ns.map((nsItem) => (
                    <span key={nsItem}>
                      {nsItem}
                      <br />
                    </span>
                  ))}
              </span>
            </div>
            <div className="pagination-tablelist__info">
              <span className="title">Дата регистрации</span>
              <span className="value">
                {formatDateTime(row.registration_date, "date")}
              </span>
            </div>
            <div className="pagination-tablelist__info">
              <span className="title">Дата окончания</span>
              <span className="value">
                {formatDateTime(row.expirationtime_condition, "date")}
              </span>
            </div>
          </div>
        )}
        rowHeight={71}
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
            title: "Состояние",
            width: "1.2 1",
            getValue: (row) => (
              <div className="domain-status-line">
                <span
                  style={{
                    color: row.deleted_at ? "red" : "green",
                    fontWeight: 600,
                  }}
                >
                  {row.deleted_at ? "Неактивен" : "Активен"}
                </span>
                <SslCheckIcon enabled={row.ssl_status} />
                <RknCheckIcon enabled={row.rkn_status} />
                <DateCheckIcon enabled={row.expirationtime_status} />
                {row.available_status && <AvailableIcon />}
                {!row.available_status && <UnavailableIcon />}
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
            getValue: (row) => (
              <span
                style={{
                  color: row.available_condition === "200" ? "green" : "red",
                  fontWeight: 600,
                }}
              >
                {row.available_condition}
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
