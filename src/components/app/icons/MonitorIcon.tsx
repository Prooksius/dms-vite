import React from "react"

interface MonitorIconProps {
  active: boolean
  message: string
  doSwitch: (condition: boolean) => void
}
export const MonitorIcon: React.FC<MonitorIconProps> = ({
  active,
  message,
  doSwitch,
}) => {
  const messageText = message ? new Date(message).toLocaleString() : "-"

  return (
    <div
      className="icon-tooltip-container pointer"
      data-tip={"Статус сервера" + "###" + messageText}
      data-for="for-monitoring"
      onClick={(event) => doSwitch(!active)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="30"
        viewBox="0 0 22.4 12.5"
      >
        <path
          className="transition-figure"
          d="M16.2,1.3h-10c-2.8,0-5,2.2-5,5s2.2,5,5,5h10c2.8,0,5-2.2,5-5S18.9,1.3,16.2,1.3"
          fill={active ? "green" : "grey"}
        />
        <circle
          className="transition-figure"
          cx={active ? 15.8 : 6.5}
          cy="6.3"
          r="3"
          fill="#ffffff"
        />
      </svg>
    </div>
  )
}
