import { createContext } from "react"
import { FormContextProps } from "./types"

const initialState: FormContextProps = {
  form: {
    fields: {},
  },
  setForm: null,
  checkForm: null,
  checkField: null,
  clearForm: null,
  setFieldValue: null,
}

export const FormWrapperContext = createContext<FormContextProps>(initialState)
