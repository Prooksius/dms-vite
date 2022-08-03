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

export interface RegistratorsRecord {
  id: number
  created_at: string
  deleted_at: string | null
  name: string
  email_id: number
  provider_id: number
  login_link: string
  login: string
  password: string
  secret_word: string
  phone: string
  api_key: string
  ns: string[]
  email: string
  provider_name: string
  record_open?: boolean
  popup_open?: boolean
}

export interface RegistratorsShortRecord {
  id: number
  name: string
}

interface RegistratorsFilter extends Record<string, string | SelectValue> {
  created_at: string
  deleted_at: string
  email_id: SelectValue
  provider_id: SelectValue
}

interface RegistratorsState {
  list: RegistratorsRecord[]
  page: number
  itemsInPage: number
  itemsCount: number
  status: StatusType
  editStatus: string
  loaded: boolean
  error: string | null
  search: string
  filter: RegistratorsFilter
  filterChanges: number
}

type RegistratorEditRecord = {
  created_at: string
  deleted_at: string | null
  name: string
  email_id: number
  provider_id: number
  login_link: string
  login: string
  password: string
  secret_word: string
  phone: string
  api_key: string
  ns: string[]
}

const fillRegistratorRecord = ({
  fields,
}: MyFormData): RegistratorEditRecord => {
  const bodyData: RegistratorEditRecord = {
    created_at: new Date().toISOString(),
    deleted_at: null,
    name: fields.name.value,
    email_id: Number(fields.email_id.valueObj.value),
    provider_id: Number(fields.provider_id.valueObj.value),
    login_link: fields.login_link.value,
    login: fields.login.value,
    password: fields.password.value,
    secret_word: "", // fields.secret_word.value,
    phone: "", // fields.phone.value,
    api_key: "", // fields.api_key.value,
    ns: fields.ns.valueArr.map((item) => item.value),
  }

  return bodyData
}

