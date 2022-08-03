import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import MainLayout from "@layouts/MainLayout"
import { NavLink, Outlet } from "react-router-dom"
import { EmailsList } from "@components/emails/EmailsList"

const PAGE_TITLE = "Почты"

const Emails: React.FC = () => {
  return <div className="subpage-contents">
    <EmailsList />
  </div>
}

export default Emails
