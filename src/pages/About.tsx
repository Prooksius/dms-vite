import { useQuery } from "@components/app/hooks/useQuery"
import React from "react"
import { useNavigate } from "react-router-dom"

const About: React.FC = () => {
  const navigate = useNavigate()
  const { route, query } = useQuery()

  const clickHandler = () => {
    navigate("/about?user=345")
  }
  return (
    <div className="page-contents">
      Путь: {route}
      <br></br>
      Параметр user: {query.get("user")}
      <h1>About Page</h1>
      <button type="button" onClick={clickHandler}>
        Go to user 345
      </button>
    </div>
  )
}

export default About
