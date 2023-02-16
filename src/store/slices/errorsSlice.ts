import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { errorToastText, toastAlert } from "@config"
import { axiosInstance, axiosFakeInstance } from "@store/axiosInstance"
import {
  StatusType,
  OptionsObject,
  Additional,
  ValidationErrors,
  ErrorPayloadData,
} from "@components/app/forms/formWrapper/types"
import { RootState } from "@store/index"
import type { ServerGetResponse } from "@store/index"
import { AxiosError } from "axios"

export type EntityType =
  | "domain"
  | "subdomain"
  | "server"
  | "email"
  | "provider"
  | "registrator"

export interface ErrorsRecord {
  id: number | null
  created_at?: string
  deleted_at?: string
  name: string
  checker_name: string
  checker_result: string
  last_updated: string
  status: string
  delayed_to: string
  error_duration: string
  ip_addr?: string
  record_open?: boolean
}

export interface ErrorsShortRecord {
  id: number | null
  name: string
}

interface ErrorsFilter extends Record<string, string | EntityType> {
  created_at?: string
  deleted_at?: string
  entity_type: EntityType
}

interface ErrorsPayloadFilter extends Record<string, string | EntityType> {
  created_at?: string
  deleted_at?: string
  entity_type?: EntityType
}

interface ErrorsState {
  list: ErrorsRecord[]
  page: number
  itemsInPage: number
  itemsCount: number
  sort: string
  status: StatusType
  editStatus: StatusType
  loaded: boolean
  error: string
  search: string
  filter: ErrorsFilter
  filterChanges: number
  selectedIds: number[]
}

// load options using API call
export const loadErrorOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: ErrorsShortRecord[] = []
  try {
    // get запрос для получения имен
    const query = new URLSearchParams({
      offset: String((page - 1) * 10),
      limit: "10",
      name: inputValue,
      partial: "true",
    }).toString()

    const response = await axiosInstance.get<
      ServerGetResponse<ErrorsShortRecord>
    >(`/errors/getNames?${query}`)

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
  "/errors/fetchErrorPage",
  async (_, { getState, rejectWithValue }) => {
    const { errors } = <RootState>getState()

    const query = new URLSearchParams({
      offset: String((errors.page - 1) * errors.itemsInPage),
      limit: String(errors.itemsInPage),
    }).toString()

    try {
      const response = await axiosInstance.get<ServerGetResponse<ErrorsRecord>>(
        `/errors/${errors.filter.entity_type}/?${query}`
      )

      console.log("errors response.data", response.data)
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

const initialState: ErrorsState = {
  list: [],
  page: 1,
  itemsInPage: 10,
  itemsCount: 0,
  sort: "",
  status: "idle",
  editStatus: "idle",
  loaded: false,
  error: "",
  search: "",
  filter: {
    created_at: null,
    deleted_at: null,
    entity_type: "domain",
  },
  filterChanges: 0,
  selectedIds: [],
}

export const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setFilter: (state, { payload }: PayloadAction<ErrorsPayloadFilter>) => {
      Object.keys(payload).map((key) => {
        state.filter[key] = payload[key]
      })
      state.filterChanges++
    },
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
    toggleOpen: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) {
        found.record_open = !found.record_open
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPage.pending, (state) => {
        state.status = "loading"
        state.editStatus = "idle"
      })
      .addCase(fetchPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((error) => ({
          ...error,
          record_open: false,
        }))
        state.itemsCount = payload.count
        state.status = "succeeded"
        state.editStatus = "idle"
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
        console.log("action.payload", action.payload)
        toastAlert("Ошибка чтения ошибок: " + state.error, "error")
      })
  },
})

// Action creators are generated for each case reducer function
export const {
  setFilter,
  setSearch,
  setPage,
  setSort,
  setSelected,
  setItemsInPage,
  toggleOpen,
  reloadPage,
} = errorsSlice.actions

export default errorsSlice.reducer

export const listItems = (state: RootState) => state.errors.list
export const listStatus = (state: RootState) => state.errors.status
export const listLoaded = (state: RootState) => state.errors.loaded
export const listPage = (state: RootState) => state.errors.page
export const listError = (state: RootState) => state.errors.error
export const listSort = (state: RootState) => state.errors.sort
export const listSelectedIds = (state: RootState) => state.errors.selectedIds
export const listItemsInPage = (state: RootState) => state.errors.itemsInPage
export const listItemsCount = (state: RootState) => state.errors.itemsCount
export const listFilter = (state: RootState) => state.errors.filter
export const listFilterChanges = (state: RootState) =>
  state.errors.filterChanges

export const selectItemById = (state: RootState, id: number) => {
  return state.errors.list.find((error: ErrorsRecord) => error.id === id)
}
