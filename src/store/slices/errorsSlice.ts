import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toastAlert } from "@config"
import { axiosInstance, axiosFakeInstance } from "@store/axiosInstance"
import {
  StatusType,
  OptionsObject,
  Additional,
} from "@components/app/forms/formWrapper/types"
import { RootState } from "@store/index"
import type { ServerGetResponse } from "@store/index"

export type EntityType =
  | "all"
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
  department_name: string
  registrator_id: number
  server_id: number
  provider_id: number
  integration_cloudflare_status: boolean
  integration_registrator_status: boolean
  ns: string[]
  whois_status: boolean
  whois_condition: string
  available_status: boolean
  available_condition?: string
  rkn_status: boolean
  rkn_condition?: string
  ssl_status: boolean
  ssl_condition?: string
  pagespeed_status: boolean
  pagespeed_condition?: string
  geo_status: string[]
  geo_condition: []
  expirationtime_status: boolean
  monitoring_id: number
  registration_date?: string
  expirationtime_condition: string
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
  editStatus: string
  loaded: boolean
  error: string | null
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
    const response = await axiosInstance.get<
      ServerGetResponse<ErrorsShortRecord>
    >(
      `/errors/getNames?offset=${
        (page - 1) * 10
      }&limit=10&partial=true&name=${inputValue}`
    )

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
  async (_, { getState }) => {
    const { errors } = <RootState>getState()

    console.log("errors", errors)

    const response = await axiosInstance.get<ServerGetResponse<ErrorsRecord>>(
      `/errors/?offset=${(errors.page - 1) * errors.itemsInPage}&limit=${
        errors.itemsInPage
      }&entity_type=${errors.filter.entity_type}&created_at=${
        errors.filter.created_at ? errors.filter.created_at : ""
      }&deleted_at=${errors.filter.deleted_at ? errors.filter.deleted_at : ""}`
    )
    /*
    const response = await axiosFakeInstance.get(
      `/errors/?_page=${errors.page}&_limit=${
        errors.itemsInPage
      }`
    )
    */

    console.log("errors response.data", response.data)
    return response.data
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
  error: null,
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
      })
      .addCase(fetchPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((error) => ({
          ...error,
          record_open: false,
        }))
        state.itemsCount = payload.count
        state.status = "succeeded"
        state.loaded = true
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.list = []
        state.itemsCount = 0
        state.status = "failed"
        state.error = action.error.message
        toastAlert("Ошибка чтения ошибок: " + action.error.message, "error")
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
