import { REACT_APP_DB_URL } from "@config"
import axios from "axios"

const token = localStorage.getItem("token")

export const axiosInstance = axios.create({
  baseURL: REACT_APP_DB_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  return {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  }
})

export const axiosFakeInstance = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
})

axiosFakeInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  return {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  }
})

export const axiosSimpleInstance = axios.create({
  baseURL: REACT_APP_DB_URL,
})
