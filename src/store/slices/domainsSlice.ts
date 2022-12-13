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
  Subdomain,
  OptionsObject,
  Additional,
  ValidationErrors,
  ErrorPayloadData,
} from "@components/app/forms/formWrapper/types"
import { AxiosError } from "axios"
//import ts from "typescript"

interface SubdomainsRecord {
  id?: number
  created_at?: string
  deleted_at?: string
  subdomain_name: string
  server_id: number
  server_name: string
  ip_addr_id: number
  ip_addr: string
  a: string
  cname: string
  available_status: boolean
  available_condition: string
  monitoring_id?: number
  domain_id?: number
}

interface SubdomainsEditRecord {
  id?: number
  created_at?: string
  deleted_at?: string
  subdomain_name: string
  ip_addr_id: number
  a: string
  cname: string
  available_status: boolean
  monitoring_id?: number
  domain_id?: number
}

export interface DomainsRecord {
  id?: number
  created_at?: string
  deleted_at?: string
  name: string
  department_name: string

  provider_id: number
  registrator_name: string
  registrator_id: number
  registrator_acc_name: string
  server_id: number
  server_name: string
  ip_addr_id: number
  ip_addr: string

  hosting_id: number
  hosting_name: string
  hosting_acc_id: number
  hosting_acc_name: string
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
  expirationtime_status: boolean
  expirationtime_condition: string
  is_activated: boolean

  server_status_last_updated: string
  whois_condition_last_updated: string
  available_condition_last_updated: string
  ssl_condition_last_updated: string
  rkn_condition_last_updated: string
  pagespeed_condition_last_updated: string
  expirationtime_condition_last_updated: string

  subdomains: SubdomainsRecord[] | null
  monitoring_id: number
  registration_date: string
  geo_condition: string[]
  notes: string

  record_open?: boolean
  popup_open?: boolean
}

export interface DomainsShortRecord {
  id: number
  name: string
}

interface DomainsFilter
  extends Record<string, string | number | boolean | SelectValue> {
  available_condition: SelectValue
  expirationtime_condition: string
  department_name: SelectValue
  server_id: SelectValue
  provider_id: SelectValue
  registrator_id: SelectValue
  registration_date: string
  active: SelectValue
  is_activated: SelectValue
}

interface DomainsState {
  list: DomainsRecord[]
  listAll: DomainsRecord[]
  page: number
  itemsInPage: number
  itemsCount: number
  sort: string
  status: StatusType
  editStatus: StatusType
  allStatus: string
  loaded: boolean
  error: string
  errorData: ErrorPayloadData | null
  search: string
  filter: DomainsFilter
  filterChanges: number
  selectedIds: number[]
}

type DomainEditRecord = {
  created_at: string
  deleted_at: string
  name: string
  department_name: string

  server_id: number
  registrator_id: number
  provider_id: number
  hosting_id: number
  hosting_acc_id: number
  ip_addr_id: number

  ns: string[]

  whois_status: boolean
  available_status: boolean
  rkn_status: boolean
  ssl_status: boolean
  geo_status: string[]
  expirationtime_status: boolean
  subdomains: SubdomainsEditRecord[]

  is_activated: boolean

  notes: string
}

