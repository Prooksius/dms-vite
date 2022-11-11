import React, { ReactElement, useEffect, useState } from "react"
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
  listEditStatus,
  listError,
  listErrorData,
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

  const [formFilled, setFormFilled] = useState<boolean>(false)

  const filledFormData = Object.assign({}, providerEditFormData)

  const provider = useSelector((state: RootState) => selectItemById(state, id))
  const editState = useSelector(listEditStatus)
  const editError = useSelector(listError)
  const editErrorData = useSelector(listErrorData)

  const submitHandler = (token: string, formData: MyFormData) => {
    if (id) {
      dispatch(editProvider({ form: formData, record: provider }))
    } else {
      dispatch(addProvider(formData))
    }
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
    if (onDoneCallback) onDoneCallback()
  }

  useEffect(() => {
    fillRecordForm(filledFormData, provider)
    setFormFilled(true)
    // eslint-disable-next-line
  }, [])

  return (
    <FormWrapperState formData={providerEditFormData}>
      <FormWrapper
        title=""
        formCallback={submitHandler}
        editStatus={editState}
        editError={editError}
        editErrorData={editErrorData}
        formBtnText="Сохранить"
        formData={filledFormData}
        goFurther={goFurther}
      >
        {formFilled && (
          <>
            <TextField name="name" />
            <TextField name="url" />
          </>
        )}
      </FormWrapper>
    </FormWrapperState>
  )
}
