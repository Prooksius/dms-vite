import React from "react"
import { useSelector } from "react-redux"
import { setFilter, clearFilter, listServersFilter } from "@store/slices/serversSlice"
import SelectField from "@components/app/forms/formFields/SelectField"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import { filterFormData } from "./serversFilterFormData"
import { getProviderRegistratorNames } from "@store/slices/registratorsSlice"
import { loadDepartmentOptions } from "@store/slices/domainsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"
import { FilterWrapper } from "@components/app/FilterWrapper"

const ServersFilterInner: React.FC = () => {
  const filter = useSelector(listServersFilter)

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
  }

  return (
    <FilterWrapper
      name="servers"
      filter={filter}
      filterFormData={filterFormData}
      goFurther={goFurther}
      setFilter={setFilter}
      clearFilter={clearFilter}
    >
      <div className="form__row form__row-filter">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <SelectAsyncField
            name={"department_name"}
            searchCallback={loadDepartmentOptions}
          />
          <SelectAsyncField
            name={"provider_id"}
            searchCallback={loadProviderOptions}
          />
          <SelectField
            name={"registrator_id"}
            loadCallback={getProviderRegistratorNames}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <SelectField name={"active"} />
        </div>
      </div>
    </FilterWrapper>
  )
}

export const ServersFilter: React.FC = () => {
  return (
    <FormWrapperState formData={filterFormData}>
      <ServersFilterInner />
    </FormWrapperState>
  )
}
