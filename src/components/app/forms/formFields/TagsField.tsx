import React, {
  KeyboardEventHandler,
  useContext,
  useEffect,
  useState,
} from "react"
import classnames from "classnames"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import CreatableSelect from "react-select/creatable"
import { FieldData, SelectValue } from "../formWrapper/types"

interface TagsFieldProps {
  name: string
  loadCallback?: (param: string) => Promise<SelectValue[]>
}

const createOption = (label: string) => ({
  label,
  value: label,
})

const TagsField: React.FC<TagsFieldProps> = ({ name, loadCallback = null }) => {
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const thisField = form.fields[name]

  const [options, setOptions] = useState(thisField.valueArr)
  const [inputValue, setInputValue] = useState("")

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return
    switch (event.key) {
      case "Tab":
        options.map((option, index) => {
          setFieldValue({
            field: name,
            value: {
              value: option.value,
              label: option.value,
            },
            index,
          })
        })
        setFieldValue({
          field: name,
          value: {
            value: inputValue,
            label: inputValue,
          },
          index: options.length,
        })
        setInputValue("")
        event.preventDefault()
    }
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
      <CreatableSelect
        value={options}
        inputValue={inputValue}
        placeholder="Тэги не добавлены"
        isClearable
        isMulti
        menuIsOpen={false}
        className="multiselect"
        classNamePrefix="inner"
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        onChange={(selectedOption) => {
          selectedOption.map((selValue, index) =>
            setFieldValue({
              field: name,
              value: {
                value: selValue.value,
                checked: true,
              },
              index,
            })
          )
        }}
      />
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

export default TagsField
