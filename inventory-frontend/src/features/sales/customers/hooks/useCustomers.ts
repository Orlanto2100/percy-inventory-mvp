import { useEffect, useState } from 'react'
import { message } from 'antd'

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
  type CustomerResponse,
} from '../../../../api/customerApi'

export type CreateCustomerValues = {
  name: string
  phone: string
  email?: string
  address?: string
}

export type UpdateCustomerValues = {
  name: string
  phone: string
  email?: string
  address?: string
}

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getCustomers()

      setCustomers(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load customers.'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const create = async (
    values: CreateCustomerValues,
  ): Promise<boolean> => {
    try {
      setSubmitting(true)

      const newCustomer = await createCustomer(values)

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        newCustomer,
      ])

      message.success('Customer created successfully.')

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create customer.'

      message.error(errorMessage)

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const update = async (
    customerId: number,
    values: UpdateCustomerValues,
  ): Promise<boolean> => {
    try {
      setSubmitting(true)

      const updatedCustomer = await updateCustomer(
        customerId,
        values,
      )

      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.customerId === customerId
            ? updatedCustomer
            : customer,
        ),
      )

      message.success('Customer updated successfully.')

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update customer.'

      message.error(errorMessage)

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (
    customerId: number,
  ): Promise<boolean> => {
    try {
      setDeletingId(customerId)

      await deleteCustomer(customerId)

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (customer) => customer.customerId !== customerId,
        ),
      )

      message.success('Customer deleted successfully.')

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete customer.'

      message.error(errorMessage)

      return false
    } finally {
      setDeletingId(null)
    }
  }

  return {
    customers,
    loading,
    submitting,
    deletingId,
    error,
    loadCustomers,
    create,
    update,
    remove,
  }
}