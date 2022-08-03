import React, { useState, useContext } from "react"
import classnames from "classnames"
import { FormWrapperContext } from "../formWrapper/formWrapperContext"
import { PlusIcon } from "@components/app/icons/PlusIcon"
import { DeleteIcon } from "@components/app/icons/DeleteIcon"
import { Subdomain, SubdomainType } from "../formWrapper/types"
import { getNewID } from "@config"

interface SubdomainsFieldProps {
  name: string
  domainName: string
}

const typesArr: SubdomainType[] = ["A", "CNAME"]

const SubdomainsField: React.FC<SubdomainsFieldProps> = ({
  name,
  domainName,
}) => {
  const [fieldFocused, setFieldFocused] = useState(false)
  const { form, setFieldValue } = useContext(FormWrapperContext)

  const newID = getNewID("subdomain-field")

  const thisField = form.fields[name]
  const domain = form.fields[domainName].value

  if (!thisField) {
    return (
      <div className="form-field">
        {name} - Поле не найдено в списке полей формы
      </div>
    )
  }

  const required = thisField.validations.required || false

  return (
    <div
      className={classnames(
        "form-field",
        "form-group",
        "form-array-field",
        { noLabel: thisField.label === "" },
        { focused: fieldFocused },
        { hasValue: thisField.valueArr.length },
        { invalid: thisField.errorMessage },
        { valid: !thisField.errorMessage && thisField.dirty }
      )}
    >
      <div className="form-field form-fild-subdomain-container">
        {thisField.valueArr.map((value: Subdomain, index) => (
          <div className="form-fild-subdomain-item" key={name + "-" + index}>
            <div
              className={classnames(
                "form-field",
                "form-fild-array-item",
                { "subdomain-array-item": !value.id },
                { "subdomain-edit-array-item": value.id }
              )}
            >
              <input
                type="text"
                autoComplete="off"
                value={value.title || ""}
                placeholder="Не выбрано"
                onFocus={() => setFieldFocused(true)}
                onBlur={() => setFieldFocused(false)}
                onChange={(e) =>
                  setFieldValue({
                    field: name,
                    value: {
                      title: e.target.value,
                      value: value.value,
                      type: value.type || "",
                      available_check: value.available_check,
                    },
                    index,
                  })
                }
              />
              <button
                type="button"
                className="btn btn-simple btn-simple-big btn-group-right btn-red"
                onClick={() => setFieldValue({ field: name, index })}
              >
                <DeleteIcon />
              </button>
              {domain && !value.id && (
                <span className="domain-name">.{domain}</span>
              )}
            </div>
            <div className="radio-field">
              {typesArr.map((typeItem) => (
                <div key={newID + "-" + typeItem} className="radio inline">
                  <div className="radio-inner">
                    <input
                      id={newID + "-" + typeItem}
                      type="radio"
                      checked={value.type === typeItem}
                      onChange={() =>
                        setFieldValue({
                          field: name,
                          value: {
                            title: value.title,
                            value: value.value,
                            type: typeItem,
                            available_check: value.available_check,
                          },
                          index,
                        })
                      }
                    />
                    <i></i>
                  </div>
                  <label htmlFor={newID + "-" + typeItem}>{typeItem}</label>
                </div>
              ))}
            </div>
            <div className="form-field">
              <input
                type="text"
                autoComplete="off"
                placeholder="Не выбрано"
                value={value.value || ""}
                onFocus={() => setFieldFocused(true)}
                onBlur={() => setFieldFocused(false)}
                onChange={(e) =>
                  setFieldValue({
                    field: name,
                    value: {
                      title: value.title,
                      value: e.target.value,
                      type: value.type || "",
                      available_check: value.available_check,
                    },
                    index,
                  })
                }
              />
            </div>
            <div className="checkbox">
              <div className="checkbox-inner">
                <input
                  id={newID + "-" + index}
                  type="checkbox"
                  checked={value.available_check}
                  onChange={(e) =>
                    setFieldValue({
                      field: name,
                      value: {
                        title: value.title,
                        value: value.value,
                        type: value.type || "",
                        available_check: e.target.checked,
                      },
                      index,
                    })
                  }
                />
                <i></i>
              </div>
              <label htmlFor={newID + "-" + index}>Проверка доступности</label>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-simple btn-simple-big btn-simple-border"
        onClick={() =>
          setFieldValue({
            field: name,
            value: {
              title: "",
              value: "",
              type: "A",
              available_check: false,
            },
            index: thisField.valueArr.length,
          })
        }
      >
        <PlusIcon />
      </button>
      <small
        className={classnames("error-label", {
          opened: thisField.errorMessage,
        })}
      >
        {thisField.errorMessage}
      </small>
      {thisField.label && (
        <label>
          {thisField.label}
          {required && <span className="required">*</span>}
        </label>
      )}
    </div>
  )
}

export default SubdomainsField
