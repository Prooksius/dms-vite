import {
  MyFormData,
  NS,
  Subdomain,
} from "@components/app/forms/formWrapper/types"
import type { RegistratorsRecord } from "@store/slices/registratorsSlice"

export const registratorEditFormData: MyFormData = {
  fields: {
    name: {
      label: "Название",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
        minLength: 5,
        maxLength: 255,
      },
      errorMessage: "",
      dirty: false,
    },
    email_id: {
      label: "Почта",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      type: "select",
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    provider_id: {
      label: "Провайдер",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      type: "select",
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    login_link: {
      label: "Ссылка на вход",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    login: {
      label: "Логин",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    password: {
      label: "Пароль",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    api_key: {
      label: "API Key",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    ns: {
      label: "",
      type: "array",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
  },
}

export const clearRegistratorForm = (filledFormData: MyFormData) => {
  Object.keys(filledFormData.fields).map((key) => {
    filledFormData.fields[key].dirty = false
    filledFormData.fields[key].errorMessage = ""
  })
  filledFormData.fields.name.value = ""
  filledFormData.fields.login_link.value = ""
  filledFormData.fields.login.value = ""
  filledFormData.fields.password.value = ""
  filledFormData.fields.email_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.provider_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.ns.valueArr = []
}

export const fillRegistratorForm = (
  filledFormData: MyFormData,
  registrator: RegistratorsRecord
) => {
  if (registrator) {
    Object.keys(filledFormData.fields).map((key) => {
      filledFormData.fields[key].dirty = false
      filledFormData.fields[key].errorMessage = ""
    })
    const ns = registrator.ns.map((item) => {
      return {
        value: item,
      } as NS
    })

    filledFormData.fields.name.value = registrator.name
    filledFormData.fields.login_link.value = registrator.login_link
    filledFormData.fields.login.value = registrator.login
    filledFormData.fields.password.value = registrator.password

    if (registrator.email_id) {
      const email = {
        value: String(registrator.email_id),
        label: registrator.email,
      }
      filledFormData.fields.email_id.valueObj = email
      filledFormData.fields.email_id.options = [
        { value: "", label: "Не выбрано" },
        email,
      ]
    } else {
      filledFormData.fields.email_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    if (registrator.provider_id) {
      const provider = {
        value: String(registrator.provider_id),
        label: registrator.provider_name,
      }
      filledFormData.fields.provider_id.valueObj = provider
      filledFormData.fields.provider_id.options = [
        { value: "", label: "Не выбрано" },
        provider,
      ]
    } else {
      filledFormData.fields.provider_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    filledFormData.fields.ns.valueArr = ns
  } else {
    clearRegistratorForm(filledFormData)
  }
}
