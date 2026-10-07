import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography

type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'

type StockMovement = {
  id: number
  reference: string
  product: string
  sku: string
  type: MovementType
  quantity: number
  warehouse: string
  location: string
  date: string
  reason: string
}

type StockMovementFormValues = {
  reference: string
  product: string
  type: MovementType
  quantity: number
  warehouse: string
  location: string
  date: dayjs.Dayjs
  reason: string
}

const products = [
  {
    name: 'Cheeseburger',
    sku: 'CB-001',
  },
  {
    name: 'Classic Burger',
    sku: 'CB-002',
  },
  {
    name: 'French Fries',
    sku: 'FF-001',
  },
  {
    name: 'Coca Cola',
    sku: 'CC-001',
  },
  {
    name: 'Mineral Water',
    sku: 'MW-001',
  },
  {
    name: 'Laptop Stand',
    sku: 'LS-001',
  },
  {
    name: 'Wireless Mouse',
    sku: 'WM-001',
  },
  {
    name: 'USB-C Cable',
    sku: 'UC-001',
  },
]

const warehouses = [
  'Main Warehouse',
  'Secondary Warehouse',
]

const locations = [
  'A-01',
  'A-02',
  'B-01',
  'B-02',
  'C-01',
  'C-02',
]

const movementTypes: MovementType[] = [
  'IN',
  'OUT',
  'TRANSFER',
  'ADJUSTMENT',
]

const initialMovements: StockMovement[] = [
  {
    id: 1,
    reference: 'SM-1001',
    product: 'Cheeseburger',
    sku: 'CB-001',
    type: 'IN',
    quantity: 50,
    warehouse: 'Main Warehouse',
    location: 'A-01',
    date: '2026-09-01',
    reason: 'Purchase Order PO-1001',
  },
  {
    id: 2,
    reference: 'SM-1002',
    product: 'Cheeseburger',
    sku: 'CB-001',
    type: 'OUT',
    quantity: 20,
    warehouse: 'Main Warehouse',
    location: 'A-01',
    date: '2026-09-02',
    reason: 'Sales Order SO-1001',
  },
  {
    id: 3,
    reference: 'SM-1003',
    product: 'Laptop Stand',
    sku: 'LS-001',
    type: 'IN',
    quantity: 30,
    warehouse: 'Main Warehouse',
    location: 'B-01',
    date: '2026-09-03',
    reason: 'Purchase Order PO-1002',
  },
  {
    id: 4,
    reference: 'SM-1004',
    product: 'Wireless Mouse',
    sku: 'WM-001',
    type: 'OUT',
    quantity: 15,
    warehouse: 'Main Warehouse',
    location: 'B-02',
    date: '2026-09-04',
    reason: 'Sales Order SO-1002',
  },
  {
    id: 5,
    reference: 'SM-1005',
    product: 'USB-C Cable',
    sku: 'UC-001',
    type: 'TRANSFER',
    quantity: 10,
    warehouse: 'Secondary Warehouse',
    location: 'C-01',
    date: '2026-09-05',
    reason: 'Warehouse transfer',
  },
  {
    id: 6,
    reference: 'SM-1006',
    product: 'French Fries',
    sku: 'FF-001',
    type: 'ADJUSTMENT',
    quantity: 5,
    warehouse: 'Main Warehouse',
    location: 'A-02',
    date: '2026-09-06',
    reason: 'Stock count adjustment',
  },
]

const typeColors: Record<MovementType, string> = {
  IN: 'green',
  OUT: 'red',
  TRANSFER: 'blue',
  ADJUSTMENT: 'orange',
}

