import {
  Button,
  Empty,
  Space,
  Table,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

import type { CustomerResponse } from '../../../api/customerApi'

const { Text } = Typography

type CustomerTableProps = {
  customers: CustomerResponse[]
  loading: boolean
  deletingId: number | null
  searchText: string
  onEdit: (customer: CustomerResponse) => void
  onDelete: (customer: CustomerResponse) => void
}

export default function CustomerTable({
  customers,
  loading,
  deletingId,
  searchText,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const columns: ColumnsType<CustomerResponse> = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) =>
        a.name.localeCompare(b.name),
      render: (name: string) => (
        <Text strong>{name}</Text>
      ),
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
      render: (email: string | null) =>
        email || (
          <Text type="secondary">
            No email
          </Text>
        ),
    },

    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (address: string | null) =>
        address || (
          <Text type="secondary">
            No address
          </Text>
        ),
    },

    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',

      render: (_, customer) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            disabled={
              deletingId === customer.customerId
            }
            onClick={() => onEdit(customer)}
          />

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={
              deletingId === customer.customerId
            }
            onClick={() => onDelete(customer)}
          />
        </Space>
      ),
    },
  ]

  return (
  <Table
    rowKey="customerId"
    columns={columns}
    dataSource={customers}
    loading={loading}
    pagination={{
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total) =>
        `Total ${total} customers`,
    }}
    locale={{
      emptyText: (
        <Empty
          description={
            searchText
              ? 'No customers match your search.'
              : 'No customers found.'
          }
        />
      ),
    }}
    scroll={{ x: 800 }}
  />
)
}