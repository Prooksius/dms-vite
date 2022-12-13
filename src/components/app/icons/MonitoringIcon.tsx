import React from "react"
import { SwitchIconProps } from "./SwitchIcon"

export const MonitoringIcon: React.FC<SwitchIconProps> = ({
  active,
  doSwitch,
}) => {
  if (active) {
    return (
      <div
        className="icon-tooltip-container pointer"
        onClick={(event) => doSwitch(!active)}
        title="Выключить"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
        >
          <path
            d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"
            fill="green"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="icon-tooltip-container pointer"
      onClick={(event) => doSwitch(!active)}
      title="Включить"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
      >
        <path
          d="M14,18V20H16V22H8V20H10V18H3A2,2 0 0,1 1,16V4L0,3L1.41,1.58L22.16,22.34L20.75,23.75L15,18H14M3,16H13L3,6V16M21,2A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H20.66L18.66,16H21V4H6.66L4.66,2H21Z"
          fill="grey"
        />
      </svg>
    </div>
  )
}
