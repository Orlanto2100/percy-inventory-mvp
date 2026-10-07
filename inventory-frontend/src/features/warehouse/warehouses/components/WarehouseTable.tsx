import {
  Button,
  Space,
  Table,
  Tag,
} from 'antd'

import type { TableProps } from 'antd'
import type { WarehouseResponse } from '../../../../api/warehouseApi'

type WarehouseTableProps = {
  warehouses: WarehouseResponse[]
  loading: boolean
  total: number
  page: number
  pageSize: number

  onPageChange: (
    page: number,
    pageSize: number,
  ) => void

  onSortChange: (
    value: string | undefined,
  ) => void

  onView: (
    warehouse: WarehouseResponse,
  ) => void

  // Admin only
  onEdit?: (
    warehouse: WarehouseResponse,
  ) => void

  // Admin only
  onActivate?: (
    warehouse: WarehouseResponse,
  ) => void

  // Admin only
  onDeactivate?: (
    warehouse: WarehouseResponse,
  ) => void

  activatingId: number | null
  deactivatingId: number | null
}

export default function WarehouseTable({
  warehouses,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onSortChange,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  activatingId,
  deactivatingId,
}: WarehouseTableProps) {

  const columns: TableProps<WarehouseResponse>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
    },

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },

    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: true,

      render: (city: string | null) =>
        city || '-',
    },

    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',

      render: (
        phoneNumber: string | null,
      ) =>
        phoneNumber || '-',
    },

    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',

      render: (
        email: string | null,
      ) =>
        email || '-',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',

      render: (
        status: WarehouseResponse['status'],
      ) => (
        <Tag
          color={
            status === 'ACTIVE'
              ? 'green'
              : 'default'
          }
        >
          {status}
        </Tag>
      ),
    },

    // ==================================================
    // Actions
    // ==================================================

    {
      title: 'Actions',
      key: 'actions',

      render: (_, warehouse) => (
        <Space>

          {/* ==========================================
              View
              Everyone
              ========================================== */}

          <Button
            type="link"
            onClick={() =>
              onView(warehouse)
            }
          >
            View
          </Button>


          {/* ==========================================
              Edit
              Admin only
              ========================================== */}

          {onEdit && (
            <Button
              type="link"
              onClick={() =>
                onEdit(warehouse)
              }
            >
              Edit
            </Button>
          )}


          {/* ==========================================
              Deactivate
              Admin only
              ========================================== */}

          {onDeactivate &&
            warehouse.status === 'ACTIVE' && (
              <Button
                type="link"
                danger
                loading={
                  deactivatingId ===
                  warehouse.warehouseId
                }
                onClick={() =>
                  onDeactivate(
                    warehouse,
                  )
                }
              >
                Deactivate
              </Button>
            )}


          {/* ==========================================
              Activate
              Admin only
              ========================================== */}

          {onActivate &&
            warehouse.status === 'INACTIVE' && (
              <Button
                type="link"
                loading={
                  activatingId ===
                  warehouse.warehouseId
                }
                onClick={() =>
                  onActivate(
                    warehouse,
                  )
                }
              >
                Activate
              </Button>
            )}

        </Space>
      ),
    },
  ]


  // ==================================================
  // Table Change
  // ==================================================

  const handleTableChange: TableProps<WarehouseResponse>['onChange'] = (
    pagination,
    _filters,
    sorter,
  ) => {

    const newPage =
      pagination.current ?? 1

    const newPageSize =
      pagination.pageSize ?? pageSize

    onPageChange(
      newPage - 1,
      newPageSize,
    )


    if (!Array.isArray(sorter)) {

      const field = sorter.field
      const order = sorter.order

      if (field && order) {

        onSortChange(
          `${String(field)},${
            order === 'ascend'
              ? 'asc'
              : 'desc'
          }`,
        )

      } else {

        onSortChange(undefined)

      }
    }
  }


  // ==================================================
  // Render Table
  // ==================================================

  return (
    <Table<WarehouseResponse>
      rowKey="warehouseId"
      columns={columns}
      dataSource={warehouses}
      loading={loading}
      onChange={handleTableChange}

      pagination={{
        current: page + 1,
        pageSize,
        total,

        showSizeChanger: true,

        showTotal: (total) =>
          `Total ${total} warehouses`,
      }}
    />
  )
}