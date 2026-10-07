import type {
  PurchaseRequestResponse,
} from '../../../../api/purchaseRequestApi'

export type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

export function canEditPurchaseRequest(
  request: PurchaseRequestResponse,
  role: Role,
): boolean {
  if (role === 'ADMIN') {
    return request.status === 'DRAFT'
  }

  if (role === 'WAREHOUSE_STAFF') {
    return request.status === 'DRAFT'
  }

  return false
}

export function canSubmitPurchaseRequest(
  request: PurchaseRequestResponse,
  role: Role,
): boolean {
  if (
    role !== 'ADMIN' &&
    role !== 'WAREHOUSE_STAFF' &&
    role !== 'PURCHASING_STAFF'
  ) {
    return false
  }

  return request.status === 'DRAFT'
}

export function canApprovePurchaseRequest(
  request: PurchaseRequestResponse,
  role: Role,
): boolean {
  if (
    role !== 'ADMIN' &&
    role !== 'PURCHASING_STAFF'
  ) {
    return false
  }

  return request.status === 'PENDING_APPROVAL'
}

export function canRejectPurchaseRequest(
  request: PurchaseRequestResponse,
  role: Role,
): boolean {
  if (
    role !== 'ADMIN' &&
    role !== 'PURCHASING_STAFF'
  ) {
    return false
  }

  return request.status === 'PENDING_APPROVAL'
}

export function canProcessPurchaseRequest(
  request: PurchaseRequestResponse,
  role: Role,
): boolean {
  if (
    role !== 'ADMIN' &&
    role !== 'PURCHASING_STAFF'
  ) {
    return false
  }

  return request.status === 'APPROVED'
}

export function canCompletePurchaseRequest(
  request: PurchaseRequestResponse,
  role: Role,
): boolean {
  if (
    role !== 'ADMIN' &&
    role !== 'PURCHASING_STAFF'
  ) {
    return false
  }

  return request.status === 'PROCESSING'
}

export function canViewPurchaseRequest(
  _request: PurchaseRequestResponse,
  _role: Role,
): boolean {
  return true
}

export function canPerformPurchaseRequestAction(
  request: PurchaseRequestResponse,
  role: Role,
  action:
    | 'EDIT'
    | 'SUBMIT'
    | 'APPROVE'
    | 'REJECT'
    | 'PROCESS'
    | 'COMPLETE',
): boolean {
  switch (action) {
    case 'EDIT':
      return canEditPurchaseRequest(request, role)

    case 'SUBMIT':
      return canSubmitPurchaseRequest(request, role)

    case 'APPROVE':
      return canApprovePurchaseRequest(request, role)

    case 'REJECT':
      return canRejectPurchaseRequest(request, role)

    case 'PROCESS':
      return canProcessPurchaseRequest(request, role)

    case 'COMPLETE':
      return canCompletePurchaseRequest(request, role)

    default:
      return false
  }
}