import React from "react"
import MainLayout from "@layouts/MainLayout"
import { ErrorsList } from "@components/errors/ErrorsList"

const PAGE_TITLE = "Ошибки"

const Errors: React.FC = () => {
  return (
    <MainLayout title={PAGE_TITLE} h1={PAGE_TITLE}>
      <div className="page-contents">
        <ErrorsList />
      </div>
    </MainLayout>
  )
}

export default Errors
