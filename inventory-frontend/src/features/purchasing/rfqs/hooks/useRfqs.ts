import { useEffect, useState } from 'react'
import { message } from 'antd'

import {
  createRfq,
  deleteRfq,
  getRfqs,
  updateRfq,
  closeRfq,
  type CreateRfqRequest,
  type RfqResponse,
  type UpdateRfqRequest,
} from '../../../../api/rfqApi'

export function useRfqs() {
  const [rfqs, setRfqs] =
    useState<RfqResponse[]>([])

  const [loading, setLoading] =
    useState(false)

  const [submitting, setSubmitting] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const loadRfqs = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getRfqs()

      setRfqs(data.content)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load RFQs.'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRfqs()
  }, [])

  const create = async (
    values: CreateRfqRequest,
  ): Promise<boolean> => {
    try {
      setSubmitting(true)

      const newRfq =
        await createRfq(values)

      setRfqs((currentRfqs) => [
        newRfq,
        ...currentRfqs,
      ])

      message.success(
        'RFQ created and sent successfully.',
      )

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create and send RFQ.'

      message.error(errorMessage)

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const update = async (
    rfqId: number,
    values: UpdateRfqRequest,
  ): Promise<boolean> => {
    try {
      setSubmitting(true)

      const updatedRfq =
        await updateRfq(
          rfqId,
          values,
        )

      setRfqs(
        (currentRfqs) =>
          currentRfqs.map((rfq) =>
            rfq.rfqId === rfqId
              ? updatedRfq
              : rfq,
          ),
      )

      message.success(
        'RFQ updated successfully.',
      )

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update RFQ.'

      message.error(errorMessage)

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (
    rfqId: number,
  ): Promise<boolean> => {
    try {
      setDeletingId(rfqId)

      await deleteRfq(rfqId)

      setRfqs(
        (currentRfqs) =>
          currentRfqs.filter(
            (rfq) =>
              rfq.rfqId !== rfqId,
          ),
      )

      message.success(
        'RFQ deleted successfully.',
      )

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete RFQ.'

      message.error(errorMessage)

      return false
    } finally {
      setDeletingId(null)
    }
  }

  const close = async (
    rfqId: number,
  ): Promise<boolean> => {
    try {
      setSubmitting(true)

      await closeRfq(rfqId)

      setRfqs(
        (currentRfqs) =>
          currentRfqs.map((rfq) =>
            rfq.rfqId === rfqId
              ? {
                  ...rfq,
                  status: 'CLOSED',
                }
              : rfq,
          ),
      )

      message.success(
        'RFQ closed successfully.',
      )

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to close RFQ.'

      message.error(errorMessage)

      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    rfqs,
    loading,
    submitting,
    deletingId,
    error,
    loadRfqs,
    create,
    update,
    remove,
    close,
  }
}