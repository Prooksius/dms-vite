import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { errorToastText, toastAlert } from "@config"
import { axiosInstance, axiosFakeInstance } from "@store/axiosInstance"
import {
  StatusType,
  OptionsObject,
  Additional,
  MyFormData,
  ErrorPayloadData,
  ValidationErrors,
} from "@components/app/forms/formWrapper/types"
import { RootState } from "@store/index"
import type { ServerGetResponse } from "@store/index"
import { AxiosError } from "axios"

export type ProviderType =
  | "Provider"
  | "Black Order"
  | "Cloud Flare"
  | "Google Cloud"
  | "Reg-ru"
  | "Reg-way"
  | "Zomro"

export interface ProvidersRecord {
  id: number | null
  created_at: string
  deleted_at: string | null
  name: string
  url: string
  type: ProviderType
  record_open?: boolean
  popup_open?: boolean
}

export interface ProviderEditRecord {
  id: number | null
  created_at: string
  deleted_at: string | null
  name: string
  url: string
  type: ProviderType
  record_open?: boolean
  popup_open?: boolean
}

export interface ProvidersShortRecord {
  id: number | null
  name: string
}

interface ProvidersState {
  list: ProvidersRecord[]
  page: number
  itemsInPage: number
  itemsCount: number
  sort: string
  status: StatusType
  editStatus: StatusType
  loaded: boolean
  error: string
  errorData: ErrorPayloadData | null
  search: string
  filterChanges: number
  selectedIds: number[]
}

const fillProviderRecord = (fromData: MyFormData): ProviderEditRecord => {
  const fields = fromData.fields
  const bodyData: ProviderEditRecord = {
    id: fromData.id,
    created_at: new Date().toISOString(),
    deleted_at: null,
    name: fields.name.value,
    url: fields.url.value,
    type: "Provider",
  }

  return bodyData
}

// load options using API call
export const loadProviderOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: ProvidersShortRecord[] = []
  try {
    // get запрос для получения имен
    const query = new URLSearchParams({
      offset: String((page - 1) * 10),
      limit: "10",
      name: inputValue,
      partial: "true",
    }).toString()

    const response = await axiosInstance.get<
      ServerGetResponse<ProvidersShortRecord>
    >(`/providers/getNames?${query}`)

    console.log("response.data", response.data)
    items = response.data.data ? response.data.data : []
  } catch (e) {
    items = []
  }
  const newItems = items.map((item) => ({
    value: String(item.id),
    label: inputValue
      ? item.name.split(inputValue).join(`<b>${inputValue}</b>`)
      : item.name,
  }))
  if (page === 1) {
    newItems.unshift({ value: "", label: "Не выбрано" })
  }

  return {
    options: newItems,
    hasMore: items.length > 1,
    additional: {
      page: page + 1,
    },
  }
}

