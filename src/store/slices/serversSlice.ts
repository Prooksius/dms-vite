import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { toastAlert } from "@config"
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
} from "@components/app/forms/formWrapper/types"

type ServerStatus = "up" | "down"

export interface ServersRecord {
  id?: number
  created_at?: string
  deleted_at?: string
  name: string
  department_name: string
  ip_addr: string
  registrator_id: number
  login_link_cp: string
  web_panel: string
  monitoring_id: number
  status: ServerStatus
  registrator_login: string
  provider_name: string
  record_open?: boolean
  popup_open?: boolean
}

export interface ServersShortRecord {
  id?: number
  name: string
}

interface ServersFilter
  extends Record<string, string | number | boolean | SelectValue> {
  provider_name: string
  server_status: SelectValue
  department_name: SelectValue
  registrator_id: SelectValue
  active: SelectValue
}

interface ServersState {
  list: ServersRecord[]
  page: number
  itemsInPage: number
  itemsCount: number
  status: StatusType
  editStatus: string
  loaded: boolean
  error: string | null
  search: string
  filter: ServersFilter
  filterChanges: number
}

type ServerEditRecord = {
  created_at: string
  deleted_at: string | null
  name: string
  department_name: string
  ip_addr: string
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
    ip_addr: fields.ip_addr.value,
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
    const response = await axiosInstance.get<
      ServerGetResponse<ServersShortRecord>
    >(
      `/servers/getNames?offset=${
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

export const fetchServersPage = createAsyncThunk(
  "/servers/fetchServersPage",
  async (params, { getState }) => {
    const { servers } = <RootState>getState()
    console.log(
      "servers.filter.registrator_id.value",
      servers.filter.registrator_id?.value
    )

    const response = await axiosInstance.get<ServerGetResponse<ServersRecord>>(
      `/servers/?offset=${(servers.page - 1) * servers.itemsInPage}&limit=${
        servers.itemsInPage
      }&name=${servers.search}&registrator_id=${
        servers.filter.registrator_id?.value
          ? servers.filter.registrator_id.value
          : ""
      }&department_name=${
        servers.filter.department_name?.value
          ? servers.filter.department_name.value
          : ""
      }${
        servers.filter.server_status?.value
          ? "&server_status=" + servers.filter.server_status.value
          : ""
      }${
        servers.filter.active?.value
          ? "&active=" +
            (servers.filter.active.value === "1" ? "true" : "false")
          : ""
      }`
    )

    console.log("response.data", response.data)
    return response.data
  }
)

export const addServer = createAsyncThunk(
  "servers/addServer",
  async ({ fields }: MyFormData) => {
    const bodyData = fillServerRecord({ fields })
    const response = await axiosInstance.post("/servers", bodyData)
    console.log("add server response.data", response.data)
    return response.data
  }
)

export const editServer = createAsyncThunk(
  "servers/editServer",
  async (server: MyFormData) => {
    const bodyData = fillServerRecord(server)

    const response = await axiosInstance.put(`/servers/${server.id}`, bodyData)
    return response.data
  }
)

export const deleteServer = createAsyncThunk(
  "servers/deleteServer",
  async (id: number) => {
    const response = await axiosInstance.delete(`/servers/${id}`)
    return response.data
  }
)

export const archiveServer = createAsyncThunk(
  "servers/archiveServer",
  async (id: number) => {
    const response = await axiosInstance.put(`/servers/${id}/delete`, {})
    return response.data
  }
)

const initialState: ServersState = {
  list: [],
  page: 1,
  itemsInPage: 10,
  itemsCount: 0,
  status: "idle",
  editStatus: "idle",
  loaded: false,
  error: null,
  search: "",
  filter: {
    provider_name: null,
    server_status: null,
    department_name: null,
    registrator_id: null,
    active: null,
  },
  filterChanges: 0,
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
      })
      .addCase(fetchServersPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((server) => ({
          ...server,
          record_open: false,
          popup_open: false,
        }))
        state.itemsCount = payload.count
        state.status = "succeeded"
        state.loaded = true
      })
      .addCase(fetchServersPage.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
        toastAlert("Ошибка чтения серверов: " + action.error.message, "error")
      })
      .addCase(addServer.pending, (state) => {
        state.editStatus = "loading"
      })
      .addCase(
        addServer.fulfilled,
        (state, { payload }: PayloadAction<ServersRecord>) => {
          state.editStatus = "succeeded"
          state.filterChanges++
          toastAlert("Сервер успешно добавлен", "success")
        }
      )
      .addCase(addServer.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.error.message
        toastAlert(
          "Ошибка добавления сервера: " + action.error.message,
          "error"
        )
      })
      .addCase(editServer.pending, (state) => {
        state.editStatus = "loading"
      })
      .addCase(
        editServer.fulfilled,
        (state, { payload }: PayloadAction<ServersRecord>) => {
          state.editStatus = "succeeded"
          state.filterChanges++
          toastAlert("Сервер успешно изменен", "success")
        }
      )
      .addCase(editServer.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.error.message
        toastAlert("Ошибка изменения сервера: " + action.error.message, "error")
      })
      .addCase(archiveServer.fulfilled, (state, action) => {
        state.filterChanges++
        toastAlert("Сервер успешно архивирован", "success")
      })
      .addCase(archiveServer.rejected, (state, action) => {
        toastAlert(
          "Ошибка архивирования сервера: " + action.error.message,
          "error"
        )
      })
      .addCase(deleteServer.fulfilled, (state, action) => {
        state.filterChanges++
        toastAlert("Сервер успешно удален", "success")
      })
      .addCase(deleteServer.rejected, (state, action) => {
        toastAlert("Ошибка удаления сервера: " + action.error.message, "error")
      })
  },
})

// Action creators are generated for each case reducer function
export const {
  setFilter,
  setSearch,
  setPage,
  setItemsInPage,
  toggleServerOpen,
  toggleServerPopup,
  closeServerPopups,
  reloadPage,
} = serversSlice.actions

export default serversSlice.reducer

export const listServers = (state: RootState) => state.servers.list
export const listServersStatus = (state: RootState) => state.servers.status
export const listServersLoaded = (state: RootState) => state.servers.loaded
export const listServersPage = (state: RootState) => state.servers.page
export const listServersItemsInPage = (state: RootState) =>
  state.servers.itemsInPage
export const listServersItemsCount = (state: RootState) =>
  state.servers.itemsCount
export const listServersFilter = (state: RootState) => state.servers.filter
export const listServersFilterChanges = (state: RootState) =>
  state.servers.filterChanges
export const listServersSearch = (state: RootState) => state.servers.search

export const selectServerById = (state: RootState, id: number) => {
  return state.servers.list.find((item) => item.id === id)
}
