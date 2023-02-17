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
}

const createOption = (label: string) => ({
  label,
  value: label,
})

const TagsField: React.FC<TagsFieldProps> = ({ name }) => {
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const thisField = form.fields[name]

  const [inputValue, setInputValue] = useState("")

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    console.log("keydown")
    if (!inputValue) return
    switch (event.key) {
      case "Tab":
        thisField.valueArr.map((option, index) => {
          setFieldValue({
            field: name,
            value: {
              value: option.value,
              label: option.value,
              checked: true,
            },
            index,
          })
        })
        setFieldValue({
          field: name,
          value: {
            value: inputValue,
            label: inputValue,
            checked: true,
          },
          index: thisField.valueArr.length,
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
        value={thisField.valueArr}
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
        onChange={(options) => {
          setFieldValue({ field: name }) // удаляем все теги
          if (options.length) {
            options.map((selValue, index) => {
              console.log("insert value " + selValue.value)
              setFieldValue({
                field: name,
                value: {
                  value: selValue.value,
                  label: selValue.value,
                  checked: true,
                },
                index,
              })
            })
          }
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
