import classNames from "classnames"
import React, {
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { toastAlert } from "@config"
import { setFilter, listServersFilter } from "@store/slices/serversSlice"
import SelectField from "@components/app/forms/formFields/SelectField"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import TextField from "@components/app/forms/formFields/TextField"
import DateTimeField from "@components/app/forms/formFields/DateTimeField"
import FormWrapper from "@components/app/forms/formWrapper/FormWrapper"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import { FilterIcon } from "@components/app/icons/FilterIcon"
import { filterFormData } from "./serversFilterFormData"
import {
  MyFormData,
  SelectValue,
} from "@components/app/forms/formWrapper/types"
import { FormWrapperContext } from "@components/app/forms/formWrapper/formWrapperContext"
import { DeleteIconSmall } from "@components/app/icons/DeleteIconSmall"
import { listTooltipShow, setTootipShow } from "@store/slices/globalsSlice"
import ReactTooltip from "react-tooltip"
import { getProviderRegistratorNames } from "@store/slices/registratorsSlice"
import { loadDepartmentOptions } from "@store/slices/domainsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"

type ItemsObject = {
  id: string
  title: string
}
type OptionsObject = {
  value: string
  label: string
}
type Additional = {
  page: number
}

type SelectedValue = {
  key: string
  field: string
  value: string
}

const ServersFilterInner: React.FC = () => {
  const dispatch = useDispatch()
  const ref = useRef(null)
  const btnRef = useRef(null)

  const tooltipShow = useSelector(listTooltipShow)

  const { form, setFieldValue } = useContext(FormWrapperContext)

  const [filterOpen, setFilterOpen] = useState(false)

  const filter = useSelector(listServersFilter)

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
      }
      return fieldData
    })

  const submitHandler = (token: string, formData: MyFormData) => {
    console.log("submitHandler")
    dispatch(setFilter(formData.fields))
    setTimeout(() => {
      setFilterOpen(false)
    }, 500)
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
    } else if (field.type === "checkbox") {
      setFieldValue({ field: fieldName, value: "0" })
    }
  }

  const clearFilterField = (fieldName: string) => {
    _clearFilterField(fieldName)
    dispatch(setTootipShow(false))
    setTimeout(() => {
      dispatch(setFilter(form.fields))
    }, 250)
  }

  const clearFilterForm = () => {
    filledValies.map((item) => {
      console.log("key", item.key)
      _clearFilterField(item.key)
    })
    dispatch(setTootipShow(false))
    setTimeout(() => {
      dispatch(setFilter(form.fields))
    }, 300)
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (
        ref.current &&
        //        event.target !== btnRef.current &&
        //        target.closest("button") !== btnRef.current &&
        !ref.current.contains(event.target)
      ) {
        setFilterOpen(false)
      }
    }

    tooltipOn()

    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
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
    <div className="entity-filer__container domains-filter">
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
          "domains-filter entity-filter",
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
          <div className="form__row form__row-filter">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <SelectAsyncField
                name={"department_name"}
                searchCallback={loadDepartmentOptions}
              />
              <SelectAsyncField
                name={"provider_id"}
                searchCallback={loadProviderOptions}
              />
              <SelectField
                name={"registrator_id"}
                loadCallback={getProviderRegistratorNames}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <SelectField name={"active"} />
            </div>
          </div>
        </FormWrapper>
      </div>
    </div>
  )
}

export const ServersFilter: React.FC = () => {
  return (
    <FormWrapperState formData={filterFormData}>
      <ServersFilterInner />
    </FormWrapperState>
  )
}
