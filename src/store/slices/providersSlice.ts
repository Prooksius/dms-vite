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
  status: StatusType
  editStatus: string
  loaded: boolean
  error: string | null
  search: string
  filterChanges: number
}

// load options using API call
export const loadProviderOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: ProvidersShortRecord[] = []
  try {
    const response = await axiosInstance.get<
      ServerGetResponse<ProvidersShortRecord>
    >(
      `/providers/getNames?offset=${
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
  "/providers/fetchPage",
  async (_, { getState }) => {
    const { providers } = <RootState>getState()

    console.log("providers", providers)

    const response = await axiosInstance.get<
      ServerGetResponse<ProvidersRecord>
    >(
      `/providers/?offset=${
        (providers.page - 1) * providers.itemsInPage
      }&limit=${providers.itemsInPage}&name=${providers.search}`
    )

    console.log("providers response.data", response.data)
    return response.data
  }
)

const initialState: ProvidersState = {
  list: [],
  page: 1,
  itemsInPage: 10,
  itemsCount: 0,
  status: "idle",
  editStatus: "idle",
  loaded: false,
  error: null,
  search: "",
  filterChanges: 0,
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
        toastAlert(
          "Ошибка чтения провайдеров: " + action.error.message,
          "error"
        )
      })
  },
})

// Action creators are generated for each case reducer function
export const { setSearch, setPage, setItemsInPage, reloadPage } =
  providersSlice.actions

export default providersSlice.reducer

export const listItems = (state: RootState) => state.providers.list
export const listStatus = (state: RootState) => state.providers.status
export const listLoaded = (state: RootState) => state.providers.loaded
export const listPage = (state: RootState) => state.providers.page
export const listItemsInPage = (state: RootState) => state.providers.itemsInPage
export const listItemsCount = (state: RootState) => state.providers.itemsCount
export const listSearch = (state: RootState) => state.providers.search
export const listFilterChanges = (state: RootState) =>
  state.providers.filterChanges
export const selectItemById = (state: RootState, id: number) => {
  return state.providers.list.find((item: ProvidersRecord) => item.id === id)
}