// load options using API call
export const loadRegistratorOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: RegistratorsShortRecord[] = []
  try {
    const response = await axiosInstance.get<
      ServerGetResponse<RegistratorsShortRecord>
    >(
      `/registrators/getNames?offset=${
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

export const fetchRegistratorsPage = createAsyncThunk(
  "/registrators/fetchRegistratorsPage",
  async (params, { getState }) => {
    const { registrators } = <RootState>getState()

    const response = await axiosInstance.get<
      ServerGetResponse<RegistratorsRecord>
    >(
      `/registrators/?offset=${
        (registrators.page - 1) * registrators.itemsInPage
      }&limit=${registrators.itemsInPage}&name=${
        registrators.search
      }&created_at=${
        registrators.filter.created_at
          ? registrators.filter.created_at.split(".").reverse().join("-")
          : ""
      }&deleted_at=${
        registrators.filter.deleted_at ? registrators.filter.deleted_at : ""
      }&email_id=${
        registrators.filter.email_id ? registrators.filter.email_id.value : ""
      }&provider_id=${
        registrators.filter.provider_id
          ? registrators.filter.provider_id.value
          : ""
      }`
    )

    console.log("response.data", response.data)
    return response.data
  }
)

export const addRegistrator = createAsyncThunk(
  "registrators/addRegistrator",
  async ({ fields }: MyFormData) => {
    const bodyData = fillRegistratorRecord({ fields })
    const response = await axiosInstance.post("/registrators", bodyData)
    console.log("add registrator response.data", response.data)
    return response.data
  }
)

export const editRegistrator = createAsyncThunk(
  "registrators/editRegistrator",
  async ({ form, record }: { form: MyFormData; record: RegistratorsRecord }) => {
    const bodyData = fillRegistratorRecord(form)
    bodyData.created_at = record.created_at
    bodyData.deleted_at = record.deleted_at
    const response = await axiosInstance.put(
      `/registrators/${record.id}`,
      bodyData
    )
    return response.data
  }
)

export const deleteRegistrator = createAsyncThunk(
  "registrators/deleteRegistrator",
  async (id: number) => {
    const response = await axiosInstance.delete(`/registrators/${id}`)
    return response.data
  }
)

export const archiveRegistrator = createAsyncThunk(
  "registrators/archiveRegistrator",
  async (id: number) => {
    const response = await axiosInstance.put(`/registrators/${id}/delete`, {})
    return response.data
  }
)

const initialState: RegistratorsState = {
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
    created_at: null,
    deleted_at: null,
    email_id: null,
    provider_id: null,
  },
  filterChanges: 0,
}

export const registratorsSlice = createSlice({
  name: "registrators",
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
    toggleRegistratorOpen: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.record_open = !found.record_open
    },
    toggleRegistratorPopup: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.popup_open = !found.popup_open
    },
    closeRegistratorPopups: (state) => {
      state.list.map((item) => {
        item.popup_open = false
      })
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRegistratorsPage.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchRegistratorsPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((registrator) => ({
          ...registrator,
          record_open: false,
          popup_open: false,
        }))
        state.itemsCount = payload.count
        state.status = "succeeded"
        state.loaded = true
      })
      .addCase(fetchRegistratorsPage.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
        toastAlert("Ошибка чтения серверов: " + action.error.message, "error")
      })
      .addCase(addRegistrator.pending, (state) => {
        state.editStatus = "loading"
      })
      .addCase(
        addRegistrator.fulfilled,
        (state, { payload }: PayloadAction<RegistratorsRecord>) => {
          state.editStatus = "succeeded"
          state.filterChanges++
          toastAlert("Сервер успешно добавлен", "success")
        }
      )
      .addCase(addRegistrator.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.error.message
        toastAlert(
          "Ошибка добавления сервера: " + action.error.message,
          "error"
        )
      })
      .addCase(editRegistrator.pending, (state) => {
        state.editStatus = "loading"
      })
      .addCase(
        editRegistrator.fulfilled,
        (state, { payload }: PayloadAction<RegistratorsRecord>) => {
          state.editStatus = "succeeded"
          state.filterChanges++
          toastAlert("Сервер успешно изменен", "success")
        }
      )
      .addCase(editRegistrator.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.error.message
        toastAlert("Ошибка изменения сервера: " + action.error.message, "error")
      })
      .addCase(archiveRegistrator.fulfilled, (state, action) => {
        state.filterChanges++
        toastAlert("Сервер успешно удален", "success")
      })
      .addCase(archiveRegistrator.rejected, (state, action) => {
        toastAlert(
          "Ошибка архивирования сервера: " + action.error.message,
          "error"
        )
      })
      .addCase(deleteRegistrator.fulfilled, (state, action) => {
        state.filterChanges++
        toastAlert("Сервер успешно архивирован", "success")
      })
      .addCase(deleteRegistrator.rejected, (state, action) => {
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
  toggleRegistratorOpen,
  toggleRegistratorPopup,
  closeRegistratorPopups,
  reloadPage,
} = registratorsSlice.actions

export default registratorsSlice.reducer

export const listRegistrators = (state: RootState) => state.registrators.list
export const listRegistratorsStatus = (state: RootState) =>
  state.registrators.status
export const listRegistratorsLoaded = (state: RootState) =>
  state.registrators.loaded
export const listRegistratorsPage = (state: RootState) =>
  state.registrators.page
export const listRegistratorsItemsInPage = (state: RootState) =>
  state.registrators.itemsInPage
export const listRegistratorsItemsCount = (state: RootState) =>
  state.registrators.itemsCount
export const listRegistratorsFilter = (state: RootState) =>
  state.registrators.filter
export const listRegistratorsFilterChanges = (state: RootState) =>
  state.registrators.filterChanges
export const listRegistratorsSearch = (state: RootState) =>
  state.registrators.search

export const selectRegistratorById = (state: RootState, id: number) => {
  return state.registrators.list.find((item) => item.id === id)
}
