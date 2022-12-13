import React, { useContext } from "react"
import classnames from "classnames"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import { getNewID } from "@config"
import { SwitchIconProps } from "@components/app/icons/SwitchIcon"

interface CheckIconFieldProps {
  name: string
  Icon: React.FC<SwitchIconProps>
}

const CheckIconField: React.FC<CheckIconFieldProps> = ({ name, Icon }) => {
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const thisField = form.fields[name]

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  return (
    <div data-tip={thisField.label} data-for="for-top">
      <Icon
        active={thisField.value === "1"}
        doSwitch={(condition: boolean) =>
          setFieldValue({
            field: name,
            value: thisField.value === "1" ? "0" : "1",
          })
        }
      />
    </div>
  )
}

export default CheckIconField
