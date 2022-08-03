import { REACT_APP_DB_URL } from "@config"
import axios from "axios"

const token = localStorage.getItem("token")

export const axiosInstance = axios.create({
  baseURL: REACT_APP_DB_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
})

export const axiosFakeInstance = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
})

export const axiosSimpleInstance = axios.create({
  baseURL: REACT_APP_DB_URL,
})
