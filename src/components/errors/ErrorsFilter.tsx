import classNames from "classnames"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import "moment/locale/ru"
import { setFilter, listFilter, EntityType } from "@store/slices/errorsSlice"

import "react-datetime/css/react-datetime.css"
import { AppDispatch } from "@store/store"

export const ErrorsFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const filter = useSelector(listFilter)

  const chooseDateHandler = (date: string) => {
    dispatch(setFilter({ created_at: date }))
  }

  const chooseTypeHandler = (type: EntityType) => {
    dispatch(setFilter({ entity_type: type }))
  }

  return (
    <div className="filter-container">
      <div className="filter-container__part type-select">
        <button
          type="button"
          className={classNames([
            "btn btn-radio",
            { active: filter.entity_type === "domain" },
          ])}
          onClick={() => chooseTypeHandler("domain")}
        >
          Ошибки доменов
        </button>
        <button
          type="button"
          className={classNames([
            "btn btn-radio",
            { active: filter.entity_type === "subdomain" },
          ])}
          onClick={() => chooseTypeHandler("subdomain")}
        >
          Ошибки поддоменов
        </button>
        <button
          type="button"
          className={classNames([
            "btn btn-radio",
            { active: filter.entity_type === "server" },
          ])}
          onClick={() => chooseTypeHandler("server")}
        >
          Ошибки серверов
        </button>
      </div>
    </div>
  )
}
