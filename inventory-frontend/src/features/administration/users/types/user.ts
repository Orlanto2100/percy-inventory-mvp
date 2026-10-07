export type AccountType =
  | 'COMPANY'
  | 'VENDOR'
  | 'CUSTOMER'

export type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'

export interface User {
  id: number
  username: string
  fullName: string
  email: string | null
  accountType: AccountType
  role: Role | null
  warehouseId: number | null
  status: UserStatus
}

export interface CreateUserRequest {
  username: string
  password: string
  fullName: string
  email?: string | null

  accountType: AccountType

  role?: Role | null

  warehouseId?: number | null
}