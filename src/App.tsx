import "@assets/css/App.css"
import React, { useEffect } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"
import loadReCaptcha from "./components/app/forms/recaptcha/loadReCaptcha"
import { ToastContainer } from "react-toastify"
import { routes } from "@router/routes"
import { Helmet, HelmetProvider } from "react-helmet-async"
import GlobalWrapper from "@layouts/GlobalWrapper"
import { useSelector } from "react-redux"
import { isLogged } from "@store/slices/authSlice"
import { ConfirmContextProvider } from "@components/app/hooks/useConfirm"
import { ConfirmDialog } from "@components/app/ConfirmDialog"

function App() {
  const logged = useSelector(isLogged)

  useEffect(() => {
    //loadReCaptcha("6Ld8b-kaAAAAAKKyKxG3w3RW0hCxqBelwko_jTFZ")
    // eslint-disable-next-line
  }, [])

  return (
    <HelmetProvider>
      <Helmet />
      <BrowserRouter>
        <ConfirmContextProvider>
          <GlobalWrapper>
            <Routes location={window.location}>
              {routes
                .filter((item) => item.auth === false || item.auth === logged)
                .map(({ path, Component, subRoutes }) => (
                  <Route key={path} path={path} element={<Component />}>
                    {subRoutes.length > 0 && path === "/accounts" && (
                      <Route index element={<Navigate to={"accounts"} />} />
                    )}
                    {subRoutes.length > 0 &&
                      subRoutes.map(
                        ({
                          path: subPath,
                          Component: SubComponent,
                          subRoutes: subRoutes2,
                        }) => (
                          <Route
                            key={path + "-" + subPath}
                            path={subPath}
                            element={<SubComponent />}
                          />
                        )
                      )}
                  </Route>
                ))}
            </Routes>
          </GlobalWrapper>
          <ConfirmDialog />
        </ConfirmContextProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme={"colored"}
        />
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
