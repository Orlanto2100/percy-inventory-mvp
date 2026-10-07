import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  type CreatePurchaseRequestRequest,
  type PurchaseRequestResponse,
  type UpdatePurchaseRequestRequest,
  purchaseRequestApi,
} from '../../../../api/purchaseRequestApi'

export function usePurchaseRequests() {
  const [
    purchaseRequests,
    setPurchaseRequests,
  ] = useState<PurchaseRequestResponse[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadPurchaseRequests =
    useCallback(async () => {
      try {
        setLoading(true)
        setError(null)

        const data =
          await purchaseRequestApi.getAll()

        setPurchaseRequests(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load purchase requests'
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadPurchaseRequests()
  }, [loadPurchaseRequests])

  const createPurchaseRequest = async (
    request: CreatePurchaseRequestRequest
  ) => {
    const created =
      await purchaseRequestApi.create(request)

    setPurchaseRequests((current) => [
      ...current,
      created,
    ])

    return created
  }

  const updatePurchaseRequest = async (
    id: number,
    request: UpdatePurchaseRequestRequest
  ) => {
    const updated =
      await purchaseRequestApi.update(
        id,
        request
      )

    setPurchaseRequests((current) =>
      current.map((purchaseRequest) =>
        purchaseRequest.id === id
          ? updated
          : purchaseRequest
      )
    )

    return updated
  }

  const updatePurchaseRequestState = (
    updated: PurchaseRequestResponse
  ) => {
    setPurchaseRequests((current) =>
      current.map((purchaseRequest) =>
        purchaseRequest.id === updated.id
          ? updated
          : purchaseRequest
      )
    )
  }

  const submitPurchaseRequest = async (
    id: number
  ) => {
    const updated =
      await purchaseRequestApi.submit(id)

    updatePurchaseRequestState(updated)

    return updated
  }

  const approvePurchaseRequest = async (
    id: number
  ) => {
    const updated =
      await purchaseRequestApi.approve(id)

    updatePurchaseRequestState(updated)

    return updated
  }

  const rejectPurchaseRequest = async (
    id: number
  ) => {
    const updated =
      await purchaseRequestApi.reject(id)

    updatePurchaseRequestState(updated)

    return updated
  }

  const processPurchaseRequest = async (
    id: number
  ) => {
    const updated =
      await purchaseRequestApi.process(id)

    updatePurchaseRequestState(updated)

    return updated
  }

  const completePurchaseRequest = async (
    id: number
  ) => {
    const updated =
      await purchaseRequestApi.complete(id)

    updatePurchaseRequestState(updated)

    return updated
  }

  return {
    purchaseRequests,
    loading,
    error,

    loadPurchaseRequests,

    createPurchaseRequest,
    updatePurchaseRequest,

    submitPurchaseRequest,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    processPurchaseRequest,
    completePurchaseRequest,
  }
}