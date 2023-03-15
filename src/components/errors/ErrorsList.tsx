import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatDateTime } from "@config"
import {
  listItems,
  listPage,
  listItemsCount,
  listStatus,
  listItemsInPage,
  listFilter,
  listFilterChanges,
  setPage,
  setItemsInPage,
  toggleOpen,
  reloadPage,
} from "@store/slices/errorsSlice"
import {
  listDomains,
  listDomainsItemsCount,
  fetchDomainByErrorId,
  clearDomains,
} from "@store/slices/domainsSlice"
import {
  listServers,
  listServersItemsCount,
  fetchServerByErrorId,
  clearServers,
} from "@store/slices/serversSlice"
import { CaretIcon } from "@components/app/icons/CaretIcon"
import Popuper, { PopupHeaderSlot } from "@components/app/Popuper"
import { ErrorsFilter } from "./ErrorsFilter"
import { DomainEditForm } from "../domains/DomainEditForm"
import { ServerEditForm } from "../servers/ServerEditForm"
import { PaginationDataGrid } from "@components/app/PaginationDataGrid"
import { ErrorsExpand } from "./ErrorsExpand"
import { AppDispatch } from "@store/store"

export const ErrorsList: React.FC = () => {
  const [editId, setEditId] = useState(0)
  const [entityEditId, setEntityEditId] = useState(0)
  const [entityOpen, setEntityOpen] = useState(false)
  const [editOpened, setEditOpened] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const domains = useSelector(listDomains)
  const domainsCount = useSelector(listDomainsItemsCount)

  const servers = useSelector(listServers)
  const serversCount = useSelector(listServersItemsCount)

  const errors = useSelector(listItems)
  const status = useSelector(listStatus)
  const page = useSelector(listPage)
  const itemsInPage = useSelector(listItemsInPage)
  const filter = useSelector(listFilter)
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

  const toggleRecordOpen = (id: number) => {
    dispatch(toggleOpen(id))
  }

  const doRecordFetch = (id: number) => {
    setEntityEditId(id)
    setEntityOpen(true)
    if (filter.entity_type === "domain" || filter.entity_type === "subdomain") {
      dispatch(clearDomains())
      dispatch(fetchDomainByErrorId({ id, entity_type: filter.entity_type }))
    } else if (filter.entity_type === "server") {
      dispatch(clearServers())
      dispatch(fetchServerByErrorId(id))
    }
  }

  useEffect(() => {
    // dispatch(clearDomains())
    // dispatch(clearServers())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (entityOpen && domainsCount > 0) {
      console.log("domainsCount > 0")
      setEditId(domains[0].id)
      setEditOpened(true)
    }
    // eslint-disable-next-line
  }, [domainsCount])

  useEffect(() => {
    if (entityOpen && serversCount > 0) {
      console.log("serversCount > 0")
      setEditId(servers[0].id)
      setEditOpened(true)
    }
    // eslint-disable-next-line
  }, [serversCount])

  return (
    <>
      <PaginationDataGrid
        status={status}
        editRowID={entityEditId}
        getExpanded={(row) => <ErrorsExpand row={row} />}
        rowHeight={62}
        data={errors}
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
                onClick={() => doRecordFetch(row.id)}
              >
                {row.name}
              </a>
            ),
          },
          {
            title: "Автотест",
            width: "0.5 1",
            getValue: (row) => row.checker_name,
          },
          {
            title: "Результат",
            width: "2 1",
            getValue: (row) => row.checker_result,
          },
          {
            title: "Дата",
            width: "0.75 1",
            getValue: (row) => (
              <span
                data-tip={
                  "Доп. информация" +
                  "###" +
                  formatDateTime(row.created_at, "datetime") +
                  "###" +
                  row.error_duration
                }
                data-for="for-error-dates"
              >
                {formatDateTime(row.last_updated, "datetime")}
              </span>
            ),
          },
        ]}
        getFilterComponent={() => <ErrorsFilter />}
      />
      <Popuper
        opened={editOpened}
        closeHandler={() => {
          if (
            filter.entity_type === "domain" ||
            filter.entity_type === "subdomain"
          ) {
            dispatch(clearDomains())
          } else if (filter.entity_type === "server") {
            dispatch(clearServers())
          }
          setEntityEditId(0)
          setEntityOpen(false)
          setEditOpened(false)
        }}
        unmountHandler={() => setEditId(0)}
        width={filter.entity_type === "server" ? "850px" : "1400px"}
        height={undefined}
        contentType={undefined}
      >
        <PopupHeaderSlot>
          <h3>
            Изменить&nbsp;
            {filter.entity_type === "domain" && "домен"}
            {filter.entity_type === "subdomain" && "домен"}
            {filter.entity_type === "server" && "сервер"}
          </h3>
        </PopupHeaderSlot>
        {(filter.entity_type === "domain" ||
          filter.entity_type === "subdomain") && (
          <DomainEditForm
            id={editId}
            onDoneCallback={() => {
              setTimeout(() => {
                dispatch(clearDomains())
                setEntityEditId(0)
                setEntityOpen(false)
                setEditOpened(false)
              }, 200)
            }}
          />
        )}
        {filter.entity_type === "server" && (
          <ServerEditForm
            id={editId}
            onDoneCallback={() => {
              setTimeout(() => {
                dispatch(clearServers())
                setEntityEditId(0)
                setEntityOpen(false)
                setEditOpened(false)
              }, 200)
            }}
          />
        )}
      </Popuper>
    </>
  )
}
