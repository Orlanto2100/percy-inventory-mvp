import { apiRequest } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export type AccountType =
  | 'COMPANY'
  | 'VENDOR'
  | 'CUSTOMER'

export type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

export interface LoginResponse {
  token: string
  username: string
  accountType: AccountType
  role: Role | null
  warehouseId: number | null
  warehouseName: string | null
}

export function login(
  request: LoginRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  )
}