import React from "react"
import MainLayout from "@layouts/MainLayout"
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
