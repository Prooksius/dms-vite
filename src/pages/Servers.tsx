import React, { useEffect } from "react"
import { Loader } from "@components/app/Loader"
import { useDispatch, useSelector } from "react-redux"
import { toastAlert } from "@config"
import type { RootState } from "@store/store"
import MainLayout from "@layouts/MainLayout"
import { Navigate } from "react-router-dom"
import { ServersList } from "@components/servers/ServersList"

const PAGE_TITLE = "Серверы"

const Servers: React.FC = () => {
  return (
    <MainLayout title={PAGE_TITLE} h1={PAGE_TITLE}>
      <div className="page-contents">
        <ServersList />
      </div>
    </MainLayout>
  )
}

export default Servers
