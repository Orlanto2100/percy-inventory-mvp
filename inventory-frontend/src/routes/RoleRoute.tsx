import { Navigate, Outlet } from 'react-router-dom'

export type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

interface RoleRouteProps {
  allowedRoles: Role[]
}

export default function RoleRoute({
  allowedRoles,
}: RoleRouteProps) {
  const role = localStorage.getItem('role') as Role | null

  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}