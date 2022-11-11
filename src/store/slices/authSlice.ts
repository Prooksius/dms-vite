import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  StatusType,
  ValidationErrors,
} from "@components/app/forms/formWrapper/types"
import { axiosSimpleInstance } from "../axiosInstance"
import type { RootState } from "@store/index"
import { AxiosError } from "axios"
import { toastAlert } from "@config"

interface AuthState {
  logged: boolean
  status: StatusType
  error: string | null
}

export const checkToken = createAsyncThunk(
  "/auth/checkToken",
  async (_, { rejectWithValue }) => {
    const oldTtoken = localStorage.getItem("token")
    try {
      const response = await axiosSimpleInstance.get(
        `/token/?token=${oldTtoken}`
      )
      console.log("response", response)
      return response.data
    } catch (err) {
      const error: AxiosError<ValidationErrors> = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState: AuthState = {
  logged: false,
  status: "idle",
  error: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = "failed"
      state.logged = false
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkToken.pending, (state) => {
        state.status = "loading"
        state.logged = false
      })
      .addCase(checkToken.fulfilled, (state) => {
        state.status = "succeeded"
        state.logged = true
      })
      .addCase(checkToken.rejected, (state) => {
        state.status = "failed"
        state.logged = false
        toastAlert("Ошибка авторизации", "error")
      })
  },
})

// Action creators are generated for each case reducer function
export const { logout } = authSlice.actions

export default authSlice.reducer

export const isLogged = (state: RootState) => state.auth.logged
export const listAuthStatus = (state: RootState) => state.auth.status
