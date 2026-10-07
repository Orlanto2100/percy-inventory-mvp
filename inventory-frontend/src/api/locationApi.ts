import { apiRequest } from './client'

export type LocationType =
  | 'STORAGE'
  | 'RECEIVING'
  | 'SHIPPING'
  | 'QUARANTINE'

export type LocationStatus =
  | 'ACTIVE'
  | 'INACTIVE'

export interface LocationCreateRequest {
  name: string
  code: string
  type: LocationType
  warehouseId: number
}

export interface LocationUpdateRequest {
  name?: string
  code?: string
  type?: LocationType
}

export interface LocationResponse {
  locationId: number
  name: string
  code: string
  type: LocationType
  status: LocationStatus
  warehouseId: number
  warehouseName: string
}

export interface LocationSearchParams {
  search?: string
  type?: LocationType
  status?: LocationStatus
  warehouseId?: number
  page?: number
  size?: number
  sort?: string
}

export interface LocationPageResponse {
  content: LocationResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

const BASE_URL = '/locations'

export const locationApi = {
  getAll(
    params?: LocationSearchParams,
  ): Promise<LocationPageResponse> {
    const searchParams = new URLSearchParams()

    if (params?.search) {
      searchParams.set('search', params.search)
    }

    if (params?.type) {
      searchParams.set('type', params.type)
    }

    if (params?.status) {
      searchParams.set('status', params.status)
    }

    if (params?.warehouseId !== undefined) {
      searchParams.set(
        'warehouseId',
        String(params.warehouseId),
      )
    }

    if (params?.page !== undefined) {
      searchParams.set(
        'page',
        String(params.page),
      )
    }

    if (params?.size !== undefined) {
      searchParams.set(
        'size',
        String(params.size),
      )
    }

    if (params?.sort) {
      searchParams.set(
        'sort',
        params.sort,
      )
    }

    const query =
      searchParams.toString()

    return apiRequest(
      query
        ? `${BASE_URL}?${query}`
        : BASE_URL,
    )
  },

  getById(
    locationId: number,
  ): Promise<LocationResponse> {
    return apiRequest(
      `${BASE_URL}/${locationId}`,
    )
  },

  create(
    request: LocationCreateRequest,
  ): Promise<LocationResponse> {
    return apiRequest(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  update(
    locationId: number,
    request: LocationUpdateRequest,
  ): Promise<LocationResponse> {
    return apiRequest(
      `${BASE_URL}/${locationId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(request),
      },
    )
  },

  activate(
    locationId: number,
  ): Promise<void> {
    return apiRequest(
      `${BASE_URL}/${locationId}/activate`,
      {
        method: 'PATCH',
      },
    )
  },

  deactivate(
    locationId: number,
  ): Promise<void> {
    return apiRequest(
      `${BASE_URL}/${locationId}/deactivate`,
      {
        method: 'PATCH',
      },
    )
  },
}