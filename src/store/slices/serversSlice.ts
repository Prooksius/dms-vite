import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { errorToastText, toastAlert } from "@config"
import { axiosInstance, axiosFakeInstance } from "@store/axiosInstance"
import { RootState } from "@store/store"
import type { ServerGetResponse } from "@store/index"
import {
  FieldData,
  FieldsData,
  MyFormData,
  SelectValue,
  StatusType,
  OptionsObject,
  Additional,
  IPAddr,
  ErrorPayloadData,
  ValidationErrors,
} from "@components/app/forms/formWrapper/types"
import { AxiosError } from "axios"

export interface ServersRecord {
  id?: number
  created_at?: string
  deleted_at?: string
  name: string
  department_name: string
  ip_addr: IPAddr[]
  provider_id: number
  registrator_id: number
  login_link_cp: string
  web_panel: string
  registrator_login: string
  registrator_name: string
  provider_name: string
  record_open?: boolean
  popup_open?: boolean
}

export interface ServersShortRecord {
  id?: number
  name: string
}

export interface ServerIPRecord {
  id: number
  ip_addr: string
}

interface ServersFilter
  extends Record<string, string | number | boolean | SelectValue> {
  department_name: SelectValue
  provider_id: SelectValue
  registrator_id: SelectValue
  active: SelectValue
}

interface ServersState {
  list: ServersRecord[]
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
  filter: ServersFilter
  filterChanges: number
  selectedIds: number[]
}

type ServerEditRecord = {
  created_at: string
  deleted_at: string | null
  name: string
  department_name: string
  ip_addr: string[]
  registrator_id: number
  login_link_cp: string
  web_panel: string
}

const fillServerRecord = ({ fields }: MyFormData): ServerEditRecord => {
  const bodyData: ServerEditRecord = {
    created_at: new Date().toISOString(),
    deleted_at: null,
    name: fields.name.value,
    department_name: fields.department_name.valueObj.value,
    registrator_id: Number(fields.registrator_id.valueObj.value),
    login_link_cp: fields.login_link_cp.value,
    web_panel: fields.web_panel.value,
    ip_addr: fields.ip_addr.valueArr.map((item) => item.value),
  }

  return bodyData
}

