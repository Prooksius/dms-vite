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
  StatusType,
  OptionsObject,
  Additional,
  SelectValue,
  ErrorPayloadData,
  ValidationErrors,
} from "@components/app/forms/formWrapper/types"
import { AxiosError } from "axios"

export interface EmailsRecord {
  id: number
  created_at: string
  deleted_at: string
  email_addr: string
  password: string
  secret_word: string
  phone: string
  record_open?: boolean
  popup_open?: boolean
}

export interface EmailsShortRecord {
  id: number
  email_addr: string
}

interface EmailsFilter extends Record<string, string | SelectValue> {
  email_addr: SelectValue
  created_at: string
  deleted_at: string
}

interface EmailsState {
  list: EmailsRecord[]
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
  filter: EmailsFilter
  filterChanges: number
  selectedIds: number[]
}

type EmailsListPayload = {
  data: EmailsRecord[]
  count: number
}

type EmailEditRecord = {
  created_at: string
  deleted_at: string | null
  email_addr: string
  password: string
  secret_word: string
  phone: string
}

const fillEmailRecord = ({ fields }: MyFormData): EmailEditRecord => {
  const bodyData: EmailEditRecord = {
    created_at: new Date().toISOString(),
    deleted_at: null,
    email_addr: fields.email_addr.value,
    password: fields.password.value,
    secret_word: fields.secret_word.value,
    phone: fields.phone.value,
  }

  return bodyData
}

