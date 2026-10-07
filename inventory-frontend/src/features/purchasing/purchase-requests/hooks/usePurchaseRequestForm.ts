import { message } from 'antd'
import dayjs from 'dayjs'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  CreatePurchaseRequestRequest,
  PurchaseRequestResponse,
} from '../../../../api/purchaseRequestApi'

import {
  locationApi,
  type LocationResponse,
} from '../../../../api/locationApi'

type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

interface Option {
  value: number
  label: string
}

export interface PurchaseRequestFormValues {
  requiredDate: dayjs.Dayjs
  reason: string
  notes?: string
  warehouseId: number
  locationId?: number
  lines: {
    productId?: number
    description?: string
    quantity: number
    unit: string
    requiredDate?: dayjs.Dayjs
    notes?: string
  }[]
}

interface UsePurchaseRequestFormProps {
  open: boolean
  purchaseRequest?: PurchaseRequestResponse | null
  role: Role | null
  assignedWarehouseId?: number
  warehouseOptions: Option[]
  selectedWarehouseId?: number
}

export function usePurchaseRequestForm({
  open,
  purchaseRequest,
  role,
  assignedWarehouseId,
  warehouseOptions,
  selectedWarehouseId,
}: UsePurchaseRequestFormProps) {
  const [locations, setLocations] =
    useState<LocationResponse[]>([])

  const [locationsLoading, setLocationsLoading] =
    useState(false)

  const isEditing =
    Boolean(purchaseRequest)

  const isWarehouseStaff =
    role === 'WAREHOUSE_STAFF'

  const initialWarehouseId =
    purchaseRequest?.warehouseId ??
    (isWarehouseStaff
      ? assignedWarehouseId
      : undefined)

  const locationOptions = useMemo(
    (): Option[] =>
      locations.map((location) => ({
        value: location.locationId,
        label:
          `${location.code} - ${location.name}`,
      })),
    [locations]
  )

  const initialValues: PurchaseRequestFormValues =
    purchaseRequest
      ? {
          requiredDate: dayjs(
            purchaseRequest.requiredDate
          ),
          reason:
            purchaseRequest.reason,
          notes:
            purchaseRequest.notes ??
            undefined,
          warehouseId:
            purchaseRequest.warehouseId ??
            0,
          locationId:
            purchaseRequest.locationId ??
            undefined,
          lines:
            purchaseRequest.lines.map(
              (line) => ({
                productId:
                  line.productId ??
                  undefined,
                description:
                  line.description ??
                  undefined,
                quantity:
                  line.quantity,
                unit:
                  line.unit,
                requiredDate:
                  line.requiredDate
                    ? dayjs(
                        line.requiredDate
                      )
                    : undefined,
                notes:
                  line.notes ??
                  undefined,
              })
            ),
        }
      : {
          requiredDate: dayjs(),
          reason: '',
          notes: undefined,
          warehouseId:
            initialWarehouseId ?? 0,
          locationId: undefined,
          lines: [
            {
              productId: undefined,
              description: undefined,
              quantity: 1,
              unit: 'PCS',
              requiredDate: undefined,
              notes: undefined,
            },
          ],
        }

  /*
   * Load locations whenever the actual
   * warehouse selected in the form changes.
   */
  useEffect(() => {
    if (
      !open ||
      !selectedWarehouseId ||
      selectedWarehouseId <= 0
    ) {
      setLocations([])
      setLocationsLoading(false)
      return
    }

    let cancelled = false

    const loadLocations = async () => {
      setLocationsLoading(true)

      try {
        const response =
          await locationApi.getAll({
            warehouseId:
              selectedWarehouseId,
            status: 'ACTIVE',
            page: 0,
            size: 100,
          })

        if (!cancelled) {
          setLocations(
            response.content ?? []
          )
        }
      } catch (err) {
        if (!cancelled) {
          setLocations([])

          message.error(
            err instanceof Error
              ? err.message
              : 'Failed to load locations'
          )
        }
      } finally {
        if (!cancelled) {
          setLocationsLoading(false)
        }
      }
    }

    loadLocations()

    return () => {
      cancelled = true
    }
  }, [
    open,
    selectedWarehouseId,
  ])

  const handleWarehouseChange =
    () => {
      /*
       * The useEffect above will automatically
       * reload locations because
       * selectedWarehouseId changes.
       */
    }

  const getWarehouseOptions =
    (): Option[] => {
      if (
        role === 'WAREHOUSE_STAFF'
      ) {
        return warehouseOptions.filter(
          (warehouse) =>
            warehouse.value ===
            assignedWarehouseId
        )
      }

      return warehouseOptions
    }

  const prepareRequest = (
    values: PurchaseRequestFormValues
  ): CreatePurchaseRequestRequest => ({
    requiredDate:
      values.requiredDate.format(
        'YYYY-MM-DD'
      ),

    reason:
      values.reason,

    notes:
      values.notes,

    warehouseId:
      values.warehouseId,

    locationId:
      values.locationId,

    lines:
      values.lines.map(
        (line) => ({
          productId:
            line.productId,

          description:
            line.description,

          quantity:
            line.quantity,

          unit:
            line.unit,

          requiredDate:
            line.requiredDate?.format(
              'YYYY-MM-DD'
            ),

          notes:
            line.notes,
        })
      ),
  })

  return {
    isEditing,
    isWarehouseStaff,
    initialValues,

    locationsLoading,
    locationOptions,

    getWarehouseOptions,
    handleWarehouseChange,
    prepareRequest,
  }
}