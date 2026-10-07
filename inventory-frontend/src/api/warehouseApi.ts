import { apiRequest } from './client'

export type WarehouseStatus =
  | 'ACTIVE'
  | 'INACTIVE'

export type WarehouseResponse = {
  warehouseId: number
  code: string
  name: string
  address: string | null
  city: string | null
  phoneNumber: string | null
  email: string | null
  status: WarehouseStatus
}

export type CreateWarehouseRequest = {
  code: string
  name: string
  address?: string
  city?: string
  phoneNumber?: string
  email?: string
}

export type UpdateWarehouseRequest = {
  code?: string
  name?: string
  address?: string
  city?: string
  phoneNumber?: string
  email?: string
}

export type WarehousePage = {
  content: WarehouseResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export type GetWarehousesParams = {
  page?: number
  size?: number
  search?: string
  status?: WarehouseStatus
  sort?: string
}

export function getWarehouses(
  params: GetWarehousesParams = {},
) {
  const query = new URLSearchParams()

  if (params.page !== undefined) {
    query.set('page', String(params.page))
  }

  if (params.size !== undefined) {
    query.set('size', String(params.size))
  }

  if (params.search) {
    query.set('search', params.search)
  }

  if (params.status) {
    query.set('status', params.status)
  }

  if (params.sort) {
    query.set('sort', params.sort)
  }

  const queryString = query.toString()

  return apiRequest<WarehousePage>(
    `/warehouses${queryString ? `?${queryString}` : ''}`,
  )
}

export function getWarehouseById(id: number) {
  return apiRequest<WarehouseResponse>(
    `/warehouses/${id}`,
  )
}

export function createWarehouse(
  request: CreateWarehouseRequest,
) {
  return apiRequest<WarehouseResponse>(
    '/warehouses',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  )
}

export function updateWarehouse(
  id: number,
  request: UpdateWarehouseRequest,
) {
  return apiRequest<WarehouseResponse>(
    `/warehouses/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
  )
}

export function activateWarehouse(id: number) {
  return apiRequest<void>(
    `/warehouses/${id}/activate`,
    {
      method: 'PATCH',
    },
  )
}

export function deactivateWarehouse(id: number) {
  return apiRequest<void>(
    `/warehouses/${id}/deactivate`,
    {
      method: 'PATCH',
    },
  )
}