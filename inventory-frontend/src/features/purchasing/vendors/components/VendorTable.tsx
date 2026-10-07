import {
  Button,
  Space,
  Table,
  Tag,
} from 'antd'

import type { TableProps } from 'antd'
import type { VendorResponse } from '../../../api/vendorApi'

type VendorTableProps = {
  vendors: VendorResponse[]
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

  onView: (vendor: VendorResponse) => void
  onEdit: (vendor: VendorResponse) => void
  onDeactivate: (vendor: VendorResponse) => void

  deactivatingId: number | null
}

export default function VendorTable({
  vendors,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onSortChange,
  onView,
  onEdit,
  onDeactivate,
  deactivatingId,
}: VendorTableProps) {
  const columns: TableProps<VendorResponse>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: VendorResponse['status']) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, vendor) => (
        <Space>
          <Button
            type="link"
            onClick={() => onView(vendor)}
          >
            View
          </Button>

          <Button
            type="link"
            onClick={() => onEdit(vendor)}
          >
            Edit
          </Button>

          {vendor.status === 'ACTIVE' && (
            <Button
              type="link"
              danger
              loading={deactivatingId === vendor.id}
              onClick={() => onDeactivate(vendor)}
            >
              Deactivate
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleTableChange: TableProps<VendorResponse>['onChange'] = (
    pagination,
    _filters,
    sorter,
  ) => {
    const newPage = pagination.current ?? 1
    const newPageSize = pagination.pageSize ?? pageSize

    // Ant Design uses 1-based pages.
    // Backend uses 0-based pages.
    onPageChange(newPage - 1, newPageSize)

    if (!Array.isArray(sorter)) {
      const field = sorter.field
      const order = sorter.order

      if (field && order) {
        onSortChange(
          `${String(field)},${
            order === 'ascend' ? 'asc' : 'desc'
          }`,
        )
      } else {
        onSortChange(undefined)
      }
    }
  }

  return (
    <Table<VendorResponse>
      rowKey="id"
      columns={columns}
      dataSource={vendors}
      loading={loading}
      onChange={handleTableChange}
      pagination={{
        current: page + 1,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} vendors`,
      }}
    />
  )
}