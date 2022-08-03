import React, {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { FieldData, MyFormData, FormField } from "./types"
import { createSlot } from "react-slotify"
import classnames from "classnames"
import { Loader } from "@components/app/Loader"
import { FormWrapperContext } from "./formWrapperContext"
import ReCaptcha from "../recaptcha/ReCaptcha"
import { Success } from "@components/app/icons/Success"

export const HeaderSlot = createSlot()
export const FooterSlot = createSlot()
export const PrivacySlot = createSlot()

interface FormWrapperProps {
  children: ReactNode
  title: string
  formBtnText: string
  formCallback: (token: string, form: MyFormData) => void
  goFurther: () => void
  formData: MyFormData
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  title,
  formBtnText,
  formCallback,
  goFurther,
  formData,
}): ReactElement => {
  const sitekey = "111111111111111111111111111111111"
  const { form, setForm, checkForm } = useContext(FormWrapperContext)

  const [submitStatus, setSubmitStatus] = useState("IDLE")
  const [formMessage, setFormMessage] = useState("")
  const [recaptcha, setRecaptcha] = useState(null)

  const isFormValid = () =>
    Object.entries(form.fields).every(
      ([key, value]: FormField) => value.errorMessage === ""
    )

  const formValidate = async (event: React.FormEvent) => {
    event.preventDefault()

    setSubmitStatus("IDLE")
    setFormMessage("")

    checkForm()

    if (isFormValid()) {
      const token = await recaptcha.execute()
      submitForm(token)
    } else {
      setSubmitStatus("ERROR")
      setFormMessage("Форма имеет ошибки")
    }
  }
  const submitForm = async (token: string) => {
    console.log("FormWrapper - doSubmit")
    try {
      setSubmitStatus("PENDING")
      formCallback(token, form)
      setSubmitStatus("OK")
      if (goFurther) goFurther()
      setTimeout(() => {
        setSubmitStatus("IDLE")
      }, 1000)
    } catch (err) {
      setSubmitStatus("ERROR")
      setFormMessage(err.message)
      console.error(err)
    }
  }

  useEffect(() => {
    setForm(formData)
    return () => setForm({})
    // eslint-disable-next-line
  }, [])

  return (
    <form onSubmit={formValidate}>
      <HeaderSlot.Renderer childs={children}>
        {title !== "" && <h3>{title}</h3>}
      </HeaderSlot.Renderer>
      {children}
      <ReCaptcha
        ref={(ref) => setRecaptcha(ref)}
        sitekey={sitekey}
        action=""
        verifyCallback={null}
      />
      {submitStatus !== "IDLE" && (
        <p
          className={classnames("message", {
            success: submitStatus === "OK",
            error: submitStatus === "ERROR",
          })}
        >
          {formMessage}
        </p>
      )}
      <FooterSlot.Renderer childs={children}>
        <button
          type="submit"
          className={classnames("btn btn-blue", {
            pending: submitStatus === "PENDING",
            success: submitStatus === "OK",
          })}
          disabled={submitStatus === "PENDING"}
        >
          {submitStatus === "PENDING" && <Loader />}
          {submitStatus === "OK" && <Success />}
          <span>{formBtnText}</span>
        </button>
      </FooterSlot.Renderer>
      <PrivacySlot.Renderer childs={children} />
    </form>
  )
}

export default FormWrapper
