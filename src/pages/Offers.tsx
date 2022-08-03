import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import MainLayout from "@layouts/MainLayout"
import { NavLink, Outlet } from "react-router-dom"
//import { OffersList } from "@components/providers/OffersList"

const PAGE_TITLE = "Офферы"

const Offers: React.FC = () => {
  return (
    <MainLayout title={PAGE_TITLE} h1={PAGE_TITLE}>
      <div className="page-contents">Здесь будут Офферы</div>
    </MainLayout>
  )
}

export default Offers