export const fetchPage = createAsyncThunk(
  "/providers/fetchPage",
  async (_, { getState, rejectWithValue }) => {
    const { providers } = <RootState>getState()

    //console.log("providers", providers)

    const query = new URLSearchParams({
      offset: String((providers.page - 1) * providers.itemsInPage),
      limit: String(providers.itemsInPage),
      name: providers.search,
    }).toString()

    try {
      const response = await axiosInstance.get<
        ServerGetResponse<ProvidersRecord>
      >(`/providers/?${query}`)

      console.log("providers response.data", response.data)
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

export const addProvider = createAsyncThunk(
  "providers/addProvider",
  async ({ fields }: MyFormData, { getState, rejectWithValue }) => {
    const bodyData = fillProviderRecord({ fields })
    try {
      const response = await axiosInstance.post("/providers/", bodyData)
      console.log("add provider response.data", response.data)
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

export const editProvider = createAsyncThunk(
  "providers/editProvider",
  async (
    { form, record }: { form: MyFormData; record: ProvidersRecord },
    { getState, rejectWithValue }
  ) => {
    console.log("form.name", form.fields.name.value)

    const bodyData = fillProviderRecord(form)
    bodyData.created_at = record.created_at
    bodyData.deleted_at = record.deleted_at
    try {
      const response = await axiosInstance.put(
        `/providers/${record.id}`,
        bodyData
      )
      console.log("edit provider response.data", response.data)
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

export const deleteProvider = createAsyncThunk(
  "providers/deleteProvider",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/providers/${id}`)
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

export const archiveProvider = createAsyncThunk(
  "providers/archiveProvider",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/providers/${id}/delete`, {})
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

const initialState: ProvidersState = {
  list: [],
  page: 1,
  itemsInPage: 10,
  itemsCount: 0,
  sort: "",
  status: "idle",
  editStatus: "idle",
  loaded: false,
  error: "",
  errorData: null,
  search: "",
  filterChanges: 0,
  selectedIds: [],
}

export const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    setPage: (state, { payload }: PayloadAction<number>) => {
      if (state.page !== payload) {
        state.filterChanges++
      }
      state.page = payload
    },
    setSelected: (state, { payload }: PayloadAction<number[]>) => {
      state.selectedIds = payload
    },
    setSort: (state, { payload }: PayloadAction<string>) => {
      if (state.sort !== payload) {
        state.page = initialState.page
        state.filterChanges++
      }
      state.sort = payload
    },
    setItemsInPage: (state, { payload }: PayloadAction<number>) => {
      if (state.itemsInPage !== payload) {
        state.filterChanges++
      }
      state.itemsInPage = payload
    },
    setSearch: (state, { payload }: PayloadAction<string>) => {
      if (state.search !== payload) {
        state.filterChanges++
      }
      state.search = payload
    },
    reloadPage: (state) => {
      state.filterChanges++
    },
    toggleProviderOpen: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.record_open = !found.record_open
    },
    toggleProviderPopup: (state, { payload }: PayloadAction<number>) => {
      console.log("payload", payload)
      const found = state.list.find((item) => item.id === payload)
      if (found) found.popup_open = !found.popup_open
    },
    closeProviderPopups: (state) => {
      state.list.map((item) => {
        item.popup_open = false
      })
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPage.pending, (state) => {
        state.status = "loading"
        state.editStatus = "idle"
        state.error = ""
        state.errorData = null
      })
      .addCase(fetchPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((provider) => ({
          ...provider,
          record_open: false,
        }))
        state.itemsCount = payload.count
        state.status = "succeeded"
        state.editStatus = "idle"
        state.error = ""
        state.errorData = null
        state.loaded = true
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.list = []
        state.itemsCount = 0
        state.status = "failed"
        state.editStatus = "idle"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка чтения провайдеров: " + state.error, "error")
      })
      .addCase(addProvider.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
      })
      .addCase(
        addProvider.fulfilled,
        (state, { payload }: PayloadAction<ProvidersRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Provider успешно добавлен", "success")
        }
      )
      .addCase(addProvider.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error =
          "Ошибка добавления провайдера: " +
          (action.payload
            ? errorToastText(action.payload as ErrorPayloadData)
            : action.error.message)
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
      })
      .addCase(editProvider.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
      })
      .addCase(
        editProvider.fulfilled,
        (state, { payload }: PayloadAction<ProvidersRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Provider успешно изменен", "success")
        }
      )
      .addCase(editProvider.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error =
          "Ошибка изменения провайдера: " +
          (action.payload
            ? errorToastText(action.payload as ErrorPayloadData)
            : action.error.message)
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
      })
      .addCase(archiveProvider.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        state.filterChanges++
        toastAlert("Provider успешно архивирован", "success")
      })
      .addCase(archiveProvider.rejected, (state, action) => {
        toastAlert(
          "Ошибка архивирования провайдера: " +
            (action.payload
              ? errorToastText(action.payload as ErrorPayloadData)
              : action.error.message),
          "error"
        )
      })
      .addCase(deleteProvider.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        state.filterChanges++
        toastAlert("Provider успешно удален", "success")
      })
      .addCase(deleteProvider.rejected, (state, action) => {
        toastAlert(
          "Ошибка удаления провайдера: " +
            (action.payload
              ? errorToastText(action.payload as ErrorPayloadData)
              : action.error.message),
          "error"
        )
      })
  },
})

// Action creators are generated for each case reducer function
export const {
  setSearch,
  setPage,
  setSort,
  setSelected,
  setItemsInPage,
  toggleProviderOpen,
  toggleProviderPopup,
  closeProviderPopups,
  reloadPage,
} = providersSlice.actions

export default providersSlice.reducer

export const listItems = (state: RootState) => state.providers.list
export const listStatus = (state: RootState) => state.providers.status
export const listEditStatus = (state: RootState) => state.providers.editStatus
export const listSort = (state: RootState) => state.providers.sort
export const listLoaded = (state: RootState) => state.providers.loaded
export const listPage = (state: RootState) => state.providers.page
export const listSelectedIds = (state: RootState) => state.providers.selectedIds
export const listItemsInPage = (state: RootState) => state.providers.itemsInPage
export const listItemsCount = (state: RootState) => state.providers.itemsCount
export const listSearch = (state: RootState) => state.providers.search
export const listError = (state: RootState) => state.providers.error
export const listErrorData = (state: RootState) => state.providers.errorData
export const listFilterChanges = (state: RootState) =>
  state.providers.filterChanges
export const selectItemById = (state: RootState, id: number) => {
  return state.providers.list.find((item: ProvidersRecord) => item.id === id)
}
