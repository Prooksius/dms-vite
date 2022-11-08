import React, { ReactElement } from "react"
import FormWrapper from "@components/app/forms/formWrapper/FormWrapper"
import TextField from "@components/app/forms/formFields/TextField"
import SelectField from "@components/app/forms/formFields/SelectField"
import TextArrayField from "@components/app/forms/formFields/TextArrayField"
import {
  selectServerById,
  addServer,
  editServer,
} from "@store/slices/serversSlice"
import { useSelector, useDispatch } from "react-redux"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import type { RootState } from "@store/store"
import {
  clearServerForm,
  serverEditFormData,
  fillServerForm,
} from "./serverEditFormData"
import {
  MyFormData,
} from "@components/app/forms/formWrapper/types"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import {
  getProviderRegistratorNames,
} from "@store/slices/registratorsSlice"
import { loadDepartmentOptions } from "@store/slices/domainsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"

interface ServerEditFormProps {
  id?: number
  onDoneCallback(): void
}

export const ServerEditForm: React.FC<ServerEditFormProps> = ({
  id,
  onDoneCallback,
}): ReactElement => {
  const dispatch = useDispatch()

  const filledFormData = Object.assign({}, serverEditFormData)

  const server = useSelector((state: RootState) => selectServerById(state, id))

  fillServerForm(filledFormData, server)

  const submitHandler = (token: string, formData: MyFormData) => {
    if (id) {
      formData.id = id
      dispatch(editServer({ form: formData, record: server }))
    } else {
      dispatch(addServer(formData))
    }
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
    clearServerForm(filledFormData)
    if (onDoneCallback) onDoneCallback()
  }

  return (
    <FormWrapperState formData={serverEditFormData}>
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
            <SelectAsyncField
              name={"department_name"}
              searchCallback={loadDepartmentOptions}
            />
            <h5>
              IP-адреса <span className="required">*</span>
            </h5>
            <TextArrayField name="ip_addr" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h4>Дополнительно</h4>
            <SelectAsyncField
              name={"provider_id"}
              searchCallback={loadProviderOptions}
            />
            <SelectField
              name={"registrator_id"}
              loadCallback={getProviderRegistratorNames}
            />
            <TextField name="login_link_cp" />
            <TextField name="web_panel" />
          </div>
        </div>
      </FormWrapper>
    </FormWrapperState>
  )
}