// load options using API call
export const loadServerOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: ServersShortRecord[] = []
  try {
    // get запрос для получения имен
    const query = new URLSearchParams({
      offset: String((page - 1) * 10),
      limit: "10",
      name: inputValue,
      partial: "true",
    }).toString()

    const response = await axiosInstance.get<
      ServerGetResponse<ServersShortRecord>
    >(`/servers/getNames?${query}`)

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

export const getServerIPs = async (param: any): Promise<SelectValue[]> => {
  if (!param) return [{ value: "", label: "Не выбрано" }]

  let items: SelectValue[] = []
  try {
    const query = new URLSearchParams({
      offset: "0",
      limit: "99999999999",
      partial: "true",
    }).toString()

    const response = await axiosInstance.get<ServerGetResponse<ServerIPRecord>>(
      `/servers/getIps/${String(param)}?${query}`
    )

    console.log("response.data", response.data)
    items = response.data.data
      ? response.data.data.map((item) => ({
          value: String(item.id),
          label: item.ip_addr,
        }))
      : []
  } catch (e) {
    items = []
  }
  items.unshift({ value: "", label: "Не выбрано" })
  return items
}

export const fetchServersPage = createAsyncThunk(
  "/servers/fetchServersPage",
  async (params, { getState, rejectWithValue }) => {
    const { servers } = <RootState>getState()

    const queryObj: Record<string, string> = {
      offset: String((servers.page - 1) * servers.itemsInPage),
      limit: String(servers.itemsInPage),
      sort: servers.sort ? servers.sort : "-created_at",
      name: servers.search,
      provider_id: servers.filter.provider_id?.value
        ? servers.filter.provider_id.value
        : "",
      registrator_id: servers.filter.registrator_id?.value
        ? servers.filter.registrator_id.value
        : "",
      department_name: servers.filter.department_name?.value
        ? servers.filter.department_name.value
        : "",
    }
    if (servers.filter.active?.value) {
      queryObj.active = servers.filter.active.value === "1" ? "true" : "false"
    }
    const query = new URLSearchParams(queryObj).toString()

    try {
      const response = await axiosInstance.get<
        ServerGetResponse<ServersRecord>
      >(`/servers/?${query}`)

      console.log("response.data", response.data)
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

export const addServer = createAsyncThunk(
  "servers/addServer",
  async ({ fields }: MyFormData, { rejectWithValue }) => {
    const bodyData = fillServerRecord({ fields })
    try {
      const response = await axiosInstance.post("/servers", bodyData)
      console.log("add server response.data", response.data)
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

export const editServer = createAsyncThunk(
  "servers/editServer",
  async (
    { form, record }: { form: MyFormData; record: ServersRecord },
    { rejectWithValue }
  ) => {
    const bodyData = fillServerRecord(form)
    bodyData.created_at = record.created_at
    bodyData.deleted_at = record.deleted_at

    try {
      const response = await axiosInstance.put(`/servers/${form.id}`, bodyData)
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

export const deleteServer = createAsyncThunk(
  "servers/deleteServer",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/servers/${id}`)
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

export const archiveServer = createAsyncThunk(
  "servers/archiveServer",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/servers/${id}/delete`, {})
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

const initialState: ServersState = {
  list: [],
  page: 1,
  itemsInPage: 10,
  itemsCount: 0,
  sort: "-created_at",
  status: "idle",
  editStatus: "idle",
  loaded: false,
  error: "",
  errorData: null,
  search: "",
  filter: {
    department_name: null,
    provider_id: null,
    registrator_id: null,
    active: null,
  },
  filterChanges: 0,
  selectedIds: [],
}

export const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    setFilter: (state, { payload }: PayloadAction<FieldsData>) => {
      Object.keys(payload).map((key) => {
        state.filter[key] =
          payload[key].type === "select"
            ? payload[key].valueObj
            : payload[key].value
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
      const sort = payload ? payload : "-created_at"
      if (state.sort !== sort) {
        state.page = initialState.page
        state.filterChanges++
      }
      state.sort = sort
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
    toggleServerOpen: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.record_open = !found.record_open
    },
    toggleServerPopup: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.popup_open = !found.popup_open
    },
    closeServerPopups: (state) => {
      state.list.map((item) => {
        item.popup_open = false
      })
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchServersPage.pending, (state) => {
        state.status = "loading"
        state.editStatus = "idle"
        state.error = ""
        state.errorData = null
      })
      .addCase(fetchServersPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((server) => ({
          ...server,
          record_open: false,
          popup_open: false,
        }))
        state.itemsCount = payload.count
        state.status = "succeeded"
        state.editStatus = "idle"
        state.error = ""
        state.errorData = null
        state.loaded = true
      })
      .addCase(fetchServersPage.rejected, (state, action) => {
        state.status = "failed"
        state.editStatus = "idle"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка чтения серверов: " + state.error, "error")
      })
      .addCase(addServer.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
      })
      .addCase(
        addServer.fulfilled,
        (state, { payload }: PayloadAction<ServersRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Сервер успешно добавлен", "success")
        }
      )
      .addCase(addServer.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка добавления сервера: " + state.error, "error")
      })
      .addCase(editServer.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
      })
      .addCase(
        editServer.fulfilled,
        (state, { payload }: PayloadAction<ServersRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Сервер успешно изменен", "success")
        }
      )
      .addCase(editServer.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка изменения сервера: " + state.error, "error")
      })
      .addCase(archiveServer.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        state.filterChanges++
        toastAlert("Сервер успешно архивирован", "success")
      })
      .addCase(archiveServer.rejected, (state, action) => {
        toastAlert(
          "Ошибка архивирования сервера: " +
            (action.payload
              ? errorToastText(action.payload as ErrorPayloadData)
              : action.error.message),
          "error"
        )
      })
      .addCase(deleteServer.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        state.filterChanges++
        toastAlert("Сервер успешно удален", "success")
      })
      .addCase(deleteServer.rejected, (state, action) => {
        toastAlert(
          "Ошибка удаления сервера: " +
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
  setFilter,
  setSearch,
  setPage,
  setSort,
  setSelected,
  setItemsInPage,
  toggleServerOpen,
  toggleServerPopup,
  closeServerPopups,
  reloadPage,
} = serversSlice.actions

export default serversSlice.reducer

export const listServers = (state: RootState) => state.servers.list
export const listServersStatus = (state: RootState) => state.servers.status
export const listServersEditStatus = (state: RootState) =>
  state.servers.editStatus
export const listServersLoaded = (state: RootState) => state.servers.loaded
export const listServersPage = (state: RootState) => state.servers.page
export const listServersSort = (state: RootState) => state.servers.sort
export const listServersSelectedIds = (state: RootState) =>
  state.servers.selectedIds
export const listServersItemsInPage = (state: RootState) =>
  state.servers.itemsInPage
export const listServersItemsCount = (state: RootState) =>
  state.servers.itemsCount
export const listServersFilter = (state: RootState) => state.servers.filter
export const listServersFilterChanges = (state: RootState) =>
  state.servers.filterChanges
export const listServersSearch = (state: RootState) => state.servers.search
export const listServersError = (state: RootState) => state.servers.error
export const listServersErrorData = (state: RootState) =>
  state.servers.errorData

export const selectServerById = (state: RootState, id: number) => {
  return state.servers.list.find((item) => item.id === id)
}
