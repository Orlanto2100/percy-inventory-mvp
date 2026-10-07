import {
  Alert,
  Button,
  Card,
  message,
  Space,
  Typography,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'

import {
  type LocationCreateRequest,
  type LocationResponse,
  type LocationSearchParams,
  type LocationStatus,
  type LocationType,
  type LocationUpdateRequest,
} from '../../../../api/locationApi'

import {
  getWarehouses,
  type WarehouseResponse,
} from '../../../../api/warehouseApi'

import { useLocations } from '../hooks/useLocation'
import LocationFilters from '../components/LocationFilters'
import LocationTable from '../components/LocationTable'
import LocationFormModal from '../components/LocationFormModal'

const { Title, Text } = Typography

export default function LocationPage() {
  const {
    locations,
    loading,
    submitting,
    error,
    loadLocations,
    create,
    update,
    activate,
    deactivate,
  } = useLocations()

  const [warehouses, setWarehouses] =
    useState<WarehouseResponse[]>([])

  const [search, setSearch] =
    useState('')

  const [type, setType] =
    useState<LocationType | undefined>(
      undefined,
    )

  const [status, setStatus] =
    useState<LocationStatus | undefined>(
      undefined,
    )

  const [warehouseId, setWarehouseId] =
    useState<number | undefined>(
      undefined,
    )

  const [page, setPage] =
    useState(0)

  const [pageSize] =
    useState(10)

  const [modalOpen, setModalOpen] =
    useState(false)

  const [editingLocation, setEditingLocation] =
    useState<LocationResponse | null>(
      null,
    )

  const role =
    localStorage.getItem('role')

  const isAdmin =
    role === 'ADMIN'

  const isWarehouseStaff =
    role === 'WAREHOUSE_STAFF'

  const loadWarehouseOptions =
    async () => {
      try {
        const response =
          await getWarehouses({
            page: 0,
            size: 100,
          })

        setWarehouses(
          response.content,
        )
      } catch {
        setWarehouses([])
      }
    }

  const loadData = async () => {
    const params: LocationSearchParams = {
      page,
      size: pageSize,
    }

    if (search.trim()) {
      params.search =
        search.trim()
    }

    if (type) {
      params.type = type
    }

    if (status) {
      params.status = status
    }

    if (warehouseId !== undefined) {
      params.warehouseId =
        warehouseId
    }

    await loadLocations(params)
  }

  useEffect(() => {
    loadWarehouseOptions()
  }, [])

  useEffect(() => {
    loadData()
  }, [
    page,
    pageSize,
    search,
    type,
    status,
    warehouseId,
  ])

  const warehouseOptions =
    useMemo(
      () =>
        warehouses.map(
          (warehouse) => ({
            value:
              warehouse.warehouseId,
            label:
              `${warehouse.code} - ${warehouse.name}`,
          }),
        ),
      [warehouses],
    )

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value)
    setPage(0)
  }

  const handleTypeChange = (
    value:
      | LocationType
      | undefined,
  ) => {
    setType(value)
    setPage(0)
  }

  const handleStatusChange = (
    value:
      | LocationStatus
      | undefined,
  ) => {
    setStatus(value)
    setPage(0)
  }

  const handleWarehouseChange = (
    value:
      | number
      | undefined,
  ) => {
    setWarehouseId(value)
    setPage(0)
  }

  const handleAdd = () => {
    if (!isAdmin) {
      return
    }

    setEditingLocation(null)
    setModalOpen(true)
  }

  const handleEdit = (
    location: LocationResponse,
  ) => {
    if (!isAdmin) {
      return
    }

    setEditingLocation(location)
    setModalOpen(true)
  }

  const handleSubmit = async (
    values:
      | LocationCreateRequest
      | LocationUpdateRequest,
  ) => {
    if (!isAdmin) {
      return
    }

    let success = false

    if (editingLocation) {
      success = await update(
        editingLocation.locationId,
        values as LocationUpdateRequest,
      )
    } else {
      success = await create(
        values as LocationCreateRequest,
      )
    }

    if (!success) {
      return
    }

    message.success(
      editingLocation
        ? 'Location updated successfully'
        : 'Location created successfully',
    )

    setModalOpen(false)
    setEditingLocation(null)

    await loadData()
  }

  const handleActivate = async (
    locationId: number,
  ) => {
    if (!isAdmin) {
      return
    }

    const success =
      await activate(locationId)

    if (!success) {
      return
    }

    message.success(
      'Location activated successfully',
    )

    await loadData()
  }

  const handleDeactivate = async (
    locationId: number,
  ) => {
    if (!isAdmin) {
      return
    }

    const success =
      await deactivate(locationId)

    if (!success) {
      return
    }

    message.success(
      'Location deactivated successfully',
    )

    await loadData()
  }

  const handleModalCancel = () => {
    setModalOpen(false)
    setEditingLocation(null)
  }

  return (
    <Space
      direction="vertical"
      size="large"
      style={{
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              margin: 0,
            }}
          >
            Locations
          </Title>

          <Text type="secondary">
            {isWarehouseStaff
              ? 'View locations for your assigned warehouse.'
              : 'Manage warehouse storage and operational locations.'}
          </Text>
        </div>

        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Location
          </Button>
        )}
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Unable to load locations"
          description={error}
        />
      )}

      <Card>
        <LocationFilters
          search={search}
          type={type}
          status={status}
          warehouseId={
            isAdmin
              ? warehouseId
              : undefined
          }
          warehouseOptions={
            isAdmin
              ? warehouseOptions
              : []
          }
          onSearchChange={
            handleSearchChange
          }
          onTypeChange={
            handleTypeChange
          }
          onStatusChange={
            handleStatusChange
          }
          onWarehouseChange={
            handleWarehouseChange
          }
        />

        <LocationTable
          locations={locations}
          loading={loading}
          canManage={isAdmin}
          onEdit={handleEdit}
          onActivate={
            handleActivate
          }
          onDeactivate={
            handleDeactivate
          }
        />
      </Card>

      {isAdmin && (
        <LocationFormModal
          open={modalOpen}
          loading={submitting}
          location={
            editingLocation
          }
          warehouseOptions={
            warehouseOptions
          }
          onCancel={
            handleModalCancel
          }
          onSubmit={handleSubmit}
        />
      )}
    </Space>
  )
}