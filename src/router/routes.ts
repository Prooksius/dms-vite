import Home from "@pages/Home"
import About from "@pages/About"
import NotFound from "@pages/NotFound"
import Accounts from "@pages/Accounts"
import Domains from "@pages/Domains"
import Servers from "@pages/Servers"
import Errors from "@pages/Errors"
import AccountsPage from "@pages/AccountsPage"
import Emails from "@pages/Emails"
import Providers from "@pages/Providers"
import { UsersIcon } from "@components/app/icons/UsersIcon"
import { ServersIcon } from "@components/app/icons/ServersIcon"
import { DomainsIcon } from "@components/app/icons/DomainsIcon"
import { OfferLinksIcon } from "@components/app/icons/OfferLinksIcon"
import { ErrorsIcon } from "@components/app/icons/ErrorsIcon"
import { FC } from "react"
import Offers from "@pages/Offers"

interface RouteItem {
  path: string
  name: string
  Icon: FC | null
  Component: FC
  navShown: boolean
  auth: boolean
  subRoutes: RouteItem[]
}

export const routes: RouteItem[] = [
  {
    path: "/",
    name: "Вход",
    Icon: UsersIcon,
    Component: Home,
    navShown: true,
    auth: false,
    subRoutes: [],
  },
  {
    path: "/accounts",
    name: "Аккаунты",
    Icon: UsersIcon,
    Component: AccountsPage,
    navShown: true,
    auth: true,
    subRoutes: [
      {
        path: "accounts",
        name: "Аккаунты",
        Icon: UsersIcon,
        Component: Accounts,
        navShown: true,
        auth: true,
        subRoutes: [],
      },
      {
        path: "emails",
        name: "Emails",
        Icon: null,
        Component: Emails,
        navShown: false,
        auth: true,
        subRoutes: [],
      },
      {
        path: "providers",
        name: "Провайдеры",
        Icon: null,
        Component: Providers,
        navShown: false,
        auth: true,
        subRoutes: [],
      },
    ],
  },
  {
    path: "/servers",
    name: "Серверы",
    Icon: ServersIcon,
    Component: Servers,
    navShown: true,
    auth: true,
    subRoutes: [],
  },
  {
    path: "/domains",
    name: "Домены",
    Icon: DomainsIcon,
    Component: Domains,
    navShown: true,
    auth: true,
    subRoutes: [],
  },
  {
    path: "/offer-link",
    name: "Оффер-Link",
    Icon: OfferLinksIcon,
    Component: Offers,
    navShown: true,
    auth: true,
    subRoutes: [],
  },
  {
    path: "/errors",
    name: "Ошибки",
    Icon: ErrorsIcon,
    Component: Errors,
    navShown: true,
    auth: true,
    subRoutes: [],
  },
  {
    path: "*",
    name: "404",
    Icon: null,
    Component: NotFound,
    navShown: false,
    auth: false,
    subRoutes: [],
  },
]
