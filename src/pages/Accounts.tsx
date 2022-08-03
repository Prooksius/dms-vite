import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RegistratorsList } from "@components/registrators/RegistratorsList"

const PAGE_TITLE = "Аккаунты"

const Accounts: React.FC = () => {
  return (
    <div className="subpage-contents">
      <RegistratorsList />
    </div>
  )
}

export default Accounts