export default function StockMovementPage() {
  const [movements, setMovements] =
    useState<StockMovement[]>(initialMovements)

  const [searchText, setSearchText] = useState('')

  const [typeFilter, setTypeFilter] = useState<
    MovementType | undefined
  >()

  const [warehouseFilter, setWarehouseFilter] = useState<
    string | undefined
  >()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isViewModalOpen, setIsViewModalOpen] =
    useState(false)

  const [editingMovement, setEditingMovement] =
    useState<StockMovement | null>(null)

  const [viewingMovement, setViewingMovement] =
    useState<StockMovement | null>(null)

  const [form] =
    Form.useForm<StockMovementFormValues>()

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const search = searchText.toLowerCase().trim()

      const matchesSearch =
        !search ||
        movement.reference.toLowerCase().includes(search) ||
        movement.product.toLowerCase().includes(search) ||
        movement.sku.toLowerCase().includes(search) ||
        movement.reason.toLowerCase().includes(search)

      const matchesType =
        !typeFilter || movement.type === typeFilter

      const matchesWarehouse =
        !warehouseFilter ||
        movement.warehouse === warehouseFilter

      return (
        matchesSearch &&
        matchesType &&
        matchesWarehouse
      )
    })
  }, [
    movements,
    searchText,
    typeFilter,
    warehouseFilter,
  ])

  const totalMovements = movements.length

  const totalIn = movements
    .filter((movement) => movement.type === 'IN')
    .reduce((total, movement) => total + movement.quantity, 0)

  const totalOut = movements
    .filter((movement) => movement.type === 'OUT')
    .reduce((total, movement) => total + movement.quantity, 0)

  const totalTransfers = movements
    .filter(
      (movement) => movement.type === 'TRANSFER',
    )
    .reduce((total, movement) => total + movement.quantity, 0)

  const openCreateModal = () => {
    setEditingMovement(null)

    form.resetFields()

    form.setFieldsValue({
      reference: `SM-${1001 + movements.length}`,
      date: dayjs(),
      type: 'IN',
      quantity: 1,
    })

    setIsModalOpen(true)
  }

  const openEditModal = (
    movement: StockMovement,
  ) => {
    setEditingMovement(movement)

    form.setFieldsValue({
      reference: movement.reference,
      product: movement.product,
      type: movement.type,
      quantity: movement.quantity,
      warehouse: movement.warehouse,
      location: movement.location,
      date: dayjs(movement.date),
      reason: movement.reason,
    })

    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const selectedProduct = products.find(
        (product) => product.name === values.product,
      )

      if (!selectedProduct) {
        message.error('Please select a valid product.')
        return
      }

      if (editingMovement) {
        setMovements((current) =>
          current.map((movement) =>
            movement.id === editingMovement.id
              ? {
                  ...movement,
                  reference: values.reference,
                  product: selectedProduct.name,
                  sku: selectedProduct.sku,
                  type: values.type,
                  quantity: values.quantity,
                  warehouse: values.warehouse,
                  location: values.location,
                  date: values.date.format(
                    'YYYY-MM-DD',
                  ),
                  reason: values.reason,
                }
              : movement,
          ),
        )

        message.success(
          'Stock movement updated successfully.',
        )
      } else {
        const newMovement: StockMovement = {
          id: Date.now(),
          reference: values.reference,
          product: selectedProduct.name,
          sku: selectedProduct.sku,
          type: values.type,
          quantity: values.quantity,
          warehouse: values.warehouse,
          location: values.location,
          date: values.date.format('YYYY-MM-DD'),
          reason: values.reason,
        }

        setMovements((current) => [
          newMovement,
          ...current,
        ])

        message.success(
          'Stock movement created successfully.',
        )
      }

      setIsModalOpen(false)
      form.resetFields()
      setEditingMovement(null)
    } catch {
      // Ant Design displays validation errors.
    }
  }

  const handleDelete = (id: number) => {
    setMovements((current) =>
      current.filter(
        (movement) => movement.id !== id,
      ),
    )

    message.success(
      'Stock movement deleted successfully.',
    )
  }

  const openViewModal = (
    movement: StockMovement,
  ) => {
    setViewingMovement(movement)
    setIsViewModalOpen(true)
  }

  const columns: ColumnsType<StockMovement> = [
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      sorter: (a, b) =>
        a.reference.localeCompare(b.reference),
      render: (value) => (
        <Text strong>{value}</Text>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      sorter: (a, b) =>
        a.product.localeCompare(b.product),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: MovementType) => (
        <Tag color={typeColors[type]}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) =>
        a.quantity - b.quantity,
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) =>
        a.date.localeCompare(b.date),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() =>
              openViewModal(record)
            }
          />

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() =>
              openEditModal(record)
            }
          />

          <Popconfirm
            title="Delete this stock movement?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() =>
              handleDelete(record.id)
            }
          >
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 24 }}
      >
        <Col>
          <Title
            level={2}
            style={{ margin: 0 }}
          >
            Stock Movements
          </Title>

          <Text type="secondary">
            Track inventory movements and stock
            adjustments
          </Text>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create Stock Movement
          </Button>
        </Col>
      </Row>

      <Row
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
      >
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">
              Total Movements
            </Text>

            <Title
              level={3}
              style={{ margin: '8px 0 0' }}
            >
              {totalMovements}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">
              Stock In
            </Text>

            <Title
              level={3}
              style={{ margin: '8px 0 0' }}
            >
              {totalIn}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">
              Stock Out
            </Text>

            <Title
              level={3}
              style={{ margin: '8px 0 0' }}
            >
              {totalOut}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">
              Transfers
            </Text>

            <Title
              level={3}
              style={{ margin: '8px 0 0' }}
            >
              {totalTransfers}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <Space
          wrap
          style={{
            width: '100%',
            marginBottom: 16,
          }}
        >
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search reference, product, SKU..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            style={{ width: 280 }}
          />

          <Select
            allowClear
            placeholder="Filter by type"
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 180 }}
            options={movementTypes.map(
              (type) => ({
                label: type,
                value: type,
              }),
            )}
          />

          <Select
            allowClear
            placeholder="Filter by warehouse"
            value={warehouseFilter}
            onChange={setWarehouseFilter}
            style={{ width: 220 }}
            options={warehouses.map(
              (warehouse) => ({
                label: warehouse,
                value: warehouse,
              }),
            )}
          />
        </Space>

        <Table<StockMovement>
          rowKey="id"
          columns={columns}
          dataSource={filteredMovements}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) =>
              `Total ${total} movements`,
          }}
        />
      </Card>

      <Modal
        title={
          editingMovement
            ? 'Edit Stock Movement'
            : 'Create Stock Movement'
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setEditingMovement(null)
        }}
        onOk={handleSubmit}
        okText={
          editingMovement ? 'Update' : 'Create'
        }
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Reference"
                name="reference"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter reference.',
                  },
                ]}
              >
                <Input placeholder="SM-1001" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message:
                      'Please select movement type.',
                  },
                ]}
              >
                <Select
                  options={movementTypes.map(
                    (type) => ({
                      label: type,
                      value: type,
                    }),
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter quantity.',
                  },
                  {
                    type: 'number',
                    min: 1,
                    message:
                      'Quantity must be at least 1.',
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Product"
                name="product"
                rules={[
                  {
                    required: true,
                    message:
                      'Please select a product.',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select product"
                  optionFilterProp="label"
                  options={products.map(
                    (product) => ({
                      label: `${product.name} (${product.sku})`,
                      value: product.name,
                    }),
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Warehouse"
                name="warehouse"
                rules={[
                  {
                    required: true,
                    message:
                      'Please select warehouse.',
                  },
                ]}
              >
                <Select
                  placeholder="Select warehouse"
                  options={warehouses.map(
                    (warehouse) => ({
                      label: warehouse,
                      value: warehouse,
                    }),
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[
                  {
                    required: true,
                    message:
                      'Please select location.',
                  },
                ]}
              >
                <Select
                  placeholder="Select location"
                  options={locations.map(
                    (location) => ({
                      label: location,
                      value: location,
                    }),
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[
                  {
                    required: true,
                    message:
                      'Please select date.',
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              {
                required: true,
                message:
                  'Please enter a reason.',
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter reason for this stock movement"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Stock Movement Details"
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false)
          setViewingMovement(null)
        }}
        footer={null}
        width={700}
        destroyOnHidden
      >
        {viewingMovement && (
          <Row
            gutter={[24, 20]}
            style={{ marginTop: 16 }}
          >
            <Col xs={24} sm={12}>
              <Text type="secondary">
                Reference
              </Text>

              <div>
                <Text strong>
                  {viewingMovement.reference}
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <Text type="secondary">
                Movement Type
              </Text>

              <div>
                <Tag
                  color={
                    typeColors[
                      viewingMovement.type
                    ]
                  }
                >
                  {viewingMovement.type}
                </Tag>
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <Text type="secondary">
                Product
              </Text>

              <div>
                {viewingMovement.product}
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <Text type="secondary">
                SKU
              </Text>

              <div>
                {viewingMovement.sku}
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <Text type="secondary">
                Quantity
              </Text>

              <div>
                {viewingMovement.quantity}
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <Text type="secondary">
                Warehouse
              </Text>

              <div>
                {viewingMovement.warehouse}
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <Text type="secondary">
                Location
              </Text>

              <div>
                {viewingMovement.location}
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <Text type="secondary">
                Date
              </Text>

              <div>
                {viewingMovement.date}
              </div>
            </Col>

            <Col span={24}>
              <Text type="secondary">
                Reason
              </Text>

              <div>
                {viewingMovement.reason}
              </div>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  )
}