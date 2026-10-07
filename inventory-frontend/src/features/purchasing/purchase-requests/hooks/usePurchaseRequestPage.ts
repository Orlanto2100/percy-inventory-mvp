import {
  message,
} from 'antd'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  PurchaseRequestResponse,
  PurchaseRequestStatus,
} from '../../../../api/purchaseRequestApi'

import {
  getWarehouses,
  type WarehouseResponse,
} from '../../../../api/warehouseApi'

import {
  getProducts,
  type ProductResponse,
} from '../../../../api/productApi'

import { usePurchaseRequests } from './usePurchaseRequests'

type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

type SelectOption = {
  value: number
  label: string
}

export function usePurchaseRequestPage() {
  const {
    purchaseRequests,
    loading,
    error,
    createPurchaseRequest,
    updatePurchaseRequest,
    submitPurchaseRequest,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    processPurchaseRequest,
    completePurchaseRequest,
  } = usePurchaseRequests()

  const [search, setSearch] = useState('')

  const [status, setStatus] =
    useState<PurchaseRequestStatus | undefined>()

  const [formOpen, setFormOpen] = useState(false)

  const [formLoading, setFormLoading] =
    useState(false)

  const [detailsOpen, setDetailsOpen] =
    useState(false)

  const [
    selectedPurchaseRequest,
    setSelectedPurchaseRequest,
  ] =
    useState<PurchaseRequestResponse | null>(null)

  const [warehouses, setWarehouses] =
    useState<WarehouseResponse[]>([])

  const [
    warehousesLoading,
    setWarehousesLoading,
  ] = useState(false)

  const [products, setProducts] =
    useState<ProductResponse[]>([])

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(false)

  const role =
    localStorage.getItem('role') as Role | null

  const userId = Number(
    localStorage.getItem('userId')
  )

  const assignedWarehouseId = Number(
    localStorage.getItem('warehouseId')
  )

  const hasAssignedWarehouse =
    Number.isInteger(assignedWarehouseId) &&
    assignedWarehouseId > 0

  useEffect(() => {
    const loadWarehouses = async () => {
      setWarehousesLoading(true)

      try {
        const response = await getWarehouses({
          page: 0,
          size: 100,
          status: 'ACTIVE',
        })

        setWarehouses(response.content)
      } catch (err) {
        message.error(
          err instanceof Error
            ? err.message
            : 'Failed to load warehouses'
        )
      } finally {
        setWarehousesLoading(false)
      }
    }

    loadWarehouses()
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true)

      try {
        const response = await getProducts()

        setProducts(response)
      } catch (err) {
        message.error(
          err instanceof Error
            ? err.message
            : 'Failed to load products'
        )
      } finally {
        setProductsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const warehouseOptions = useMemo(
    (): SelectOption[] => {
      if (role === 'ADMIN') {
        return warehouses.map((warehouse) => ({
          value: warehouse.warehouseId,
          label:
            `${warehouse.code} - ${warehouse.name}`,
        }))
      }

      if (
        role === 'WAREHOUSE_STAFF' &&
        hasAssignedWarehouse
      ) {
        return warehouses
          .filter(
            (warehouse) =>
              warehouse.warehouseId ===
              assignedWarehouseId
          )
          .map((warehouse) => ({
            value: warehouse.warehouseId,
            label:
              `${warehouse.code} - ${warehouse.name}`,
          }))
      }

      if (role === 'PURCHASING_STAFF') {
        return warehouses.map((warehouse) => ({
          value: warehouse.warehouseId,
          label:
            `${warehouse.code} - ${warehouse.name}`,
        }))
      }

      return []
    },
    [
      role,
      warehouses,
      assignedWarehouseId,
      hasAssignedWarehouse,
    ]
  )

  const productOptions = useMemo(
    (): SelectOption[] =>
      products.map((product) => ({
        value: product.productId,
        label:
          `${product.productName} (${product.sku})`,
      })),
    [products]
  )

  const filteredPurchaseRequests = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim()

    return purchaseRequests.filter(
      (purchaseRequest) => {
        const matchesSearch =
          !searchValue ||
          purchaseRequest.requestNo
            .toLowerCase()
            .includes(searchValue) ||
          purchaseRequest.requesterName
            .toLowerCase()
            .includes(searchValue)

        const matchesStatus =
          !status ||
          purchaseRequest.status === status

        return (
          matchesSearch &&
          matchesStatus
        )
      }
    )
  }, [
    purchaseRequests,
    search,
    status,
  ])

  const handleFormSubmit = async (
    values: Parameters<
      typeof createPurchaseRequest
    >[0]
  ) => {
    setFormLoading(true)

    try {
      if (selectedPurchaseRequest) {
        await updatePurchaseRequest(
          selectedPurchaseRequest.id,
          values
        )

        message.success(
          'Purchase request updated successfully'
        )
      } else {
        await createPurchaseRequest(values)

        message.success(
          'Purchase request created successfully'
        )
      }

      setFormOpen(false)
      setSelectedPurchaseRequest(null)
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : selectedPurchaseRequest
            ? 'Failed to update purchase request'
            : 'Failed to create purchase request'
      )
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmit = async (
    id: number
  ) => {
    try {
      await submitPurchaseRequest(id)

      message.success(
        'Purchase request submitted'
      )
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : 'Failed to submit purchase request'
      )
    }
  }

  const handleApprove = async (
    id: number
  ) => {
    try {
      await approvePurchaseRequest(id)

      message.success(
        'Purchase request approved'
      )
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : 'Failed to approve purchase request'
      )
    }
  }

  const handleReject = async (
    id: number
  ) => {
    try {
      await rejectPurchaseRequest(id)

      message.success(
        'Purchase request rejected'
      )
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : 'Failed to reject purchase request'
      )
    }
  }

  const handleProcess = async (
    id: number
  ) => {
    try {
      await processPurchaseRequest(id)

      message.success(
        'Purchase request is now processing'
      )
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : 'Failed to process purchase request'
      )
    }
  }

  const handleComplete = async (
    id: number
  ) => {
    try {
      await completePurchaseRequest(id)

      message.success(
        'Purchase request completed'
      )
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : 'Failed to complete purchase request'
      )
    }
  }

  const handleView = (
    record: PurchaseRequestResponse
  ) => {
    setSelectedPurchaseRequest(record)
    setDetailsOpen(true)
  }

  const handleEdit = (
    record: PurchaseRequestResponse
  ) => {
    setSelectedPurchaseRequest(record)
    setFormOpen(true)
  }

  const handleCreateForm = () => {
    setSelectedPurchaseRequest(null)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedPurchaseRequest(null)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedPurchaseRequest(null)
  }

  const canEdit = (
    record: PurchaseRequestResponse
  ) => {
    if (record.status !== 'DRAFT') {
      return false
    }

    if (role === 'ADMIN') {
      return true
    }

    if (
      role !== 'WAREHOUSE_STAFF' &&
      role !== 'PURCHASING_STAFF'
    ) {
      return false
    }

    return record.requesterId === userId
  }

  const canSubmit = (
    record: PurchaseRequestResponse
  ) => {
    if (record.status !== 'DRAFT') {
      return false
    }

    if (role === 'ADMIN') {
      return true
    }

    if (
      role !== 'WAREHOUSE_STAFF' &&
      role !== 'PURCHASING_STAFF'
    ) {
      return false
    }

    return record.requesterId === userId
  }

  const canApproveOrReject =
    role === 'ADMIN' ||
    role === 'PURCHASING_STAFF'

  const canProcessOrComplete =
    role === 'ADMIN' ||
    role === 'PURCHASING_STAFF'

  const canCreate =
    role === 'ADMIN' ||
    (
      role === 'WAREHOUSE_STAFF' &&
      hasAssignedWarehouse
    ) ||
    role === 'PURCHASING_STAFF'

  return {
    purchaseRequests:
      filteredPurchaseRequests,

    loading,
    error,

    search,
    status,
    setSearch,
    setStatus,

    formOpen,
    formLoading,

    detailsOpen,

    selectedPurchaseRequest,

    warehousesLoading,
    productsLoading,

    warehouseOptions,
    productOptions,

    role,

    assignedWarehouseId:
      hasAssignedWarehouse
        ? assignedWarehouseId
        : undefined,

    permissions: {
      canCreate,
      canApproveOrReject,
      canProcessOrComplete,
      canEdit,
      canSubmit,
    },

    handleFormSubmit,
    handleSubmit,
    handleApprove,
    handleReject,
    handleProcess,
    handleComplete,

    handleView,
    handleEdit,

    handleCreateForm,
    handleCloseForm,
    handleCloseDetails,
  }
}