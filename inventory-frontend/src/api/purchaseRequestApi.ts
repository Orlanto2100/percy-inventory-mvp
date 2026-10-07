import { apiRequest } from './client'

export type PurchaseRequestStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'COMPLETED'

export interface PurchaseRequestLineRequest {
  productId?: number
  description?: string
  quantity: number
  unit: string
  requiredDate?: string
  notes?: string
}

export interface CreatePurchaseRequestRequest {
  requiredDate: string
  reason: string
  notes?: string
  warehouseId: number
  locationId?: number
  lines: PurchaseRequestLineRequest[]
}

export interface UpdatePurchaseRequestRequest {
  requiredDate: string
  reason: string
  notes?: string
  warehouseId: number
  locationId?: number
  lines: PurchaseRequestLineRequest[]
}

export interface PurchaseRequestLineResponse {
  id: number
  productId: number | null
  productName: string | null
  description: string | null
  quantity: number
  unit: string
  requiredDate: string | null
  notes: string | null
}

export interface PurchaseRequestResponse {
  id: number
  requestNo: string
  requesterId: number
  requesterName: string
  requestDate: string
  requiredDate: string
  reason: string
  notes: string | null
  warehouseId: number | null
  warehouseName: string | null
  locationId: number | null
  locationName: string | null
  status: PurchaseRequestStatus
  lines: PurchaseRequestLineResponse[]
}

export const purchaseRequestApi = {
  getAll() {
    return apiRequest<PurchaseRequestResponse[]>(
      '/purchase-requests',
    )
  },

  getById(id: number) {
    return apiRequest<PurchaseRequestResponse>(
      `/purchase-requests/${id}`,
    )
  },

  create(
    request: CreatePurchaseRequestRequest,
  ) {
    return apiRequest<PurchaseRequestResponse>(
      '/purchase-requests',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    )
  },

  update(
    id: number,
    request: UpdatePurchaseRequestRequest,
  ) {
    return apiRequest<PurchaseRequestResponse>(
      `/purchase-requests/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      },
    )
  },

  submit(id: number) {
    return apiRequest<PurchaseRequestResponse>(
      `/purchase-requests/${id}/submit`,
      {
        method: 'POST',
      },
    )
  },

  approve(id: number) {
    return apiRequest<PurchaseRequestResponse>(
      `/purchase-requests/${id}/approve`,
      {
        method: 'POST',
      },
    )
  },

  reject(id: number) {
    return apiRequest<PurchaseRequestResponse>(
      `/purchase-requests/${id}/reject`,
      {
        method: 'POST',
      },
    )
  },

  process(id: number) {
    return apiRequest<PurchaseRequestResponse>(
      `/purchase-requests/${id}/process`,
      {
        method: 'POST',
      },
    )
  },

  complete(id: number) {
    return apiRequest<PurchaseRequestResponse>(
      `/purchase-requests/${id}/complete`,
      {
        method: 'POST',
      },
    )
  },
}