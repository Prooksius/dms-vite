import React from "react"
import { EmailsList } from "@components/emails/EmailsList"

const PAGE_TITLE = "Почты"

const Emails: React.FC = () => {
  return <div className="subpage-contents">
    <EmailsList />
  </div>
}

export default Emails
