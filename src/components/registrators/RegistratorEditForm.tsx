import React, { ReactElement } from "react"
import FormWrapper from "@components/app/forms/formWrapper/FormWrapper"
import { toastAlert } from "@config"
import TextField from "@components/app/forms/formFields/TextField"
import SelectField from "@components/app/forms/formFields/SelectField"
import TextArrayField from "@components/app/forms/formFields/TextArrayField"
import {
  selectRegistratorById,
  addRegistrator,
  editRegistrator,
} from "@store/slices/registratorsSlice"
import { useSelector, useDispatch } from "react-redux"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import type { RootState } from "@store/store"
import {
  clearRegistratorForm,
  registratorEditFormData,
  fillRegistratorForm,
} from "./registratorEditFormData"
import { MyFormData, NS } from "@components/app/forms/formWrapper/types"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import { loadEmailOptions } from "@store/slices/emailsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"

interface RegistratorEditFormProps {
  id?: number
  onDoneCallback(): void
}

export const RegistratorEditForm: React.FC<RegistratorEditFormProps> = ({
  id,
  onDoneCallback,
}: RegistratorEditFormProps): ReactElement => {
  const dispatch = useDispatch()

  const filledFormData = Object.assign({}, registratorEditFormData)

  const registrator = useSelector((state: RootState) =>
    selectRegistratorById(state, id)
  )

  fillRegistratorForm(filledFormData, registrator)

  const submitHandler = (token: string, formData: MyFormData) => {
    if (id) {
      dispatch(editRegistrator({ form: formData, record: registrator }))
    } else {
      dispatch(addRegistrator(formData))
    }
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
    clearRegistratorForm(filledFormData)
    if (onDoneCallback) onDoneCallback()
  }

  return (
    <FormWrapperState formData={registratorEditFormData}>
      <FormWrapper
        title=""
        formCallback={submitHandler}
        formBtnText="Сохранить"
        formData={filledFormData}
        goFurther={goFurther}
      >
        <div className="form__row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h4>Основное</h4>
            <TextField name="name" />
            <TextField name="login_link" />
            <SelectAsyncField
              name={"email_id"}
              searchCallback={loadEmailOptions}
            />
            <TextField name="login" />
            <TextField name="password" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h4>Провайдер</h4>
            <SelectAsyncField
              name={"provider_id"}
              searchCallback={loadProviderOptions}
            />
            <h5>NS</h5>
            <TextArrayField name="ns" />
          </div>
        </div>
      </FormWrapper>
    </FormWrapperState>
  )
}
