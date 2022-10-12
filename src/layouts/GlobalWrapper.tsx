import React, { ReactChildren, ReactElement, ReactNode, useEffect } from "react"
import { useSearchParams, useNavigate, Navigate } from "react-router-dom"
import MainLayout from "@layouts/MainLayout"
import { useDispatch, useSelector } from "react-redux"
import { checkToken, isLogged, listAuthStatus } from "@store/slices/authSlice"
import {
  listFilterChanges as listProvidersFilterChanges,
  fetchPage as fetchProvidersPage,
} from "@store/slices/providersSlice"
import {
  fetchServersPage,
  listServersFilterChanges,
} from "@store/slices/serversSlice"
import {
  fetchDomainPage,
  fetchDomainAll,
  listDomainsFilterChanges,
} from "@store/slices/domainsSlice"
import {
  listFilterChanges as listErrorsFilterChanges,
  fetchPage as fetchErrorsPage,
} from "@store/slices/errorsSlice"
import {
  listEmailsFilterChanges,
  fetchEmailsPage,
} from "@store/slices/emailsSlice"
import {
  listRegistratorsFilterChanges,
  fetchRegistratorsPage,
} from "@store/slices/registratorsSlice"

const PAGE_TITLE = "Вход"

const GlobalWrapper: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const providersFilterChanges = useSelector(listProvidersFilterChanges)
  const serversFilterChanges = useSelector(listServersFilterChanges)
  const domainsFilterChanges = useSelector(listDomainsFilterChanges)
  const errorsFilterChanges = useSelector(listErrorsFilterChanges)
  const emailsFilterChanges = useSelector(listEmailsFilterChanges)
  const registratorsFilterChanges = useSelector(listRegistratorsFilterChanges)

  const [searchParams, setSearchParams] = useSearchParams()
  const newToken = searchParams.get("token")
  if (newToken) {
    localStorage.setItem("token", newToken)
  }

  const token = localStorage.getItem("token")

  const logged = useSelector(isLogged)
  const loggedStatus = useSelector(listAuthStatus)

  const goToLogin = () => {
    window.location.href = process.env.REACT_APP_SSO_URL
    //window.location.href = "https://sso.seoreserved.ru/auth?service=dms_local"
  }

  useEffect(() => {
    if (token) {
      dispatch(checkToken())
    } else {
      navigate("/")
    }
    // eslint-disable-next-line
  }, [token])

  useEffect(() => {
    if (providersFilterChanges) dispatch(fetchProvidersPage())
    // eslint-disable-next-line
  }, [providersFilterChanges])

  useEffect(() => {
    if (serversFilterChanges) dispatch(fetchServersPage())
    // eslint-disable-next-line
  }, [serversFilterChanges])

  useEffect(() => {
    if (domainsFilterChanges) {
      dispatch(fetchDomainPage())
      dispatch(fetchDomainAll())
    }
    // eslint-disable-next-line
  }, [domainsFilterChanges])

  useEffect(() => {
    if (errorsFilterChanges) dispatch(fetchErrorsPage())
    // eslint-disable-next-line
  }, [errorsFilterChanges])

  useEffect(() => {
    if (emailsFilterChanges) dispatch(fetchEmailsPage())
    // eslint-disable-next-line
  }, [emailsFilterChanges])

  useEffect(() => {
    if (registratorsFilterChanges) dispatch(fetchRegistratorsPage())
    // eslint-disable-next-line
  }, [registratorsFilterChanges])

  return (
    <>
      {logged && children}
      {!logged && (
        <MainLayout title={PAGE_TITLE} h1={PAGE_TITLE}>
          <div className="page-contents">
            {loggedStatus === "loading" && <h3>Авторизация...</h3>}
            {((loggedStatus !== "loading" && !token) ||
              (loggedStatus === "failed" && token)) && (
              <>
                <h3>Вы не авторизованы</h3>
                <br />
                <button
                  type="button"
                  className="btn btn-blue"
                  onClick={() => goToLogin()}
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </MainLayout>
      )}
    </>
  )
}

export default GlobalWrapper
