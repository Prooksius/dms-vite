import React from "react"
import MainLayout from "@layouts/MainLayout"

const PAGE_TITLE = "Офферы"

const Offers: React.FC = () => {
  return (
    <MainLayout title={PAGE_TITLE} h1={PAGE_TITLE}>
      <div className="page-contents">Здесь будут Офферы</div>
    </MainLayout>
  )
}

export default Offers
