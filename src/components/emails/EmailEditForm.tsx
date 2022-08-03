import React, { ReactElement } from "react"
import FormWrapper from "@components/app/forms/formWrapper/FormWrapper"
import { toastAlert } from "@config"
import TextField from "@components/app/forms/formFields/TextField"
import SelectField from "@components/app/forms/formFields/SelectField"
import TextArrayField from "@components/app/forms/formFields/TextArrayField"
import CheckboxField from "@components/app/forms/formFields/CheckboxField"
import RadioField from "@components/app/forms/formFields/RadioField"
import { selectEmailById, addEmail, editEmail } from "@store/slices/emailsSlice"
import { useSelector, useDispatch } from "react-redux"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import type { RootState } from "@store/store"
import {
  clearEmailForm,
  emailEditFormData,
  fillEmailForm,
} from "./emailEditFormData"
import { MyFormData } from "@components/app/forms/formWrapper/types"

interface EmailEditFormProps {
  id?: number
  onDoneCallback(): void
}

export const EmailEditForm: React.FC<EmailEditFormProps> = ({
  id,
  onDoneCallback,
}): ReactElement => {
  const dispatch = useDispatch()

  const filledFormData = Object.assign({}, emailEditFormData)

  const email = useSelector((state: RootState) => selectEmailById(state, id))

  fillEmailForm(filledFormData, email)

  const submitHandler = (token: string, formData: MyFormData) => {
    if (id) {
      dispatch(editEmail({ form: formData, record: email }))
    } else {
      dispatch(addEmail(formData))
    }
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
    clearEmailForm(filledFormData)
    if (onDoneCallback) onDoneCallback()
  }

  return (
    <FormWrapperState formData={emailEditFormData}>
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
            <TextField name="email_addr" />
            <TextField name="password" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h4>Дополнительно</h4>
            <TextField name="secret_word" />
            <TextField name="phone" />
          </div>
        </div>
      </FormWrapper>
    </FormWrapperState>
  )
}
