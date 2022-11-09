import type { MyFormData } from "@components/app/forms/formWrapper/types"
import type { ProvidersRecord } from "@store/slices/providersSlice"

export const providerEditFormData: MyFormData = {
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
      },
      errorMessage: "",
      dirty: false,
    },
    url: {
      label: "URL",
      type: "text",
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
  },
}

export const clearRecordForm = (filledFormData: MyFormData) => {
  Object.keys(filledFormData.fields).map((key) => {
    filledFormData.fields[key].dirty = false
    filledFormData.fields[key].errorMessage = ""
  })
  filledFormData.fields.name.value = ""
  filledFormData.fields.url.value = ""
}

export const fillRecordForm = (
  filledFormData: MyFormData,
  provider: ProvidersRecord
) => {
  if (provider) {
    Object.keys(filledFormData.fields).map((key) => {
      filledFormData.fields[key].dirty = false
      filledFormData.fields[key].errorMessage = ""
    })
    filledFormData.fields.name.value = provider.name
    filledFormData.fields.url.value = provider.url
  } else {
    clearRecordForm(filledFormData)
  }
}
