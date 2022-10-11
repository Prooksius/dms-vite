import { MyFormData } from "@components/app/forms/formWrapper/types"

export const filterFormData: MyFormData = {
  fields: {
    email_id: {
      label: "E-mail",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      type: "select",
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {},
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
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    created_at: {
      label: "Дата добавления",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      type: "text",
      validations: {},
      errorMessage: "",
      dirty: false,
    },
  },
}
