import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useSearchParams } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { confirmationAlert, formatDateTime, toastAlert } from "@config"
import { CSVLink, CSVDownload } from "react-csv"
import {
  listDomains,
  archiveDomain,
  deleteDomain,
  listDomainsPage,
  listDomainsItemsCount,
  listDomainsStatus,
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

  const exportItems = items.map((item) => {
    return {
      ...item,
      ns: item.ns ? item.ns.join("; ") : "",
      subdomains: item.subdomains
        .map((subdomain) => subdomain.subdomain_name)
        .join("; "),
    }
  })

  const status = useSelector(listDomainsStatus)
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
      }
    })
  }

  const archiveHandler = (id: number) => {
    dispatch(archiveDomain(id))
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
              <span className="title">Имя регистратора</span>
              <span className="value">{row.registrator_name}</span>
            </div>
            <div className="pagination-tablelist__info">
              <span className="title">Аккаунт регистратора</span>
              <span className="value">-</span>
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
        rowHeight={62}
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
            width: "0.5 1",
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
            title: "Отдел",
            width: "0.5 1",
            getValue: (row) => row.department_name,
          },
          {
            title: "Сервер",
            width: "1 1",
            getValue: (row) => row.server_name,
          },
          {
            title: "DNS-хостинг",
            width: "1 1",
            getValue: (row) => row.dns_hosting,
          },
          {
            title: "Код ответа",
            width: "0.5 1",
            getValue: (row) => (
              <span
                style={{
                  color:
                    row.available_condition === "200" ? "green" : "red",
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
              <DomainsFilter />
              <div
                className="add-record__container"
                data-tip="Экспортировать отображаемые данные в csv"
                data-for="for-left"
              >
                <CSVLink data={exportItems} target="_blank">
                  <button type="button" className="btn btn-black">
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
            setEditOpened(false)
          }}
        />
      </Popuper>
    </>
  )
}
