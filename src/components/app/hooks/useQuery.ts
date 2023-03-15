import { useLocation } from "react-router-dom"

export const useQuery = () => {
  // Use the URLSearchParams API to extract the query parameters
  // useLocation().search will have the query parameters eg: ?foo=bar&a=b
  const loc = useLocation()
  return { route: loc.pathname, query: new URLSearchParams(loc.search) }
}
