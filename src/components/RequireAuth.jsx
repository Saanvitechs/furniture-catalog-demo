import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({ children }) {
  const email = sessionStorage.getItem('email')
  const location = useLocation()

  if (!email) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}