// load options using API call
export const loadEmailOptions = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: EmailsShortRecord[] = []
  try {
    const query = new URLSearchParams({
      offset: String((page - 1) * 10),
      limit: "10",
      name: inputValue,
    }).toString()

    const response = await axiosInstance.get<
      ServerGetResponse<EmailsShortRecord>
    >(`/emails/getNames/?${query}`)

    console.log("loadedOptions", loadedOptions)
    console.log("response.data", response.data)
    items = response.data.data ? response.data.data : []
  } catch (e) {
    items = []
  }
  const newItems = items.map((item) => ({
    value: String(item.id),
    label: inputValue
      ? item.email_addr.split(inputValue).join(`<b>${inputValue}</b>`)
      : item.email_addr,
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
export const loadEmailOptionsName = async (
  inputValue: string,
  loadedOptions: OptionsObject[],
  { page }: Additional
) => {
  let items: EmailsShortRecord[] = []
  try {
    const query = new URLSearchParams({
      offset: String((page - 1) * 10),
      limit: "10",
      name: inputValue,
      partial: "true",
    }).toString()

    const response = await axiosInstance.get<
      ServerGetResponse<EmailsShortRecord>
    >(`/emails/getNames/?${query}`)

    console.log("loadedOptions", loadedOptions)
    console.log("response.data", response.data)
    items = response.data.data ? response.data.data : []
  } catch (e) {
    items = []
  }
  const newItems = items.map((item) => ({
    value: item.email_addr,
    label: inputValue
      ? item.email_addr.split(inputValue).join(`<b>${inputValue}</b>`)
      : item.email_addr,
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

export const fetchEmailsPage = createAsyncThunk(
  "/emails/fetchEmailsPage",
  async (params, { getState, rejectWithValue }) => {
    const { emails } = <RootState>getState()

    const query = new URLSearchParams({
      offset: String((emails.page - 1) * emails.itemsInPage),
      limit: String(emails.itemsInPage),
      name: emails.search,
      created_at: emails.filter.created_at
        ? emails.filter.created_at.split(".").reverse().join("-")
        : "",
      deleted_at: emails.filter.deleted_at ? emails.filter.deleted_at : "",
      email_addr: emails.filter.email_addr
        ? emails.filter.email_addr.value
        : "",
    }).toString()

    try {
      const response = await axiosInstance.get<ServerGetResponse<EmailsRecord>>(
        `/emails/?${query}`
      )

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

export const addEmail = createAsyncThunk(
  "emails/addEmail",
  async ({ fields }: MyFormData, { rejectWithValue }) => {
    const bodyData = fillEmailRecord({ fields })
    try {
      const response = await axiosInstance.post("/emails/", bodyData)
      console.log("add email response.data", response.data)
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

export const editEmail = createAsyncThunk(
  "emails/editEmail",
  async (
    { form, record }: { form: MyFormData; record: EmailsRecord },
    { rejectWithValue }
  ) => {
    const bodyData = fillEmailRecord(form)
    bodyData.created_at = record.created_at
    bodyData.deleted_at = record.deleted_at
    try {
      const response = await axiosInstance.put(`/emails/${record.id}`, bodyData)
      console.log("edit email response.data", response.data)
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

export const deleteEmail = createAsyncThunk(
  "emails/deleteEmail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/emails/${id}`)
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

export const archiveEmail = createAsyncThunk(
  "emails/archiveEmail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/emails/${id}/delete`, {})
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

const initialState: EmailsState = {
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
  filter: {
    email_addr: null,
    created_at: null,
    deleted_at: null,
  },
  filterChanges: 0,
  selectedIds: [],
}

export const emailsSlice = createSlice({
  name: "emails",
  initialState,
  reducers: {
    setFilter: (state, { payload }: PayloadAction<FieldsData>) => {
      Object.keys(payload).map((key) => {
        state.filter[key] =
          payload[key].type === "select"
            ? payload[key].valueObj
            : payload[key].value
      })
      state.selectedIds = []
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
    toggleEmailOpen: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.record_open = !found.record_open
    },
    toggleEmailPopup: (state, { payload }: PayloadAction<number>) => {
      const found = state.list.find((item) => item.id === payload)
      if (found) found.popup_open = !found.popup_open
    },
    closeEmailPopups: (state) => {
      state.list.map((item) => {
        item.popup_open = false
      })
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEmailsPage.pending, (state) => {
        state.status = "loading"
        state.editStatus = "idle"
        state.error = ""
        state.errorData = null
      })
      .addCase(fetchEmailsPage.fulfilled, (state, { payload }) => {
        state.list = payload.data.map((email) => ({
          ...email,
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
      .addCase(fetchEmailsPage.rejected, (state, action) => {
        state.status = "failed"
        state.editStatus = "idle"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка чтения email-ов: " + state.error, "error")
      })
      .addCase(addEmail.pending, (state) => {
        state.editStatus = "loading"
        state.error = ""
        state.errorData = null
      })
      .addCase(
        addEmail.fulfilled,
        (state, { payload }: PayloadAction<EmailsRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Email успешно добавлен", "success")
        }
      )
      .addCase(addEmail.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка добавления Email: " + state.error, "error")
      })
      .addCase(editEmail.pending, (state) => {
        state.error = ""
        state.errorData = null
        state.editStatus = "loading"
      })
      .addCase(
        editEmail.fulfilled,
        (state, { payload }: PayloadAction<EmailsRecord>) => {
          state.editStatus = "succeeded"
          state.error = ""
          state.errorData = null
          state.filterChanges++
          toastAlert("Email успешно изменен", "success")
        }
      )
      .addCase(editEmail.rejected, (state, action) => {
        state.editStatus = "failed"
        state.error = action.payload
          ? errorToastText(action.payload as ErrorPayloadData)
          : action.error.message
        state.errorData = action.payload
          ? (action.payload as ErrorPayloadData)
          : null
        toastAlert("Ошибка изменения Email: " + state.error, "error")
      })
      .addCase(archiveEmail.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        state.filterChanges++
        toastAlert("Email успешно удален", "success")
      })
      .addCase(archiveEmail.rejected, (state, action) => {
        toastAlert(
          "Ошибка архивирования Email: " +
            (action.payload
              ? errorToastText(action.payload as ErrorPayloadData)
              : action.error.message),
          "error"
        )
      })
      .addCase(deleteEmail.fulfilled, (state, action) => {
        state.error = ""
        state.errorData = null
        state.filterChanges++
        toastAlert("Email успешно архивирован", "success")
      })
      .addCase(deleteEmail.rejected, (state, action) => {
        toastAlert(
          "Ошибка удаления Email: " +
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
  setItemsInPage,
  setSelected,
  toggleEmailOpen,
  toggleEmailPopup,
  closeEmailPopups,
  reloadPage,
} = emailsSlice.actions

export default emailsSlice.reducer

export const listEmails = (state: RootState) => state.emails.list
export const listEmailsStatus = (state: RootState) => state.emails.status
export const listEmailsEditStatus = (state: RootState) =>
  state.emails.editStatus
export const listEmailsSort = (state: RootState) => state.emails.sort
export const listEmailsLoaded = (state: RootState) => state.emails.loaded
export const listEmailsPage = (state: RootState) => state.emails.page
export const listEmailsSelectedIds = (state: RootState) =>
  state.emails.selectedIds
export const listEmailsItemsInPage = (state: RootState) =>
  state.emails.itemsInPage
export const listEmailsItemsCount = (state: RootState) =>
  state.emails.itemsCount
export const listEmailsFilter = (state: RootState) => state.emails.filter
export const listEmailsFilterChanges = (state: RootState) =>
  state.emails.filterChanges
export const listEmailsSearch = (state: RootState) => state.emails.search
export const listEmailsError = (state: RootState) => state.emails.error
export const listEmailsErrorData = (state: RootState) => state.emails.errorData

export const selectEmailById = (state: RootState, id: number) => {
  return state.emails.list.find((item) => item.id === id)
}
