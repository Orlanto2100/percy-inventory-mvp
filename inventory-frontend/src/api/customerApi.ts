import { apiRequest } from './client'

export type CustomerResponse = {
  customerId: number
  name: string
  phone: string
  email: string | null
  address: string | null
}

export type CreateCustomerRequest = {
  name: string
  phone: string
  email?: string
  address?: string
}

export type UpdateCustomerRequest = {
  name?: string
  phone?: string
  email?: string
  address?: string
}

export function getCustomers() {
  return apiRequest<CustomerResponse[]>('/customers')
}

export function getCustomerById(id: number) {
  return apiRequest<CustomerResponse>(
    `/customers/${id}`,
  )
}

export function createCustomer(
  request: CreateCustomerRequest,
) {
  return apiRequest<CustomerResponse>('/customers', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function updateCustomer(
  id: number,
  request: UpdateCustomerRequest,
) {
  return apiRequest<CustomerResponse>(
    `/customers/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
  )
}

export function deleteCustomer(id: number) {
  return apiRequest<void>(`/customers/${id}`, {
    method: 'DELETE',
  })
}