import React, { ReactElement, useEffect, useState } from "react"
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
  listDomainsEditStatus,
  listDomainsError,
  listDomainsErrorData,
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
import { getServerIPs, loadServerOptions } from "@store/slices/serversSlice"
import {
  getProviderRegistratorNames,
  getRegistratorNS,
  loadRegistratorOptions,
} from "@store/slices/registratorsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"
import TextareaField from "@components/app/forms/formFields/TextareaField"
import CheckboxArrayField from "@components/app/forms/formFields/CheckboxArrayField"
import CheckIconField from "@components/app/forms/formFields/CheckIconField"
import { SwitchIcon } from "@components/app/icons/SwitchIcon"
import TagsField from "@components/app/forms/formFields/TagsField"
import DateTimeField from "@components/app/forms/formFields/DateTimeField"

interface DomainEditFormProps {
  id?: number
  onDoneCallback(): void
}

export const DomainEditForm: React.FC<DomainEditFormProps> = ({
  id,
  onDoneCallback,
}: DomainEditFormProps): ReactElement => {
  const dispatch = useDispatch()

  const [formFilled, setFormFilled] = useState<boolean>(false)

  const filledFormData = Object.assign({}, domainEditFormData)

  const domain = useSelector((state: RootState) => selectDomainById(state, id))
  const editState = useSelector(listDomainsEditStatus)
  const editError = useSelector(listDomainsError)
  const editErrorData = useSelector(listDomainsErrorData)

  const submitHandler = (token: string, formData: MyFormData) => {
    if (id) {
      console.log("edit start")
      dispatch(editDomain({ form: formData, record: domain }))
    } else {
      dispatch(addDomain(formData))
    }
  }

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
    if (onDoneCallback) onDoneCallback()
  }

  useEffect(() => {
    fillDomainForm(filledFormData, domain)
    setFormFilled(true)
    // eslint-disable-next-line
  }, [])

  return (
    <FormWrapperState formData={domainEditFormData}>
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
              <SelectField name={"ip_addr_id"} loadCallback={getServerIPs} />
              <SelectAsyncField
                name={"provider_id"}
                searchCallback={loadProviderOptions}
              />
              <SelectField
                name={"registrator_id"}
                loadCallback={getProviderRegistratorNames}
              />
              <TextareaField name="notes" />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <h4>DNS хостинг</h4>
              <SelectAsyncField
                name={"hosting_id"}
                searchCallback={loadProviderOptions}
              />
              <SelectField
                name={"hosting_acc_id"}
                loadCallback={getProviderRegistratorNames}
              />
              <CheckboxArrayField
                name="ns"
                initialLoad={false}
                loadCallback={getRegistratorNS}
              />
              <br />
              <h4
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Мониторинг
                <CheckIconField name="is_activated" Icon={SwitchIcon} />
              </h4>
              <CheckboxField name="whois_status" />
              <CheckboxField name="available_status" />
              <CheckboxField name="rkn_status" />
              <CheckboxField name="ssl_status" />
              <CheckboxField name="expirationtime_status" />
              <DateTimeField
                name={"expirationtime_condition"}
                timeFormat={false}
                calendar="right-top"
              />
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <h4>Поддомены</h4>
              <SubdomainsField name="subdomains" domainName="name" />
            </div>
          </div>
        )}
      </FormWrapper>
    </FormWrapperState>
  )
}
