import { apiRequest } from './client'

export type VendorStatus =
  | 'ACTIVE'
  | 'INACTIVE'

export type VendorResponse = {
  id: number
  name: string
  phone: string
  email: string
  address: string
  status: VendorStatus
}

export type CreateVendorRequest = {
  name: string
  phone: string
  email: string
  address: string
}

export type UpdateVendorRequest = {
  name?: string
  phone?: string
  email?: string
  address?: string
}

export type VendorPage = {
  content: VendorResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export type GetVendorsParams = {
  page?: number
  size?: number
  search?: string
  status?: VendorStatus
  sort?: string
}

export function getVendors(
  params: GetVendorsParams = {},
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

  return apiRequest<VendorPage>(
    `/vendors${queryString ? `?${queryString}` : ''}`,
  )
}

export function getVendorById(id: number) {
  return apiRequest<VendorResponse>(
    `/vendors/${id}`,
  )
}

export function createVendor(
  request: CreateVendorRequest,
) {
  return apiRequest<VendorResponse>(
    '/vendors',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  )
}

export function updateVendor(
  id: number,
  request: UpdateVendorRequest,
) {
  return apiRequest<VendorResponse>(
    `/vendors/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
  )
}

export function deactivateVendor(id: number) {
  return apiRequest<void>(
    `/vendors/${id}/deactivate`,
    {
      method: 'PATCH',
    },
  )
}