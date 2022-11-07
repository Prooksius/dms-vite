import { MyFormData, NS } from "@components/app/forms/formWrapper/types"
import type { ServersRecord } from "@store/slices/serversSlice"

export const serverEditFormData: MyFormData = {
  fields: {
    name: {
      label: "Название",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
        minLength: 5,
        maxLength: 255,
      },
      errorMessage: "",
      dirty: false,
    },
    department_name: {
      label: "Отдел",
      type: "select",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    ip_addr: {
      label: "",
      type: "array",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    login_link_cp: {
      label: "Ссылка на вход в ПУ",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    web_panel: {
      label: "Веб-панель",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    provider_id: {
      label: "Хостинг",
      type: "select",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    registrator_id: {
      label: "Аккаунт хостинга",
      type: "select",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      dependency: {
        field: "provider_id",
        type: "loadDropdown",
      },
      errorMessage: "",
      dirty: false,
    },
  },
}

export const clearServerForm = (filledFormData: MyFormData) => {
  Object.keys(filledFormData.fields).map((key) => {
    filledFormData.fields[key].dirty = false
    filledFormData.fields[key].errorMessage = ""
  })
  filledFormData.fields.name.value = ""
  filledFormData.fields.department_name.value = ""
  filledFormData.fields.ip_addr.valueArr = []
  filledFormData.fields.login_link_cp.value = ""
  filledFormData.fields.web_panel.value = ""
  filledFormData.fields.provider_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.registrator_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
}

export const fillServerForm = (
  filledFormData: MyFormData,
  server: ServersRecord
) => {
  if (server) {
    Object.keys(filledFormData.fields).map((key) => {
      filledFormData.fields[key].dirty = false
      filledFormData.fields[key].errorMessage = ""
    })
    filledFormData.fields.name.value = server.name
    filledFormData.fields.department_name.valueObj = {
      value: server.department_name,
      label: server.department_name,
    }

    if (server.provider_id) {
      const provider = {
        value: String(server.provider_id),
        label: server.provider_name,
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

    if (server.registrator_id) {
      const registrator = {
        value: String(server.registrator_id),
        label: server.registrator_name,
      }
      filledFormData.fields.registrator_id.valueObj = registrator
      filledFormData.fields.registrator_id.options = [
        { value: "", label: "Не выбрано" },
        registrator,
      ]
    } else {
      filledFormData.fields.registrator_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    const recordIPs = server.ip_addr || []

    const ips = recordIPs.map((item) => {
      return {
        value: item.ip_addr,
      } as NS
    })

    filledFormData.fields.ip_addr.valueArr = ips
    filledFormData.fields.login_link_cp.value = server.login_link_cp
    filledFormData.fields.web_panel.value = server.web_panel
  } else {
    clearServerForm(filledFormData)
  }
}
