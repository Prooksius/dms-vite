import React from "react"
import { useSelector } from "react-redux"
import {
  setFilter,
  clearFilter,
  listRegistratorsFilter,
} from "@store/slices/registratorsSlice"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import DateTimeField from "@components/app/forms/formFields/DateTimeField"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import { filterFormData } from "./registratorFilterFormData"
import { loadEmailOptions } from "@store/slices/emailsSlice"
import { loadProviderOptions } from "@store/slices/providersSlice"
import { FilterWrapper } from "@components/app/FilterWrapper"

const RegistratorsFilterInner: React.FC = () => {
  const filter = useSelector(listRegistratorsFilter)

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
  }

  return (
    <FilterWrapper
      name="emails"
      filter={filter}
      filterFormData={filterFormData}
      goFurther={goFurther}
      setFilter={setFilter}
      clearFilter={clearFilter}
    >
      <SelectAsyncField name={"email_id"} searchCallback={loadEmailOptions} />
      <SelectAsyncField
        name={"provider_id"}
        searchCallback={loadProviderOptions}
      />
      <DateTimeField name={"created_at"} timeFormat={false} />
    </FilterWrapper>
  )
}

export const RegistratorsFilter: React.FC = () => {
  return (
    <FormWrapperState formData={filterFormData}>
      <RegistratorsFilterInner />
    </FormWrapperState>
  )
}
