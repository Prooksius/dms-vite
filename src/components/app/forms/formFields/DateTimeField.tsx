import React, { useContext, useEffect, useState } from "react"
import classnames from "classnames"
//import Datetime from "react-datetime"
import "moment/locale/ru"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import { CalendarIcon } from "@components/app/icons/CalendarIcon"
import "react-datetime/css/react-datetime.css"
import { FieldData } from "../formWrapper/types"
import moment from "moment"
import ReactDatetimeClass from "react-datetime"
let Datetime = ReactDatetimeClass
if (ReactDatetimeClass.default) Datetime = ReactDatetimeClass.default

type CalendarPlace = "left-top" | "left-bottom" | "right-top" | "right-bottom"

interface DateTimeFieldProps {
  name: string
  timeFormat: boolean
  future?: boolean
  calendar?: CalendarPlace
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({
  name,
  timeFormat,
  future = false,
  calendar = "left-bottom",
}) => {
  const { form, setFieldValue } = useContext(FormWrapperContext)
  const [depValue, setDepValue] = useState(true)
  const [disabled, setDisabled] = useState(false)

  const thisField = form.fields[name]
  const dependField = form.fields[thisField?.dependency?.field]

  const today = moment()
  const valid = function (current: moment.Moment) {
    return future ? current.isAfter(today) : true
  }

  const getDepFieldValue = (thisField: FieldData): boolean => {
    if (thisField.dependency) {
      if (["checkbox"].includes(dependField.type)) {
        return dependField.value === "1" ? true : false
      }
    }
    return true
  }

  useEffect(() => {
    const setDeps = async () => {
      const val = getDepFieldValue(thisField)
      if (dependField && depValue != val) {
        if (thisField.dependency?.type === "disable") {
          if (depValue) {
            setDisabled(true)
            setFieldValue({
              field: name,
              value: "",
            })
          } else {
            setDisabled(false)
          }
          setDepValue(val)
        }
      }
    }
    setDeps()
  })

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  const required = thisField.validations.required || false

  return (
    <div
      className={classnames(
        "form-field",
        "date-time-field",
        "calendar-" + calendar,
        { disabled },
        { hasValue: thisField.value },
        { invalid: thisField.errorMessage },
        { valid: !thisField.errorMessage && thisField.dirty }
      )}
    >
      <Datetime
        locale={"ru"}
        className="form-field"
        value={thisField.value || ""}
        inputProps={{ value: thisField.value || "", disabled }}
        timeFormat={timeFormat}
        closeOnSelect={true}
        isValidDate={valid}
        onChange={(value) =>
          setFieldValue({
            field: name,
            value:
              typeof value === "string" ? value : value.format("DD.MM.YYYY"),
          })
        }
      />
      <label>
        {thisField.label}
        {required && <span className="required">*</span>}
      </label>
      <CalendarIcon />
      <small
        className={classnames("error-label", {
          opened: thisField.errorMessage,
        })}
      >
        {thisField.errorMessage}
      </small>
    </div>
  )
}

export default DateTimeField
