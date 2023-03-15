import React from "react"
import { useSelector } from "react-redux"
import {
  setFilter,
  clearFilter,
  listEmailsFilter,
  loadEmailOptionsName,
} from "@store/slices/emailsSlice"
import DateTimeField from "@components/app/forms/formFields/DateTimeField"
import { FormWrapperState } from "@components/app/forms/formWrapper/FormWrapperState"
import { emailsFilterFormData } from "./emailsFilterFormData"
import SelectAsyncField from "@components/app/forms/formFields/SelectAsyncField"
import { FilterWrapper } from "@components/app/FilterWrapper"

const EmailsFilterInner: React.FC = () => {
  const filter = useSelector(listEmailsFilter)

  const goFurther = () => {
    // дальнейшие действия после успешной отправки формы
  }

  return (
    <FilterWrapper
      name="emails"
      filter={filter}
      filterFormData={emailsFilterFormData}
      goFurther={goFurther}
      setFilter={setFilter}
      clearFilter={clearFilter}
    >
      <SelectAsyncField
        name={"email_addr"}
        searchCallback={loadEmailOptionsName}
      />
      <DateTimeField name={"created_at"} timeFormat={false} />
    </FilterWrapper>
  )
}

export const EmailsFilter: React.FC = () => {
  return (
    <FormWrapperState formData={emailsFilterFormData}>
      <EmailsFilterInner />
    </FormWrapperState>
  )
}