const fillDomainEditRecord = (
  { fields }: MyFormData,
  type: string
): DomainEditRecord => {
  const subdomains = fields.subdomains.valueArr.map((subdomain: Subdomain) => {
    const ret: SubdomainsEditRecord = {
      created_at: new Date().toISOString(),
      deleted_at: null,
      subdomain_name: !subdomain.id
        ? subdomain.title + "." + fields.name.value
        : subdomain.title,
      ip_addr_id: subdomain.ip_addr_id,
      a: "",
      cname: "",
      available_status: subdomain.available_check,
    }
    if (subdomain.id) ret.id = subdomain.id
    if (subdomain.monitoring_id) ret.monitoring_id = subdomain.monitoring_id
    return ret
  })

  const bodyData: DomainEditRecord = {
    created_at: new Date().toISOString(),
    deleted_at: null,
    name: fields.name.value,
    available_status: fields.available_status.value === "1" ? true : false,
    department_name: fields.department_name.valueObj.value,
    ns: fields.ns.valueArr
      .filter((ns_rec) => ns_rec.checked)
      .map((item) => item.value),
    expirationtime_status:
      fields.expirationtime_status.value === "1" ? true : false,
    provider_id: Number(fields.provider_id.valueObj.value),
    registrator_id: Number(fields.registrator_id.valueObj.value),
    hosting_id: Number(fields.hosting_id.valueObj.value),
    hosting_acc_id: Number(fields.hosting_acc_id.valueObj.value),
    server_id: Number(fields.server_id.valueObj.value),
    ip_addr_id: Number(fields.ip_addr_id.valueObj.value),
    rkn_status: fields.rkn_status.value === "1" ? true : false,
    ssl_status: fields.ssl_status.value === "1" ? true : false,
    whois_status: fields.whois_status.value === "1" ? true : false,
    is_activated: fields.is_activated.value === "1" ? true : false,
    subdomains: subdomains,
    geo_status: [],
    notes: fields.notes.value,
  }

  return bodyData
}

// load options using API call
export const loadDomainOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: DomainsShortRecord[] = []
  try {
    // get запрос для получения имен
    const query = new URLSearchParams({
      offset: String((page - 1) * 10),
      limit: "10",
      name: inputValue,
      partial: "true",
    }).toString()

    const response = await axiosInstance.get<
      ServerGetResponse<DomainsShortRecord>
    >(`/domains/getNames?${query}`)

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

// load options using API call
export const loadDepartmentOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: string[] = []
  try {
    const response = await axiosInstance.get<string[]>(`/departments`)

    console.log("response.data", response.data)
    items = response.data ? response.data : []
  } catch (e) {
    items = []
  }
  const newItems = items.map((item) => ({
    value: item,
    label: item,
  }))
  if (page === 1) {
    newItems.unshift({ value: "", label: "Не выбрано" })
  }

  return {
    options: newItems,
    hasMore: false,
    additional: {
      page: page + 1,
    },
  }
}

export const fetchDomainAll = createAsyncThunk(
  "/domains/fetchDomainAll",
  async (params, { getState }) => {
    const { domains } = <RootState>getState()

    const queryObj: Record<string, string> = {
      offset: "0",
      limit: "999999999999",
      sort: "-created_at",
      name: domains.search,
      active: domains.filter.active?.value
        ? domains.filter.active.value === "1"
          ? "true"
          : "false"
        : "true",
      department_name: domains.filter.department_name?.value
        ? domains.filter.department_name.value
        : "",
      provider_id: domains.filter.provider_id?.value
        ? domains.filter.provider_id.value
        : "",
      server_id: domains.filter.server_id?.value
        ? domains.filter.server_id.value
        : "",
      registrator_id: domains.filter.registrator_id?.value
        ? domains.filter.registrator_id.value
        : "",
      registration_date: domains.filter.registration_date
        ? domains.filter.registration_date.split(".").reverse().join("-")
        : "",
      expirationtime_condition: domains.filter.expirationtime_condition
        ? domains.filter.expirationtime_condition.split(".").reverse().join("-")
        : "",
    }
    if (domains.filter.available_condition?.value) {
      queryObj.available_condition = domains.filter.available_condition.value
    }
    const query = new URLSearchParams(queryObj).toString()

    const response = await axiosInstance.get<ServerGetResponse<DomainsRecord>>(
      `/domains/?${query}`
    )
    console.log("response.data", response.data)
    return response.data
  }
)

