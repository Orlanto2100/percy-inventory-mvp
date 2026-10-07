import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  createVendor,
  deactivateVendor,
  getVendors,
  updateVendor,
  type CreateVendorRequest,
  type GetVendorsParams,
  type UpdateVendorRequest,
  type VendorResponse,
  type VendorStatus,
} from '../../../../api/vendorApi'

export function useVendors() {
  const [vendors, setVendors] =
    useState<VendorResponse[]>([])

  const [loading, setLoading] =
    useState(false)

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [search, setSearch] =
    useState('')

  const [status, setStatus] =
    useState<VendorStatus | undefined>()

  const [page, setPage] =
    useState(0)

  const [pageSize, setPageSize] =
    useState(10)

  const [sort, setSort] =
    useState<string | undefined>()

  const [total, setTotal] =
    useState(0)

  const loadVendors = useCallback(
    async (
      currentPage = page,
      currentPageSize = pageSize,
      currentSearch = search,
      currentStatus = status,
      currentSort = sort,
    ) => {
      console.log(
        '2. LOADING VENDORS:',
        currentStatus,
      )

      setLoading(true)
      setError(null)

      try {
        const params: GetVendorsParams = {
          page: currentPage,
          size: currentPageSize,
          search:
            currentSearch || undefined,
          status: currentStatus,
          sort: currentSort,
        }

        console.log(
          '3. REQUEST PARAMS:',
          params,
        )

        const response =
          await getVendors(params)

        console.log(
          '4. RESPONSE:',
          response,
        )

        setVendors(response.content)
        setTotal(response.totalElements)
      } catch (error) {
        console.error(
          'REQUEST ERROR:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load vendors',
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
    loadVendors()
  }, [loadVendors])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(0)

    loadVendors(
      0,
      pageSize,
      value,
      status,
      sort,
    )
  }

  function handleStatusChange(
    value: VendorStatus | undefined,
  ) {
    console.log(
      '1. STATUS CHANGE:',
      value,
    )

    setStatus(value)
    setPage(0)

    loadVendors(
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

    loadVendors(
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

    loadVendors(
      0,
      pageSize,
      search,
      status,
      value,
    )
  }

  async function create(
    request: CreateVendorRequest,
  ): Promise<boolean> {
    setSubmitting(true)
    setError(null)

    try {
      await createVendor(request)
      await loadVendors()

      return true
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create vendor',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function update(
    id: number,
    request: UpdateVendorRequest,
  ): Promise<boolean> {
    setSubmitting(true)
    setError(null)

    try {
      await updateVendor(id, request)
      await loadVendors()

      return true
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update vendor',
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
      await deactivateVendor(id)
      await loadVendors()

      return true
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to deactivate vendor',
      )

      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    vendors,
    loading,
    submitting,
    error,
    total,

    search,
    status,
    page,
    pageSize,
    sort,

    loadVendors,

    create,
    update,
    deactivate,

    handleSearch,
    handleStatusChange,
    handlePageChange,
    handleSortChange,
  }
}