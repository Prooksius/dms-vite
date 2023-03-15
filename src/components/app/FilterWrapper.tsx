import classNames from "classnames"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { clearQuery, fillFilterForm, fillQuery, toastAlert } from "@config"
import FormWrapper from "@components/app/forms/formWrapper/FormWrapper"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import { FilterIcon } from "@components/app/icons/FilterIcon"
import {
  FieldsData,
  MyFormData,
  SelectValue,
} from "@components/app/forms/formWrapper/types"
import { FormWrapperContext } from "@components/app/forms/formWrapper/formWrapperContext"
import { DeleteIconSmall } from "@components/app/icons/DeleteIconSmall"
import { listTooltipShow, setTootipShow } from "@store/slices/globalsSlice"
import ReactTooltip from "react-tooltip"
import { loadRegistratorOptions } from "@store/slices/registratorsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"
import { loadServerOptions } from "@store/slices/serversSlice"
import { useQuery } from "@components/app/hooks/useQuery"
import { WritableDraft } from "immer/dist/internal"
import type {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithoutPayload,
} from "@reduxjs/toolkit"
import { AppDispatch } from "@store/store"

type SelectedValue = {
  key: string
  field: string
  value: string
}

interface FilterWrapperProps {
  name: string
  filter: Record<
    string,
    string | number | boolean | SelectValue | SelectValue[]
  >
  setFilter: ActionCreatorWithOptionalPayload<
    {
      fields: FieldsData
      silent?: boolean
    },
    string
  >
  clearFilter: ActionCreatorWithoutPayload<string>
  filterFormData: MyFormData
  goFurther: () => void
  children: React.ReactNode
}

export const FilterWrapper: React.FC<FilterWrapperProps> = ({
  children,
  name,
  filter,
  setFilter,
  clearFilter,
  filterFormData,
  goFurther,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const ref = useRef(null)
  const btnRef = useRef(null)
  const { route, query } = useQuery()

  const navigate = useNavigate()

  const tooltipShow = useSelector(listTooltipShow)

  const { form, setFieldValue, setForm } = useContext(FormWrapperContext)

  const [filterOpen, setFilterOpen] = useState(false)

  const filledFormData = Object.assign({}, filterFormData)

  const filledValies: SelectedValue[] = Object.keys(filterFormData.fields)
    .filter((key) => {
      if (
        (filterFormData.fields[key].type === "text" ||
          filterFormData.fields[key].type === "radio") &&
        filter[key]
      ) {
        return true
      } else if (
        filterFormData.fields[key].type === "checkbox" &&
        filter[key]
      ) {
        return true
      } else if (
        filterFormData.fields[key].type === "select" &&
        filter[key] &&
        (filter[key] as SelectValue).value
      ) {
        return true
      } else if (
        filterFormData.fields[key].type === "array" &&
        filter[key] &&
        (filter[key] as SelectValue[]).length
      ) {
        return true
      }
      return false
    })
    .map((key) => {
      const fieldData = {
        key,
        field: filterFormData.fields[key].label,
        value: "",
      }
      if (
        filterFormData.fields[key].type === "text" ||
        filterFormData.fields[key].type === "radio"
      ) {
        fieldData.value = String(filter[key])
      } else if (filterFormData.fields[key].type === "checkbox") {
        fieldData.value = String(filter[key]) === "1" ? "Да" : "Нет"
      } else if (filterFormData.fields[key].type === "select") {
        fieldData.value = (filter[key] as SelectValue).label
      } else if (filterFormData.fields[key].type === "array") {
        fieldData.value = (filter[key] as SelectValue[])
          .map((item) => item.label)
          .join(", ")
      }
      return fieldData
    })

  const submitHandler = (token: string, formData: MyFormData) => {
    if (fillQuery(formData, query)) {
      dispatch(setFilter({ fields: formData.fields }))
      console.log("filter changed, relocating...")
      navigate(`${route}?${query.toString()}`)
    }
    setTimeout(() => {
      setFilterOpen(false)
    }, 50)
  }

  const _clearFilterField = (fieldName: string) => {
    const field = filterFormData.fields[fieldName]
    if (field.type === "text") {
      setFieldValue({ field: fieldName, value: "" })
    } else if (field.type === "select") {
      setFieldValue({
        field: fieldName,
        value: { value: "", label: "Не выбрано" },
      })
    } else if (field.type === "array") {
      setFieldValue({
        field: fieldName,
        value: [],
      })
    } else if (field.type === "checkbox") {
      setFieldValue({ field: fieldName, value: "0" })
    }
  }

  const clearFilterField = (fieldName: string) => {
    _clearFilterField(fieldName)
    dispatch(setTootipShow(false))
    setTimeout(() => {
      dispatch(setFilter({ fields: form.fields }))
      if (clearQuery(form, query, fieldName)) {
        navigate(`${route}?${query.toString()}`)
      }
    }, 250)
  }

  const clearFilterForm = () => {
    filledValies.map((item) => {
      console.log("key", item.key)
      _clearFilterField(item.key)
    })
    dispatch(setTootipShow(false))
    setTimeout(() => {
      dispatch(setFilter({ fields: form.fields }))
      if (clearQuery(form, query)) {
        navigate(`${route}?${query.toString()}`)
      }
    }, 300)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setFilterOpen(false)
      }
    }

    const changed = fillFilterForm(filledFormData, query)
    if (changed) {
      setForm(filledFormData)
      dispatch(setFilter({ fields: filledFormData.fields, silent: true }))
    }

    tooltipOn()

    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
      dispatch(clearFilter())
    }
    // eslint-disable-next-line
  }, [])

  const tooltipOn = () => {
    if (!tooltipShow) {
      dispatch(setTootipShow(true))
    }
  }

  useEffect(() => {
    tooltipOn()
    ReactTooltip.rebuild()
  })

  return (
    <div className={classNames("entity-filer__container", name + "-filter")}>
      <button
        ref={btnRef}
        data-tip={"Открыть фильтр"}
        data-for="for-top"
        type="button"
        className="btn btn-simple btn-simple-big btn-simple-border"
        onClick={() => setFilterOpen((state) => !state)}
      >
        <FilterIcon />
      </button>
      {filledValies.length > 0 && (
        <>
          <div className="entity-filter__values">
            {filledValies.map((item) => (
              <div className="entity-filter__value" key={item.value}>
                <span
                  data-tip={item.field}
                  data-for="for-top"
                  onMouseMove={tooltipOn}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.value,
                    }}
                  ></span>
                  <button
                    type="button"
                    className="btn btn-simple btn-transparent"
                    onClick={() => clearFilterField(item.key)}
                  >
                    <DeleteIconSmall />
                  </button>
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-white btn-border"
            onClick={() => clearFilterForm()}
          >
            Сброс
            <DeleteIconSmall />
          </button>
        </>
      )}
      <div
        ref={ref}
        className={classNames([
          name + "-filter",
          "entity-filter",
          { active: filterOpen },
        ])}
      >
        <FormWrapper
          title=""
          formCallback={submitHandler}
          formBtnText="Применить"
          formData={filledFormData}
          goFurther={goFurther}
        >
          {children}
        </FormWrapper>
      </div>
    </div>
  )
}