export const fetchDomainPage = createAsyncThunk(
  "/domains/fetchDomainPage",
  async (params, { getState, rejectWithValue }) => {
    const { domains } = <RootState>getState()

    const queryObj: Record<string, string> = {
      offset: String((domains.page - 1) * domains.itemsInPage),
      limit: String(domains.itemsInPage),
      sort: domains.sort ? domains.sort : "-created_at",
      name: domains.search,
      active: domains.filter.active?.value
        ? domains.filter.active.value === "1"
          ? "true"
          : "false"
        : "true",
      department_name: domains.filter.department_name?.value
        ? domains.filter.department_name.value
        : "",
      provider_id: domains.filter.provider_id?.value
        ? domains.filter.provider_id.value
        : "",
      server_id: domains.filter.server_id?.value
        ? domains.filter.server_id.value
        : "",
      registrator_id: domains.filter.registrator_id?.value
        ? domains.filter.registrator_id.value
        : "",
      registration_date: domains.filter.registration_date
        ? domains.filter.registration_date.split(".").reverse().join("-")
        : "",
      expirationtime_condition: domains.filter.expirationtime_condition
        ? domains.filter.expirationtime_condition.split(".").reverse().join("-")
        : "",
    }
    if (domains.filter.available_condition?.value) {
      queryObj.available_condition = domains.filter.available_condition.value
    }
    if (domains.filter.is_activated?.value) {
      queryObj.is_activated =
        domains.filter.is_activated.value === "1" ? "true" : "false"
    }
    const query = new URLSearchParams(queryObj).toString()

    try {
      const response = await axiosInstance.get<
        ServerGetResponse<DomainsRecord>
      >(`/domains/?${query}`)
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

export const addDomain = createAsyncThunk(
  "domains/addDomain",
  async ({ fields }: MyFormData, { rejectWithValue }) => {
    const bodyData = fillDomainEditRecord({ fields }, "add")
    try {
      const response = await axiosInstance.post("/domains/", bodyData)
      console.log("add domain response.data", response.data)
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

export const editDomain = createAsyncThunk(
  "domains/editDomain",
  async (
    { form, record }: { form: MyFormData; record: DomainsRecord },
    { rejectWithValue }
  ) => {
    const bodyData = fillDomainEditRecord(form, "edit")
    bodyData.created_at = record.created_at
    bodyData.deleted_at = record.deleted_at
    try {
      const response = await axiosInstance.put(
        `/domains/${record.id}`,
        bodyData
      )
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

export const deleteDomain = createAsyncThunk(
  "domains/deleteDomain",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/domains/${id}`)
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

export const archiveDomain = createAsyncThunk(
  "domains/archiveDomain",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/domains/${id}/delete`, {})
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

export const switchMonitoringDomain = createAsyncThunk(
  "domains/switchMonitoringDomain",
  async (
    { id, status }: { id: number; status: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/domains/${id}/monitoring`, {
        is_activated: status,
      })
      return { ...response.data, id, is_activated: status }
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

const initialState: DomainsState = {
  list: [],
  listAll: [],
  page: 1,
  itemsInPage: 10,
  itemsCount: 0,
  sort: "-created_at",
  status: "idle",
  editStatus: "idle",
  allStatus: "idle",
  loaded: false,
  error: "",
  errorData: null,
  search: "",
  filter: {
    available_condition: null,
    expirationtime_condition: null,
    department_name: null,
    server_id: null,
    provider_id: null,
    registrator_id: null,
    registration_date: null,
    active: null,
    is_activated: null,
  },
  filterChanges: 0,
  selectedIds: [],
}

export const domainsSlice = createSlice({
  name: "domains",
  initialState,
  reducers: {
    setFilter: (state, { payload }: PayloadAction<FieldsData>) => {
      Object.keys(payload).map((key) => {
        state.filter[key] =
          payload[key].type === "select"
            ? payload[key].valueObj
            : payload[key].value
      })
      state.page = 1
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
    toggleDomainOpen: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.record_open = !found.record_open
    },
    toggleDomainPopup: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.popup_open = !found.popup_open
    },
    closeDomainPopups: (state) => {
      state.list.map((item) => {
        item.popup_open = false
      })
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDomainAll.pending, (state) => {
        state.allStatus = "loading"
      })
      .addCase(fetchDomainAll.fulfilled, (state, { payload }) => {
        state.listAll = payload.data
        state.allStatus = "succeeded"
      })
      .addCase(fetchDomainAll.rejected, (state, action) => {
        toastAlert(
          "Ошибка чтения всех доменов: " + action.error.message,
          "error"
        )
      })
      .addCase(fetchDomainPage.pending, (state) => {
        state.status = "loading"
        state.editStatus = "idle"
        state.error = ""
        state.errorData = null
      })
      .addCase(fetchDomainPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((domain) => ({
          ...domain,
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
      .addCase(fetchDomainPage.rejected, (state, action) => {
        state.status = "failed"
        state.editStatus = "idle"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка чтения доменов: " + state.error, "error")
      })
      .addCase(addDomain.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
      })
      .addCase(
        addDomain.fulfilled,
        (state, { payload }: PayloadAction<DomainsRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Домен успешно добавлен", "success")
        }
      )
      .addCase(addDomain.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка добавления домена: " + state.error, "error")
      })
      .addCase(editDomain.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
        state.error = ""
      })
      .addCase(
        editDomain.fulfilled,
        (state, { payload }: PayloadAction<DomainsRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Домен успешно изменен", "success")
        }
      )
      .addCase(editDomain.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.error.message
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка изменения домена: " + state.error, "error")
      })
      .addCase(archiveDomain.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        toastAlert("Домен успешно удален", "success")
      })
      .addCase(archiveDomain.rejected, (state, action) => {
        toastAlert(
          "Ошибка архивирования домена: " +
            (action.payload
              ? errorToastText(action.payload as ErrorPayloadData)
              : action.error.message),
          "error"
        )
      })
      .addCase(deleteDomain.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        state.filterChanges++
        toastAlert("Домен успешно архивирован", "success")
      })
      .addCase(deleteDomain.rejected, (state, action) => {
        toastAlert(
          "Ошибка удаления домена: " +
            (action.payload
              ? errorToastText(action.payload as ErrorPayloadData)
              : action.error.message),
          "error"
        )
      })
      .addCase(switchMonitoringDomain.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
        state.error = ""
      })
      .addCase(switchMonitoringDomain.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        console.log("action.payload", action.payload)
        const found = state.list.find((item) => item.id == action.payload.id)
        if (found) {
          found.is_activated = action.payload.is_activated
          found.monitoring_id = action.payload.monitoring_id
        }
      })
      .addCase(switchMonitoringDomain.rejected, (state, action) => {
        toastAlert(
          "Ошибка изменения статуса мониторинга домена: " +
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
  toggleDomainOpen,
  toggleDomainPopup,
  closeDomainPopups,
  reloadPage,
} = domainsSlice.actions

export default domainsSlice.reducer

export const listDomainsAll = (state: RootState) => state.domains.listAll
export const listDomainsAllStatus = (state: RootState) =>
  state.domains.allStatus
export const listDomains = (state: RootState) => state.domains.list
export const listDomainsStatus = (state: RootState) => state.domains.status
export const listDomainsEditStatus = (state: RootState) =>
  state.domains.editStatus
export const listDomainsSort = (state: RootState) => state.domains.sort
export const listDomainsLoaded = (state: RootState) => state.domains.loaded
export const listDomainsPage = (state: RootState) => state.domains.page
export const listDomainsItemsInPage = (state: RootState) =>
  state.domains.itemsInPage
export const listDomainsSelectedIds = (state: RootState) =>
  state.domains.selectedIds
export const listDomainsItemsCount = (state: RootState) =>
  state.domains.itemsCount
export const listDomainsFilter = (state: RootState) => state.domains.filter
export const listDomainsFilterChanges = (state: RootState) =>
  state.domains.filterChanges
export const listDomainsSearch = (state: RootState) => state.domains.search
export const listDomainsError = (state: RootState) => state.domains.error
export const listDomainsErrorData = (state: RootState) =>
  state.domains.errorData

export const selectDomainById = (state: RootState, id: number) => {
  return state.domains.list.find((note) => note.id === id)
}
