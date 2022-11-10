import React from "react"
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
