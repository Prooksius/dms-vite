import React from "react"
import MainLayout from "@layouts/MainLayout"
import { DomainsList } from "@components/domains/DomainsList"

const PAGE_TITLE = "Домены"

const Domains: React.FC = () => {
  return (
    <MainLayout title={PAGE_TITLE} h1={PAGE_TITLE}>
      <div className="page-contents">
        <DomainsList />
      </div>
    </MainLayout>
  )
}

export default Domains
