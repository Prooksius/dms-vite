import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { REACT_APP_DB_URL } from "@config"

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: REACT_APP_DB_URL }),
  reducerPath: "authApi",
  endpoints: (build) => ({
    checkToken: build.query<any, string>({
      query: (token) => `/token/?token=${token}`,
    }),
  }),
})

export const { useCheckTokenQuery } = authApi
