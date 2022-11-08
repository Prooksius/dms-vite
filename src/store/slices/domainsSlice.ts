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
  Subdomain,
  OptionsObject,
  Additional,
} from "@components/app/forms/formWrapper/types"
//import ts from "typescript"

interface SubdomainsRecord {
  id?: number
  created_at?: string
  deleted_at?: string
  subdomain_name: string
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

  subdomains: SubdomainsRecord[]
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
}

interface DomainsState {
  list: DomainsRecord[]
  listAll: DomainsRecord[]
  page: number
  itemsInPage: number
  itemsCount: number
  status: StatusType
  editStatus: string
  allStatus: string
  loaded: boolean
  error: string | null
  search: string
  filter: DomainsFilter
  filterChanges: number
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

  ns: string[]

  whois_status: boolean
  available_status: boolean
  rkn_status: boolean
  ssl_status: boolean
  geo_status: string[]
  expirationtime_status: boolean
  subdomains: SubdomainsEditRecord[]

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
      a: subdomain.type === "A" ? subdomain.value : "",
      cname: subdomain.type === "CNAME" ? subdomain.value : "",
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
    ns: fields.ns.valueArr.filter(ns_rec => ns_rec.checked).map((item) => item.value),
    expirationtime_status:
      fields.expirationtime_status.value === "1" ? true : false,
    provider_id: Number(fields.provider_id.valueObj.value),
    registrator_id: Number(fields.registrator_id.valueObj.value),
    hosting_id: Number(fields.hosting_id.valueObj.value),
    hosting_acc_id: Number(fields.hosting_acc_id.valueObj.value),
    server_id: Number(fields.server_id.valueObj.value),
    rkn_status: fields.rkn_status.value === "1" ? true : false,
    ssl_status: fields.ssl_status.value === "1" ? true : false,
    whois_status: fields.whois_status.value === "1" ? true : false,
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
    const response = await axiosInstance.get<
      ServerGetResponse<DomainsShortRecord>
    >(
      `/domains/getNames?offset=${
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

    const response = await axiosInstance.get<ServerGetResponse<DomainsRecord>>(
      `/domains/?offset=0&limit=999999999999&name=${domains.search}${
        domains.filter.available_condition?.value
          ? "&available_condition=" + domains.filter.available_condition.value
          : ""
      }${
        domains.filter.active?.value
          ? "&active=" +
            (domains.filter.active.value === "1" ? "true" : "false")
          : "&active=true"
      }&department_name=${
        domains.filter.department_name?.value
          ? domains.filter.department_name.value
          : ""
      }&provider_id=${
        domains.filter.provider_id?.value
          ? domains.filter.provider_id.value
          : ""
      }&server_id=${
        domains.filter.server_id?.value ? domains.filter.server_id.value : ""
      }&registrator_id=${
        domains.filter.registrator_id?.value
          ? domains.filter.registrator_id.value
          : ""
      }&registration_date=${
        domains.filter.registration_date
          ? domains.filter.registration_date.split(".").reverse().join("-")
          : ""
      }&expirationtime_condition=${
        domains.filter.expirationtime_condition
          ? domains.filter.expirationtime_condition
              .split(".")
              .reverse()
              .join("-")
          : ""
      }`
    )
    console.log("response.data", response.data)
    return response.data
  }
)

export const fetchDomainPage = createAsyncThunk(
  "/domains/fetchDomainPage",
  async (params, { getState }) => {
    const { domains } = <RootState>getState()

    const response = await axiosInstance.get<ServerGetResponse<DomainsRecord>>(
      `/domains/?offset=${(domains.page - 1) * domains.itemsInPage}&limit=${
        domains.itemsInPage
      }&name=${domains.search}${
        domains.filter.available_condition?.value
          ? "&available_condition=" + domains.filter.available_condition.value
          : ""
      }${
        domains.filter.active?.value
          ? "&active=" +
            (domains.filter.active.value === "1" ? "true" : "false")
          : "&active=true"
      }&department_name=${
        domains.filter.department_name?.value
          ? domains.filter.department_name.value
          : ""
      }&provider_id=${
        domains.filter.provider_id?.value
          ? domains.filter.provider_id.value
          : ""
      }&server_id=${
        domains.filter.server_id?.value ? domains.filter.server_id.value : ""
      }&registrator_id=${
        domains.filter.registrator_id?.value
          ? domains.filter.registrator_id.value
          : ""
      }&registration_date=${
        domains.filter.registration_date
          ? domains.filter.registration_date.split(".").reverse().join("-")
          : ""
      }&expirationtime_condition=${
        domains.filter.expirationtime_condition
          ? domains.filter.expirationtime_condition
              .split(".")
              .reverse()
              .join("-")
          : ""
      }`
    )
    console.log("response.data", response.data)
    return response.data
  }
)

export const addDomain = createAsyncThunk(
  "domains/addDomain",
  async ({ fields }: MyFormData) => {
    const bodyData = fillDomainEditRecord({ fields }, "add")
    const response = await axiosInstance.post("/domains/", bodyData)
    console.log("add domain response.data", response.data)
    return response.data
  }
)

export const editDomain = createAsyncThunk(
  "domains/editDomain",
  async ({ form, record }: { form: MyFormData; record: DomainsRecord }) => {
    const bodyData = fillDomainEditRecord(form, "edit")
    bodyData.created_at = record.created_at
    bodyData.deleted_at = record.deleted_at
    const response = await axiosInstance.put(`/domains/${record.id}`, bodyData)
    return response.data
  }
)

export const deleteDomain = createAsyncThunk(
  "domains/deleteDomain",
  async (id: number) => {
    const response = await axiosInstance.delete(`/domains/${id}`)
    return response.data
  }
)

export const archiveDomain = createAsyncThunk(
  "domains/archiveDomain",
  async (id: number) => {
    const response = await axiosInstance.put(`/domains/${id}/delete`, {})
    return response.data
  }
)

const initialState: DomainsState = {
  list: [],
  listAll: [],
  page: 1,
  itemsInPage: 10,
  itemsCount: 0,
  status: "idle",
  editStatus: "idle",
  allStatus: "idle",
  loaded: false,
  error: null,
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
  },
  filterChanges: 0,
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
      })
      .addCase(fetchDomainPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((domain) => ({
          ...domain,
          record_open: false,
          popup_open: false,
        }))
        state.itemsCount = payload.count
        state.status = "succeeded"
        state.loaded = true
      })
      .addCase(fetchDomainPage.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
        toastAlert("Ошибка чтения доменов: " + action.error.message, "error")
      })
      .addCase(addDomain.pending, (state) => {
        state.editStatus = "loading"
      })
      .addCase(
        addDomain.fulfilled,
        (state, { payload }: PayloadAction<DomainsRecord>) => {
          state.editStatus = "succeeded"
          state.filterChanges++
          toastAlert("Домен успешно добавлен", "success")
        }
      )
      .addCase(addDomain.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.error.message
        toastAlert("Ошибка добавления домена: " + action.error.message, "error")
      })
      .addCase(editDomain.pending, (state) => {
        state.editStatus = "loading"
      })
      .addCase(
        editDomain.fulfilled,
        (state, { payload }: PayloadAction<DomainsRecord>) => {
          //state.list = state.list.map((domain) => domain.id === payload.id)
          state.editStatus = "succeeded"
          state.filterChanges++
          toastAlert("Домен успешно изменен", "success")
        }
      )
      .addCase(editDomain.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.error.message
        toastAlert("Ошибка изменения домена: " + action.error.message, "error")
      })
      .addCase(archiveDomain.fulfilled, (state, action) => {
        //state.list = state.list.filter((note) => note.id !== +action.payload.id)
        toastAlert("Домен успешно удален", "success")
      })
      .addCase(archiveDomain.rejected, (state, action) => {
        toastAlert(
          "Ошибка архивирования домена: " + action.error.message,
          "error"
        )
      })
      .addCase(deleteDomain.fulfilled, (state, action) => {
        //state.list = state.list.filter((note) => note.id !== +action.payload.id)
        state.filterChanges++
        toastAlert("Домен успешно архивирован", "success")
      })
      .addCase(deleteDomain.rejected, (state, action) => {
        toastAlert("Ошибка удаления домена: " + action.error.message, "error")
      })
  },
})

// Action creators are generated for each case reducer function
export const {
  setFilter,
  setSearch,
  setPage,
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
export const listDomainsLoaded = (state: RootState) => state.domains.loaded
export const listDomainsPage = (state: RootState) => state.domains.page
export const listDomainsItemsInPage = (state: RootState) =>
  state.domains.itemsInPage
export const listDomainsItemsCount = (state: RootState) =>
  state.domains.itemsCount
export const listDomainsFilter = (state: RootState) => state.domains.filter
export const listDomainsFilterChanges = (state: RootState) =>
  state.domains.filterChanges
export const listDomainsSearch = (state: RootState) => state.domains.search

export const selectDomainById = (state: RootState, id: number) => {
  return state.domains.list.find((note) => note.id === id)
}
