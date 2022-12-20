import React from "react"

interface AvailableIconProps {
  active: boolean
  condition: string
  lastUpdate: string
}

export const AvailableIcon: React.FC<AvailableIconProps> = ({
  active,
  condition,
  lastUpdate,
}) => {
  const lastUpdateText = lastUpdate
    ? new Date(lastUpdate).toLocaleString()
    : "-"

  if (active) {
    return (
      <div
        className="icon-tooltip-container"
        data-tip={
          "Проверка доступности" +
          "###" +
          (condition ? condition : "-") +
          "###" +
          lastUpdateText
        }
        data-for="for-monitoring"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="28px"
          height="28px"
        >
          <path
            fill="#4caf50"
            d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
          />
          <path
            fill="#ccff90"
            d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="icon-tooltip-container"
      data-tip={
        "Проверка доступности" +
        "###" +
        (condition ? condition : "-") +
        "###" +
        lastUpdateText
      }
      data-for="for-monitoring"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="28px"
        height="28px"
      >
        <path
          fill="#777777"
          d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"
        />
        <line
          x1="16.9"
          x2="31.1"
          y1="16.9"
          y2="31.1"
          fill="none"
          stroke="#fff"
          strokeMiterlimit="10"
          strokeWidth="4"
        />
        <line
          x1="31.1"
          x2="16.9"
          y1="16.9"
          y2="31.1"
          fill="none"
          stroke="#fff"
          strokeMiterlimit="10"
          strokeWidth="4"
        />
      </svg>
    </div>
  )
}
