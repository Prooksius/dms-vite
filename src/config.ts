import { toast } from "react-toastify"
import {
  ArrayValue,
  ErrorPayloadData,
  MyFormData,
  SelectValue,
} from "@components/app/forms/formWrapper/types"

// test text

export const APP_TITLE = "DMS"
export const REACT_APP_DB_URL = import.meta.env.VITE_DB_URL
export const REACT_APP_SSO_URL = import.meta.env.VITE_SSO_URL
//export const REACT_APP_DB_URL = "https://dev.seodms.com/api/v1.0"
//export const REACT_APP_SSO_URL = "https://sso.seoreserved.ru/auth?service=dms_local"

let lastId = 0

export const getNewID = (prefix = "element-id") => {
  lastId++
  return `${prefix}${lastId}`
}

export function formatDateTime(
  value: string | number | Date,
  format = "date",
  lang = "ru-RU"
) {
  const options: Intl.DateTimeFormatOptions = {}

  if (format === "year") {
    options.year = "numeric"
  } else {
    if (format.includes("date")) {
      options.day = "2-digit"
      options.month = "2-digit"
      options.year = "numeric"
    }

    if (format.includes("time")) {
      options.hour = "2-digit"
      options.minute = "2-digit"
    }
  }
  return new Intl.DateTimeFormat(lang, options).format(new Date(value))
}

export function pluralType(n: number, lang = "ru-RU"): number {
  if (lang === "ru-RU") {
    return n % 10 == 1 && n % 100 != 11
      ? 0
      : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? 1
      : 2
  } else {
    return n === 1 ? 0 : 1
  }
}
export function pluralName(n: number, lang = "ru-RU"): number {
  if (lang === "ru-RU") {
    return n % 10 == 1 && n % 100 != 11 ? 0 : 1
  } else {
    return 0
  }
}

export const askConfirm = {
  title: "Вы уверены?",
  subtitle: "",
  btnConfirm: "Да",
  btnCancel: "Отмена",
}

export const getSelectFromQuery = (param: string): SelectValue => {
  const arr = param.split(";")
  return {
    value: arr[0],
    label: arr[1],
  }
}
export const getArrayFromQuery = (param: string): ArrayValue[] => {
  const arr = param.split(";")
  const values = arr[0].split(",")
  const labels = arr[1].split(",")
  return values.map((item, key) => {
    return {
      value: values[key],
      label: labels[key],
    }
  })
}

export const fillFilterForm = (
  filledFormData: MyFormData,
  query: URLSearchParams
): boolean => {
  let filled = false
  Object.keys(filledFormData.fields).map((fieldName) => {
    const field = filledFormData.fields[fieldName]
    if (query.has(fieldName)) {
      filled = true
      if (field.type === "select") {
        field.valueObj = getSelectFromQuery(query.get(fieldName))
      } else if (field.type === "array") {
        field.valueArr = getArrayFromQuery(query.get(fieldName))
      } else if (field.type === "text") {
        field.value = query.get(fieldName)
      }
    }
  })

  return filled
}

export const fillQuery = (
  filledFormData: MyFormData,
  query: URLSearchParams
): boolean => {
  let filled = false
  Object.keys(filledFormData.fields).map((fieldName) => {
    const field = filledFormData.fields[fieldName]
    let query_value = query.get(fieldName)
    if (!query_value) query_value = ""
    let field_value = field.value
    let field_real_value = field.value
    if (field.type === "select") {
      field_value =
        field.valueObj.value !== ""
          ? field.valueObj.value + ";" + field.valueObj.label
          : ""
      field_real_value = field.valueObj.value
    } else if (field.type === "array") {
      field_value = field.valueArr.length
        ? field.valueArr.map((item) => item.value).join(",") +
          ";" +
          field.valueArr.map((item) => item.label).join(",")
        : ""
      field_real_value = field.valueArr.map((item) => item.value).join(",")
    }

    if (query_value !== field_value) {
      filled = true
      if (field_real_value !== "") {
        query.set(fieldName, field_value)
      } else {
        query.delete(fieldName)
      }
    }
  })
  if (query.has("page")) {
    filled = true
    query.delete("page")
  }

  return filled
}

export const clearQuery = (
  filledFormData: MyFormData,
  query: URLSearchParams,
  fieldName = ""
): boolean => {
  let changed = false
  if (!fieldName) {
    Object.keys(filledFormData.fields).map((field) => {
      if (query.has(field)) {
        changed = true
        query.delete(field)
      }
    })
  } else {
    if (query.has(fieldName)) {
      changed = true
      query.delete(fieldName)
    }
  }
  if (query.has("page")) {
    changed = true
    query.delete("page")
  }

  return changed
}

export function errorToastText(payload: ErrorPayloadData): string {
  const errors: string[] = []
  if (typeof payload.detail !== "string") {
    payload.detail.map((detail) => {
      errors.push("где: " + detail.loc.join(", ") + ", " + detail.msg)
    })
  } else {
    errors.push(payload.detail)
  }
  return errors.join(", ")
}

export function toastAlert(title: string, type = "info") {
  if (type === "info") {
    toast[type](title)
  } else if (type === "warning") {
    toast[type](title)
  } else if (type === "error") {
    toast.error(title)
  } else if (type === "success") {
    toast.success(title)
  }
}
