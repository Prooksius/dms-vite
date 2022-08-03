import React, { useContext } from "react"
import classnames from "classnames"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import Select, { components } from "react-select"
import { SelectValue } from "../formWrapper/types"

const { SingleValue, Option } = components

const IconSingleValue = (props: any) => (
  <SingleValue {...props}>
    {props.data.image && (
      <img
        src={props.data.image}
        alt=""
        style={{
          height: "30px",
          width: "30px",
          borderRadius: "2px",
          marginRight: "10px",
          objectFit: "contain",
        }}
      />
    )}
    {props.data.label}
  </SingleValue>
)

const IconOption = (props: any) => (
  <Option {...props}>
    {props.data.image && (
      <img
        src={props.data.image}
        alt=""
        style={{
          height: "30px",
          width: "30px",
          borderRadius: "2px",
          marginRight: "10px",
          objectFit: "contain",
        }}
      />
    )}
    {props.data.label}
  </Option>
)

// Step 3
const customStyles = {
  option: (provided: any) => ({
    ...provided,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
}

interface SelectFieldProps {
  name: string
}

const SelectField: React.FC<SelectFieldProps> = ({ name }) => {
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const thisField = form.fields[name]

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  const required = thisField.validations.required || false
  const dropdownType = thisField.dropdown || "default"

  return (
    <div
      className={classnames(
        "form-field",
        { hasValue: thisField.valueObj.label },
        { invalid: thisField.errorMessage },
        { valid: !thisField.errorMessage && thisField.dirty }
      )}
    >
      {dropdownType === "images" && (
        <Select
          styles={customStyles}
          value={thisField.valueObj}
          placeholder={null}
          className="multiselect"
          classNamePrefix="inner"
          components={{
            SingleValue: IconSingleValue,
            Option: IconOption,
            IndicatorSeparator: () => null,
          }}
          onChange={(selectedOption) =>
            setFieldValue({ field: name, value: selectedOption })
          }
          options={thisField.options}
        />
      )}
      {dropdownType !== "images" && (
        <Select
          value={thisField.valueObj}
          placeholder="Не выбрано"
          className="multiselect"
          classNamePrefix="inner"
          components={{
            IndicatorSeparator: () => null,
          }}
          onChange={(selectedOption) =>
            setFieldValue({ field: name, value: selectedOption })
          }
          options={thisField.options}
        />
      )}
      <label>
        {thisField.label}
        {required && <span className="required">*</span>}
      </label>
      <small
        className={classnames("error-label", {
          opened: thisField.errorMessage,
        })}
      >
        {thisField.errorMessage}
      </small>
    </div>
  )
}

export default SelectField
