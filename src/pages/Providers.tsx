import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import MainLayout from "@layouts/MainLayout"
import { NavLink, Outlet } from "react-router-dom"
import { ProvidersList } from "@components/providers/ProvidersList"

const PAGE_TITLE = "Провайдеры"

const Providers: React.FC = () => {
  return (
    <div className="subpage-contents">
      <ProvidersList />
    </div>
  )
}

export default Providers
