import {
  MyFormData,
  NS,
  Subdomain,
} from "@components/app/forms/formWrapper/types"
import type { DomainsRecord } from "@store/slices/domainsSlice"

export const domainEditFormData: MyFormData = {
  fields: {
    name: {
      label: "Название домена",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
        minLength: 5,
        maxLength: 255,
      },
      errorMessage: "",
      dirty: false,
    },
    department_name: {
      label: "Отдел",
      type: "select",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    server_id: {
      label: "Сервер",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      type: "select",
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    ip_addr_id: {
      label: "IP адрес",
      type: "select",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      dependency: {
        field: "server_id",
        type: "loadOptions",
      },
      errorMessage: "",
      dirty: false,
    },
    provider_id: {
      label: "Регистратор",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      type: "select",
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    registrator_id: {
      label: "Аккаунт регистратора",
      type: "select",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      dependency: {
        field: "provider_id",
        type: "loadOptions",
      },
      errorMessage: "",
      dirty: false,
    },
    hosting_id: {
      label: "Хостинг",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      type: "select",
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      errorMessage: "",
      dirty: false,
    },
    hosting_acc_id: {
      label: "Аккаунт хостинга",
      type: "select",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        required: true,
      },
      dependency: {
        field: "hosting_id",
        type: "loadOptions",
      },
      errorMessage: "",
      dirty: false,
    },
    ns: {
      label: "NS",
      type: "checklist",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        required: true,
        minValue: 1,
      },
      dependency: {
        field: "hosting_acc_id",
        type: "loadOptions",
      },
      errorMessage: "",
      dirty: false,
    },
    is_activated: {
      label: "Мониторинг",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    whois_status: {
      label: "Домен свободен",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    available_status: {
      label: "Проверка доступности",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    pagespeed_status: {
      label: "Google PageSpeed",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    rkn_status: {
      label: "Проверка РКН",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    ssl_status: {
      label: "Проверка SSL",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    integration_registrator_status: {
      label: "Интегрировать с Регистратором",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    integration_cloudflare_status: {
      label: "Интегрировать с CloudFare",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    expirationtime_status: {
      label: "Срок регистрации",
      type: "checkbox",
      value: "0",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {},
      errorMessage: "",
      dirty: false,
    },
    subdomains: {
      label: "",
      type: "array",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      dropdown: "default",
      options: [{ value: "", label: "Не выбрано" }],
      validations: {
        subdomains: true,
      },
      errorMessage: "",
      dirty: false,
    },
    notes: {
      label: "Комментарии",
      type: "text",
      value: "",
      valueObj: { value: "", label: "Не выбрано" },
      valueArr: [],
      validations: {
        maxLength: 5000,
      },
      errorMessage: "",
      dirty: false,
    },
  },
}

export const clearDomainForm = (filledFormData: MyFormData) => {
  Object.keys(filledFormData.fields).map((key) => {
    filledFormData.fields[key].dirty = false
    filledFormData.fields[key].errorMessage = ""
  })
  filledFormData.fields.name.value = ""
  filledFormData.fields.notes.value = ""
  filledFormData.fields.department_name.value = ""
  filledFormData.fields.server_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.ip_addr_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.provider_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.registrator_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.hosting_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.hosting_acc_id.valueObj = {
    value: "",
    label: "Не выбрано",
  }
  filledFormData.fields.ns.valueArr = []
  filledFormData.fields.subdomains.valueArr = []
  filledFormData.fields.whois_status.value = "0"
  filledFormData.fields.available_status.value = "0"
  filledFormData.fields.pagespeed_status.value = "0"
  filledFormData.fields.rkn_status.value = "0"
  filledFormData.fields.ssl_status.value = "0"
  filledFormData.fields.integration_registrator_status.value = "0"
  filledFormData.fields.integration_cloudflare_status.value = "0"
  filledFormData.fields.is_activated.value = "0"
}

export const fillDomainForm = (
  filledFormData: MyFormData,
  domain: DomainsRecord
) => {
  if (domain) {
    Object.keys(filledFormData.fields).map((key) => {
      filledFormData.fields[key].dirty = false
      filledFormData.fields[key].errorMessage = ""
    })
    const subdomains = domain.subdomains.map((subdomain) => {
      return {
        id: subdomain.id,
        title: subdomain.subdomain_name,
        server_id: subdomain.server_id,
        server_name: subdomain.server_name,
        ip_addr_id: subdomain.ip_addr_id,
        ip_addr: subdomain.ip_addr,
        type: "A",
        available_check: subdomain.available_status,
        monitoring_id: subdomain.monitoring_id,
      } as Subdomain
    })

    const recordNS = domain.ns || []

    const ns = recordNS.map((item) => {
      return {
        value: item,
        checked: true,
      } as NS
    })

    filledFormData.fields.name.value = domain.name
    filledFormData.fields.notes.value = domain.notes
    filledFormData.fields.department_name.valueObj = {
      value: domain.department_name,
      label: domain.department_name,
    }

    if (domain.server_id) {
      const server = {
        value: String(domain.server_id),
        label: domain.server_name,
      }
      filledFormData.fields.server_id.valueObj = server
      filledFormData.fields.server_id.options = [
        { value: "", label: "Не выбрано" },
        server,
      ]
    } else {
      filledFormData.fields.server_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    if (domain.ip_addr_id) {
      const ip_addr = {
        value: String(domain.ip_addr_id),
        label: domain.ip_addr,
      }
      filledFormData.fields.ip_addr_id.valueObj = ip_addr
      filledFormData.fields.ip_addr_id.options = [
        { value: "", label: "Не выбрано" },
        ip_addr,
      ]
    } else {
      filledFormData.fields.ip_addr_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    if (domain.provider_id) {
      const provider = {
        value: String(domain.provider_id),
        label: domain.registrator_name,
      }
      filledFormData.fields.provider_id.valueObj = provider
      filledFormData.fields.provider_id.options = [
        { value: "", label: "Не выбрано" },
        provider,
      ]
    } else {
      filledFormData.fields.provider_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    if (domain.registrator_id) {
      const registrator = {
        value: String(domain.registrator_id),
        label: domain.registrator_acc_name,
      }
      filledFormData.fields.registrator_id.valueObj = registrator
      filledFormData.fields.registrator_id.options = [
        { value: "", label: "Не выбрано" },
      ]
    } else {
      filledFormData.fields.registrator_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    if (domain.hosting_id) {
      const hosting = {
        value: String(domain.hosting_id),
        label: domain.hosting_name,
      }
      filledFormData.fields.hosting_id.valueObj = hosting
      filledFormData.fields.hosting_id.options = [
        { value: "", label: "Не выбрано" },
        hosting,
      ]
    } else {
      filledFormData.fields.hosting_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    if (domain.hosting_acc_id) {
      const hosting_acc = {
        value: String(domain.hosting_acc_id),
        label: domain.hosting_acc_name,
      }
      filledFormData.fields.hosting_acc_id.valueObj = hosting_acc
      filledFormData.fields.hosting_acc_id.options = [
        { value: "", label: "Не выбрано" },
      ]
    } else {
      filledFormData.fields.hosting_acc_id.valueObj = {
        value: "",
        label: "Не выбрано",
      }
    }

    filledFormData.fields.subdomains.valueArr = subdomains
    filledFormData.fields.ns.valueArr = ns

    filledFormData.fields.whois_status.value = domain.whois_status ? "1" : "0"
    filledFormData.fields.available_status.value = domain.available_status
      ? "1"
      : "0"
    filledFormData.fields.pagespeed_status.value = domain.pagespeed_status
      ? "1"
      : "0"
    filledFormData.fields.expirationtime_status.value =
      domain.expirationtime_status ? "1" : "0"
    filledFormData.fields.rkn_status.value = domain.rkn_status ? "1" : "0"
    filledFormData.fields.ssl_status.value = domain.ssl_status ? "1" : "0"
    filledFormData.fields.integration_registrator_status.value =
      domain.integration_registrator_status ? "1" : "0"
    filledFormData.fields.integration_cloudflare_status.value =
      domain.integration_cloudflare_status ? "1" : "0"
    filledFormData.fields.is_activated.value = domain.is_activated ? "1" : "0"
  } else {
    clearDomainForm(filledFormData)
  }
}
