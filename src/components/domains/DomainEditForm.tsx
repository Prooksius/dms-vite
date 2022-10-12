import React, { ReactElement } from "react"
import FormWrapper from "@components/app/forms/formWrapper/FormWrapper"
import { toastAlert } from "@config"
import TextField from "@components/app/forms/formFields/TextField"
import SelectField from "@components/app/forms/formFields/SelectField"
import TextArrayField from "@components/app/forms/formFields/TextArrayField"
import CheckboxField from "@components/app/forms/formFields/CheckboxField"
import RadioField from "@components/app/forms/formFields/RadioField"
import {
  selectDomainById,
  addDomain,
  editDomain,
  loadDepartmentOptions,
} from "@store/slices/domainsSlice"
import { useSelector, useDispatch } from "react-redux"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import type { RootState } from "@store/store"
import {
  clearDomainForm,
  domainEditFormData,
  fillDomainForm,
} from "./domainEditFormData"
import { MyFormData } from "@components/app/forms/formWrapper/types"
import SubdomainsField from "@components/app/forms/formFields/SubdomainsField"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import { loadServerOptions } from "@store/slices/serversSlice"
import { loadRegistratorOptions } from "@store/slices/registratorsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"

interface DomainEditFormProps {
  id?: number
  onDoneCallback(): void
}

export const DomainEditForm: React.FC<DomainEditFormProps> = ({
  id,
  onDoneCallback,
}: DomainEditFormProps): ReactElement => {
  const dispatch = useDispatch()

  const filledFormData = Object.assign({}, domainEditFormData)

  const domain = useSelector((state: RootState) => selectDomainById(state, id))

  fillDomainForm(filledFormData, domain)

  const submitHandler = (token: string, formData: MyFormData) => {
    if (id) {
      dispatch(editDomain({ form: formData, record: domain }))
    } else {
      dispatch(addDomain(formData))
    }
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
    clearDomainForm(filledFormData)
    if (onDoneCallback) onDoneCallback()
  }

  return (
    <FormWrapperState formData={domainEditFormData}>
      <FormWrapper
        title=""
        formCallback={submitHandler}
        formBtnText="Сохранить"
        formData={filledFormData}
        goFurther={goFurther}
      >
        <div className="form__row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h4>Основное</h4>
            <TextField name="name" />
            <SelectAsyncField
              name={"department_name"}
              searchCallback={loadDepartmentOptions}
            />
            <SelectAsyncField
              name={"server_id"}
              searchCallback={loadServerOptions}
            />
            <SelectAsyncField
              name={"registrator_id"}
              searchCallback={loadRegistratorOptions}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h4>DNS хостинг</h4>
            <SelectAsyncField
              name={"provider_id"}
              searchCallback={loadProviderOptions}
            />
            <h5>NS</h5>
            <TextArrayField name="ns" />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h4>Мониторинг</h4>
            <CheckboxField name="whois_status" />
            <CheckboxField name="available_status" />
            <CheckboxField name="rkn_status" />
            <CheckboxField name="ssl_status" />
            <CheckboxField name="expirationtime_status" />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h4>Поддомены</h4>
            <SubdomainsField name="subdomains" domainName="name" />
          </div>
        </div>
      </FormWrapper>
    </FormWrapperState>
  )
}
