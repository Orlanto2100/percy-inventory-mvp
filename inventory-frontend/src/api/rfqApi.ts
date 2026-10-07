import { apiRequest } from './client'

export type RfqStatus =
  | 'DRAFT'
  | 'SENT'
  | 'RESPONSES_RECEIVED'
  | 'AWARDED'
  | 'CLOSED'
  | 'CANCELLED'

export type RfqResponse = {
  rfqId: number
  rfqNumber: string
  title: string
  vendorCount: number
  itemCount: number
  responseDeadline: string
  status: RfqStatus
}

export type RfqItemRequest = {
  productId: number
  quantity: number
  notes?: string
}

export type CreateRfqRequest = {
  title: string
  responseDeadline: string
  description?: string
  vendorIds: number[]
  items: RfqItemRequest[]
}

export type UpdateRfqRequest = {
  title: string
  responseDeadline: string
  description?: string
  vendorIds: number[]
  items: RfqItemRequest[]
}

export type RfqEmailResponse = {
  subject: string
  message: string
}

export type RfqPageResponse = {
  content: RfqResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export type RfqQueryParams = {
  page?: number
  size?: number
  search?: string
  status?: RfqStatus
  vendorId?: number
  responseDeadline?: string
  sort?: string
}

export function getRfqs(
  params: RfqQueryParams = {},
) {
  const searchParams =
    new URLSearchParams()

  if (params.page !== undefined) {
    searchParams.set(
      'page',
      String(params.page),
    )
  }

  if (params.size !== undefined) {
    searchParams.set(
      'size',
      String(params.size),
    )
  }

  if (params.search) {
    searchParams.set(
      'search',
      params.search,
    )
  }

  if (params.status) {
    searchParams.set(
      'status',
      params.status,
    )
  }

  if (params.vendorId !== undefined) {
    searchParams.set(
      'vendorId',
      String(params.vendorId),
    )
  }

  if (params.responseDeadline) {
    searchParams.set(
      'responseDeadline',
      params.responseDeadline,
    )
  }

  if (params.sort) {
    searchParams.set(
      'sort',
      params.sort,
    )
  }

  const query =
    searchParams.toString()

  return apiRequest<RfqPageResponse>(
    `/rfqs${query ? `?${query}` : ''}`,
  )
}

export function getRfqById(id: number) {
  return apiRequest<RfqResponse>(
    `/rfqs/${id}`,
  )
}

export function createRfq(
  request: CreateRfqRequest,
) {
  return apiRequest<RfqResponse>(
    '/rfqs',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  )
}

export function updateRfq(
  id: number,
  request: UpdateRfqRequest,
) {
  return apiRequest<RfqResponse>(
    `/rfqs/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
  )
}

export function getRfqEmailPreview(
  id: number,
) {
  return apiRequest<RfqEmailResponse>(
    `/rfqs/${id}/email-preview`,
  )
}

export function deleteRfq(id: number) {
  return apiRequest<void>(
    `/rfqs/${id}`,
    {
      method: 'DELETE',
    },
  )
}

export function closeRfq(id: number) {
  return apiRequest<void>(
    `/rfqs/${id}/close`,
    {
      method: 'POST',
    },
  )
}