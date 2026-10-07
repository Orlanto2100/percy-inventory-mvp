import { useCallback, useEffect, useState } from 'react'

import {
  type LocationCreateRequest,
  type LocationResponse,
  type LocationSearchParams,
  type LocationUpdateRequest,
  locationApi,
} from '../../../../api/locationApi'

export function useLocations() {
  const [locations, setLocations] =
    useState<LocationResponse[]>([])

  const [total, setTotal] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const loadLocations = useCallback(
    async (
      params?: LocationSearchParams,
    ) => {
      try {
        setLoading(true)
        setError(null)

        const response =
          await locationApi.getAll(params)

        setLocations(response.content)
        setTotal(response.totalElements)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load locations',
        )
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    loadLocations({
      page: 0,
      size: 10,
    })
  }, [loadLocations])

  const create = async (
    request: LocationCreateRequest,
  ) => {
    try {
      setSubmitting(true)
      setError(null)

      await locationApi.create(request)

      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create location',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const update = async (
    locationId: number,
    request: LocationUpdateRequest,
  ) => {
    try {
      setSubmitting(true)
      setError(null)

      await locationApi.update(
        locationId,
        request,
      )

      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update location',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const activate = async (
    locationId: number,
  ) => {
    try {
      setError(null)

      await locationApi.activate(
        locationId,
      )

      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to activate location',
      )

      return false
    }
  }

  const deactivate = async (
    locationId: number,
  ) => {
    try {
      setError(null)

      await locationApi.deactivate(
        locationId,
      )

      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to deactivate location',
      )

      return false
    }
  }

  return {
    locations,
    total,
    loading,
    submitting,
    error,
    loadLocations,
    create,
    update,
    activate,
    deactivate,
  }
}