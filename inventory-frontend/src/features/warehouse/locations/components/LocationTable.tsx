import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'

import type {
  LocationResponse,
  LocationStatus,
  LocationType,
} from '../../../../api/locationApi'

type LocationTableProps = {
  locations: LocationResponse[]
  loading: boolean
  canManage: boolean

  onEdit: (
    location: LocationResponse
  ) => void

  onActivate: (
    locationId: number
  ) => void | Promise<void>

  onDeactivate: (
    locationId: number
  ) => void | Promise<void>
}

const typeColors: Record<
  LocationType,
  string
> = {
  STORAGE: 'blue',
  RECEIVING: 'green',
  SHIPPING: 'orange',
  QUARANTINE: 'red',
}

const typeLabels: Record<
  LocationType,
  string
> = {
  STORAGE: 'Storage',
  RECEIVING: 'Receiving',
  SHIPPING: 'Shipping',
  QUARANTINE: 'Quarantine',
}

const statusColors: Record<
  LocationStatus,
  string
> = {
  ACTIVE: 'green',
  INACTIVE: 'default',
}

const statusLabels: Record<
  LocationStatus,
  string
> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
}

export default function LocationTable({
  locations,
  loading,
  canManage,
  onEdit,
  onActivate,
  onDeactivate,
}: LocationTableProps) {
  const columns: ColumnsType<LocationResponse> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 130,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (
        value: LocationType
      ) => (
        <Tag color={typeColors[value]}>
          {typeLabels[value]}
        </Tag>
      ),
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (
        value: LocationStatus
      ) => (
        <Tag color={statusColors[value]}>
          {statusLabels[value]}
        </Tag>
      ),
    },
  ]

  if (canManage) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (
        _,
        record,
      ) => (
        <Space wrap>
          <Button
            size="small"
            onClick={() =>
              onEdit(record)
            }
          >
            Edit
          </Button>

          {record.status ===
          'ACTIVE' ? (
            <Popconfirm
              title="Deactivate this location?"
              description="This location will no longer be active."
              okText="Deactivate"
              cancelText="Cancel"
              onConfirm={() =>
                onDeactivate(
                  record.locationId,
                )
              }
            >
              <Button
                size="small"
                danger
              >
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Activate this location?"
              description="The location will become active again."
              okText="Activate"
              cancelText="Cancel"
              onConfirm={() =>
                onActivate(
                  record.locationId,
                )
              }
            >
              <Button
                size="small"
                type="primary"
              >
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    })
  }

  return (
    <Table<LocationResponse>
      rowKey="locationId"
      columns={columns}
      dataSource={locations}
      loading={loading}
      scroll={{
        x: canManage
          ? 900
          : 700,
      }}
    />
  )
}
