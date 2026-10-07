import { useMemo, useState } from 'react'
import {
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Statistic,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined,
  InboxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'

type InventoryItem = {
  id: number
  product: string
  sku: string
  category: string
  warehouse: string
  location: string
  quantity: number
  reserved: number
  reorderLevel: number
}

const initialInventory: InventoryItem[] = [
  {
    id: 1,
    product: 'Cheeseburger',
    sku: 'FOOD-001',
    category: 'Food',
    warehouse: 'Main Warehouse',
    location: 'A-01-01',
    quantity: 42,
    reserved: 5,
    reorderLevel: 10,
  },
  {
    id: 2,
    product: 'Classic Burger',
    sku: 'FOOD-002',
    category: 'Food',
    warehouse: 'Main Warehouse',
    location: 'A-01-02',
    quantity: 18,
    reserved: 3,
    reorderLevel: 10,
  },
  {
    id: 3,
    product: 'French Fries',
    sku: 'FOOD-003',
    category: 'Food',
    warehouse: 'Main Warehouse',
    location: 'A-02-01',
    quantity: 7,
    reserved: 2,
    reorderLevel: 10,
  },
  {
    id: 4,
    product: 'Coca Cola',
    sku: 'DRINK-001',
    category: 'Beverage',
    warehouse: 'Main Warehouse',
    location: 'B-01-01',
    quantity: 65,
    reserved: 10,
    reorderLevel: 20,
  },
  {
    id: 5,
    product: 'Mineral Water',
    sku: 'DRINK-002',
    category: 'Beverage',
    warehouse: 'Main Warehouse',
    location: 'B-01-02',
    quantity: 12,
    reserved: 4,
    reorderLevel: 15,
  },
  {
    id: 6,
    product: 'Laptop Stand',
    sku: 'ACC-001',
    category: 'Accessories',
    warehouse: 'Secondary Warehouse',
    location: 'C-01-01',
    quantity: 0,
    reserved: 0,
    reorderLevel: 5,
  },
  {
    id: 7,
    product: 'Wireless Mouse',
    sku: 'ACC-002',
    category: 'Accessories',
    warehouse: 'Secondary Warehouse',
    location: 'C-01-02',
    quantity: 24,
    reserved: 6,
    reorderLevel: 8,
  },
  {
    id: 8,
    product: 'USB-C Cable',
    sku: 'ACC-003',
    category: 'Accessories',
    warehouse: 'Secondary Warehouse',
    location: 'C-02-01',
    quantity: 4,
    reserved: 1,
    reorderLevel: 10,
  },
]

export default function InventoryPage() {
  const [inventory] = useState<InventoryItem[]>(initialInventory)

  const [search, setSearch] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState<
    string | undefined
  >()

  const [categoryFilter, setCategoryFilter] = useState<
    string | undefined
  >()

  const [statusFilter, setStatusFilter] = useState<
    string | undefined
  >()

  const getAvailableQuantity = (item: InventoryItem) =>
    Math.max(item.quantity - item.reserved, 0)

  const getStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return 'Out of Stock'
    }

    if (item.quantity <= item.reorderLevel) {
      return 'Low Stock'
    }

    return 'In Stock'
  }

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        item.product.toLowerCase().includes(searchValue) ||
        item.sku.toLowerCase().includes(searchValue) ||
        item.location.toLowerCase().includes(searchValue)

      const matchesWarehouse = warehouseFilter
        ? item.warehouse === warehouseFilter
        : true

      const matchesCategory = categoryFilter
        ? item.category === categoryFilter
        : true

      const matchesStatus = statusFilter
        ? getStatus(item) === statusFilter
        : true

      return (
        matchesSearch &&
        matchesWarehouse &&
        matchesCategory &&
        matchesStatus
      )
    })
  }, [
    inventory,
    search,
    warehouseFilter,
    categoryFilter,
    statusFilter,
  ])

  const totalProducts = inventory.length

  const totalQuantity = inventory.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  const totalReserved = inventory.reduce(
    (total, item) => total + item.reserved,
    0,
  )

  const lowStockItems = inventory.filter(
    (item) =>
      item.quantity > 0 && item.quantity <= item.reorderLevel,
  ).length

  const outOfStockItems = inventory.filter(
    (item) => item.quantity === 0,
  ).length

  const columns: ColumnsType<InventoryItem> = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      sorter: (a, b) => a.product.localeCompare(b.product),
      fixed: 'left',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Food', value: 'Food' },
        { text: 'Beverage', value: 'Beverage' },
        { text: 'Accessories', value: 'Accessories' },
      ],
      onFilter: (value, record) =>
        record.category === value,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Reserved',
      dataIndex: 'reserved',
      key: 'reserved',
      align: 'right',
      sorter: (a, b) => a.reserved - b.reserved,
    },
    {
      title: 'Available',
      key: 'available',
      align: 'right',
      sorter: (a, b) =>
        getAvailableQuantity(a) - getAvailableQuantity(b),
      render: (_, item) => getAvailableQuantity(item),
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorderLevel',
      key: 'reorderLevel',
      align: 'right',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, item) => {
        const status = getStatus(item)

        if (status === 'In Stock') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="green">
              In Stock
            </Tag>
          )
        }

        if (status === 'Low Stock') {
          return (
            <Tag icon={<WarningOutlined />} color="orange">
              Low Stock
            </Tag>
          )
        }

        return (
          <Tag icon={<StopOutlined />} color="red">
            Out of Stock
          </Tag>
        )
      },
    },
  ]

  return (
    <div>
      {/* Summary Cards */}
      <Space
        direction="horizontal"
        size={16}
        wrap
        style={{
          width: '100%',
          marginBottom: 16,
        }}
      >
        <Card style={{ minWidth: 220, flex: 1 }}>
          <Statistic
            title="Products"
            value={totalProducts}
            prefix={<InboxOutlined />}
          />
        </Card>

        <Card style={{ minWidth: 220, flex: 1 }}>
          <Statistic
            title="Total Quantity"
            value={totalQuantity}
          />
        </Card>

        <Card style={{ minWidth: 220, flex: 1 }}>
          <Statistic
            title="Reserved"
            value={totalReserved}
          />
        </Card>

        <Card style={{ minWidth: 220, flex: 1 }}>
          <Statistic
            title="Low Stock"
            value={lowStockItems}
            prefix={<WarningOutlined />}
          />
        </Card>

        <Card style={{ minWidth: 220, flex: 1 }}>
          <Statistic
            title="Out of Stock"
            value={outOfStockItems}
            prefix={<StopOutlined />}
          />
        </Card>
      </Space>

      {/* Filters */}
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
        }}
      >
        <Space
          wrap
          style={{
            width: '100%',
          }}
        >
          <Input
            placeholder="Search product, SKU or location"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{ width: 280 }}
          />

          <Select
            placeholder="Warehouse"
            allowClear
            value={warehouseFilter}
            onChange={setWarehouseFilter}
            style={{ width: 190 }}
            options={[
              {
                label: 'Main Warehouse',
                value: 'Main Warehouse',
              },
              {
                label: 'Secondary Warehouse',
                value: 'Secondary Warehouse',
              },
            ]}
          />

          <Select
            placeholder="Category"
            allowClear
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 160 }}
            options={[
              {
                label: 'Food',
                value: 'Food',
              },
              {
                label: 'Beverage',
                value: 'Beverage',
              },
              {
                label: 'Accessories',
                value: 'Accessories',
              },
            ]}
          />

          <Select
            placeholder="Stock Status"
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              {
                label: 'In Stock',
                value: 'In Stock',
              },
              {
                label: 'Low Stock',
                value: 'Low Stock',
              },
              {
                label: 'Out of Stock',
                value: 'Out of Stock',
              },
            ]}
          />
        </Space>
      </Card>

      {/* Inventory Table */}
      <Card bordered={false}>
        <Table<InventoryItem>
          rowKey="id"
          columns={columns}
          dataSource={filteredInventory}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) =>
              `Total ${total} inventory records`,
          }}
        />
      </Card>
    </div>
  )
}