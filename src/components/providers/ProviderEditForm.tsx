import React, { ReactElement } from "react"
import FormWrapper from "@components/app/forms/formWrapper/FormWrapper"
import { toastAlert } from "@config"
import TextField from "@components/app/forms/formFields/TextField"
import SelectField from "@components/app/forms/formFields/SelectField"
import TextArrayField from "@components/app/forms/formFields/TextArrayField"
import CheckboxField from "@components/app/forms/formFields/CheckboxField"
import RadioField from "@components/app/forms/formFields/RadioField"
import {
  selectItemById,
  addProvider,
  editProvider,
} from "@store/slices/providersSlice"
import { useSelector, useDispatch } from "react-redux"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import type { RootState } from "@store/store"
import {
  clearRecordForm,
  providerEditFormData,
  fillRecordForm,
} from "./providerEditFormData"
import { MyFormData } from "@components/app/forms/formWrapper/types"

interface ProviderEditFormProps {
  id?: number
  onDoneCallback(): void
}

export const ProviderEditForm: React.FC<ProviderEditFormProps> = ({
  id,
  onDoneCallback,
}): ReactElement => {
  const dispatch = useDispatch()

  const filledFormData = Object.assign({}, providerEditFormData)

  const provider = useSelector((state: RootState) => selectItemById(state, id))

  fillRecordForm(filledFormData, provider)

  const submitHandler = (token: string, formData: MyFormData) => {
    if (id) {
      dispatch(editProvider({ form: formData, record: provider }))
    } else {
      dispatch(addProvider(formData))
    }
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
    clearRecordForm(filledFormData)
    if (onDoneCallback) onDoneCallback()
  }

  return (
    <FormWrapperState formData={providerEditFormData}>
      <FormWrapper
        title=""
        formCallback={submitHandler}
        formBtnText="Сохранить"
        formData={filledFormData}
        goFurther={goFurther}
      >
        <TextField name="name" />
        <TextField name="url" />
      </FormWrapper>
    </FormWrapperState>
  )
}
