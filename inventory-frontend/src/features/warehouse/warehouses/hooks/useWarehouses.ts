import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  activateWarehouse,
  createWarehouse,
  deactivateWarehouse,
  getWarehouses,
  updateWarehouse,
  type CreateWarehouseRequest,
  type GetWarehousesParams,
  type UpdateWarehouseRequest,
  type WarehouseResponse,
  type WarehouseStatus,
} from '../../../../api/warehouseApi'

export function useWarehouses() {
  const [warehouses, setWarehouses] =
    useState<WarehouseResponse[]>([])

  const [loading, setLoading] =
    useState(false)

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [search, setSearch] =
    useState('')

  const [status, setStatus] =
    useState<WarehouseStatus | undefined>()

  const [page, setPage] =
    useState(0)

  const [pageSize, setPageSize] =
    useState(10)

  const [sort, setSort] =
    useState<string | undefined>()

  const [total, setTotal] =
    useState(0)

  const loadWarehouses = useCallback(
    async (
      currentPage = page,
      currentPageSize = pageSize,
      currentSearch = search,
      currentStatus = status,
      currentSort = sort,
    ) => {
      setLoading(true)
      setError(null)

      try {
        const params: GetWarehousesParams = {
          page: currentPage,
          size: currentPageSize,
          search:
            currentSearch || undefined,
          status: currentStatus,
          sort: currentSort,
        }

        const response =
          await getWarehouses(params)

        setWarehouses(response.content)
        setTotal(response.totalElements)
      } catch (error) {
        console.error(
          'REQUEST ERROR:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load warehouses',
        )
      } finally {
        setLoading(false)
      }
    },
    [
      page,
      pageSize,
      search,
      status,
      sort,
    ],
  )

  useEffect(() => {
    loadWarehouses()
  }, [loadWarehouses])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(0)

    loadWarehouses(
      0,
      pageSize,
      value,
      status,
      sort,
    )
  }

  function handleStatusChange(
    value: WarehouseStatus | undefined,
  ) {
    setStatus(value)
    setPage(0)

    loadWarehouses(
      0,
      pageSize,
      search,
      value,
      sort,
    )
  }

  function handlePageChange(
    newPage: number,
    newPageSize: number,
  ) {
    const nextPage =
      newPageSize !== pageSize
        ? 0
        : newPage - 1

    setPage(nextPage)
    setPageSize(newPageSize)

    loadWarehouses(
      nextPage,
      newPageSize,
      search,
      status,
      sort,
    )
  }

  function handleSortChange(
    value: string | undefined,
  ) {
    setSort(value)
    setPage(0)

    loadWarehouses(
      0,
      pageSize,
      search,
      status,
      value,
    )
  }

  async function create(
    request: CreateWarehouseRequest,
  ): Promise<boolean> {
    setSubmitting(true)
    setError(null)

    try {
      await createWarehouse(request)
      await loadWarehouses()

      return true
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create warehouse',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function update(
    id: number,
    request: UpdateWarehouseRequest,
  ): Promise<boolean> {
    setSubmitting(true)
    setError(null)

    try {
      await updateWarehouse(id, request)
      await loadWarehouses()

      return true
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update warehouse',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function activate(
    id: number,
  ): Promise<boolean> {
    setSubmitting(true)
    setError(null)

    try {
      await activateWarehouse(id)
      await loadWarehouses()

      return true
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to activate warehouse',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function deactivate(
    id: number,
  ): Promise<boolean> {
    setSubmitting(true)
    setError(null)

    try {
      await deactivateWarehouse(id)
      await loadWarehouses()

      return true
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to deactivate warehouse',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    warehouses,
    loading,
    submitting,
    error,
    total,

    search,
    status,
    page,
    pageSize,
    sort,

    loadWarehouses,

    create,
    update,
    activate,
    deactivate,

    handleSearch,
    handleStatusChange,
    handlePageChange,
    handleSortChange,
  }
}