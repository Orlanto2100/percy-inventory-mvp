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

import type { ProductResponse } from '../../../api/productApi'

const { Text } = Typography

type ProductTableProps = {
  products: ProductResponse[]
  loading: boolean
  deletingId: number | null
  searchText: string
  onEdit: (product: ProductResponse) => void
  onDelete: (product: ProductResponse) => void
}

export default function ProductTable({
  products,
  loading,
  deletingId,
  searchText,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const columns: ColumnsType<ProductResponse> = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) =>
        a.productName.localeCompare(b.productName),
      render: (productName: string) => (
        <Text strong>{productName}</Text>
      ),
    },

    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },

    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) =>
        `${price.toLocaleString()} MMK`,
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string | null) =>
        description || (
          <Text type="secondary">
            No description
          </Text>
        ),
    },

    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',

      render: (_, product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            disabled={deletingId === product.productId}
            onClick={() => onEdit(product)}
          />

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deletingId === product.productId}
            onClick={() => onDelete(product)}
          />
        </Space>
      ),
    },
  ]

  return (
    <Table
      rowKey="productId"
      columns={columns}
      dataSource={products}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) =>
          `Total ${total} products`,
      }}
      locale={{
        emptyText: (
          <Empty
            description={
              searchText
                ? 'No products match your search.'
                : 'No products found.'
            }
          />
        ),
      }}
      scroll={{ x: 800 }}
    />
  )
}