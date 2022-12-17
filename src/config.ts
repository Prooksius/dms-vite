import { toast } from "react-toastify"
import { ErrorPayloadData } from "@components/app/forms/formWrapper/types"

// test text

export const APP_TITLE = "DMS"
export const REACT_APP_DB_URL = process.env.REACT_APP_DB_URL
export const REACT_APP_SSO_URL = process.env.REACT_APP_SSO_URL
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