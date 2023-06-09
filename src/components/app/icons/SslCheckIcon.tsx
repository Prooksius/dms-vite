import React from "react"

interface SslCheckIconProps {
  enabled: boolean
  condition: string
  lastUpdate: string
}
export const SslCheckIcon: React.FC<SslCheckIconProps> = ({
  enabled,
  condition,
  lastUpdate,
}) => {
  const lastUpdateText = lastUpdate
    ? new Date(lastUpdate).toLocaleString()
    : "-"

  const conditionText = condition ? new Date(condition).toLocaleString() : "-"

  return (
    <div
      className="icon-tooltip-container"
      data-tip={"Проверка SSL" + "###" + conditionText + "###" + lastUpdateText}
      data-for="for-monitoring"
    >
      <svg
        width="25"
        height="25"
        viewBox="0 0 1010 1010"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={enabled ? "#FC6220" : "#777777"}
          d="M505,0c278.9,0,505,226.12,505,505s-226.1,505-505,505S0,783.9,0,505,226.11,0,505,0Z"
        />
        <path
          fill="#FFFFFF"
          d="M770.34,373.22V299.35c0-129.35-119.59-234.58-266.6-234.58S237.13,170,237.13,299.35v73.87H177.9V849.07H829.57V373.22ZM355.63,299.35c0-69.83,67.86-128.83,148.1-128.83s148.1,59,148.1,128.83v73.87H355.63Zm-.51,446.42c-42.74,0-64.88-22.59-64.88-62.12v-15.2h41.15V686.1c0,17.65,8.69,24,22.53,24s22.57-6.36,22.57-24c0-50.82-85-60.36-85-131,0-39.54,21.76-62.14,64.06-62.14s64.09,22.6,64.09,62.14v7.77H378.46V552.66c0-17.64-7.92-24.36-21.76-24.36s-21.75,6.72-21.75,24.36c0,50.84,85,60.37,85,131C420,723.18,397.83,745.77,355.12,745.77Zm167.67,0c-42.72,0-64.88-22.59-64.88-62.12v-15.2H499V686.1c0,17.65,8.71,24,22.57,24s22.53-6.36,22.53-24c0-50.82-85-60.36-85-131,0-39.54,21.75-62.14,64.09-62.14s64.09,22.6,64.09,62.14v7.77H546.11V552.66c0-17.64-7.9-24.36-21.76-24.36S502.6,535,502.6,552.66c0,50.84,85,60.37,85,131C587.64,723.18,565.5,745.77,522.79,745.77ZM747.42,743H632.31V495.83h43.51V707.65h71.6Z"
        />
      </svg>
    </div>
  )
}
