import React from "react"
import { useSelector } from "react-redux"
import {
  setFilter,
  clearFilter,
  listDomainsFilter,
  loadDepartmentOptions,
} from "@store/slices/domainsSlice"
import SelectField from "@components/app/forms/formFields/SelectField"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import DateTimeField from "@components/app/forms/formFields/DateTimeField"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import { filterFormData } from "./domainFilterFormData"
import { loadRegistratorOptions } from "@store/slices/registratorsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"
import { loadServerOptions } from "@store/slices/serversSlice"
import { FilterWrapper } from "@components/app/FilterWrapper"
import TagsField from "@components/app/forms/formFields/TagsField"

const DomainsFilterInner: React.FC = () => {
  const filter = useSelector(listDomainsFilter)

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
  }

  return (
    <FilterWrapper
      name="domains"
      filter={filter}
      filterFormData={filterFormData}
      goFurther={goFurther}
      setFilter={setFilter}
      clearFilter={clearFilter}
    >
      <div className="form__row domain-tags-row">
        <div className="col-sm-12">
          <TagsField name="tags" creatable={false} />
        </div>
      </div>
      <div className="form__row form__row-filter">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <SelectField name={"available_condition"} />
          <SelectField name={"active"} />
          <SelectAsyncField
            name={"department_name"}
            searchCallback={loadDepartmentOptions}
          />
          <SelectAsyncField
            name={"server_id"}
            searchCallback={loadServerOptions}
          />
          <SelectAsyncField
            name={"provider_id"}
            searchCallback={loadProviderOptions}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <SelectAsyncField
            name={"registrator_id"}
            searchCallback={loadRegistratorOptions}
          />
          <SelectField name={"is_activated"} />
          <DateTimeField name={"registration_date"} timeFormat={false} />
          <DateTimeField name={"expirationtime_condition"} timeFormat={false} />
        </div>
      </div>
    </FilterWrapper>
  )
}

export const DomainsFilter: React.FC = () => {
  return (
    <FormWrapperState formData={filterFormData}>
      <DomainsFilterInner />
    </FormWrapperState>
  )
}
