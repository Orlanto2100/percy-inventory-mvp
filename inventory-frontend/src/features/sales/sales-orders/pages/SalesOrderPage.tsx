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

type SalesOrderItem = {
  id: number
  product: string
  quantity: number
  unitPrice: number
}

type SalesOrder = {
  id: number
  soNumber: string
  customer: string
  orderDate: string
  status:
    | 'Draft'
    | 'Pending'
    | 'Confirmed'
    | 'Shipped'
    | 'Completed'
    | 'Cancelled'
  items: SalesOrderItem[]
}

type SalesOrderFormValues = {
  soNumber: string
  customer: string
  orderDate: dayjs.Dayjs
  status: SalesOrder['status']
}

const customers = [
  'ABC Company',
  'Yangon Trading Co.',
  'Golden Star Co.',
  'Myanmar Tech Store',
  'City Mart',
]

const products = [
  'Cheeseburger',
  'Classic Burger',
  'French Fries',
  'Coca Cola',
  'Mineral Water',
  'Laptop Stand',
  'Wireless Mouse',
  'USB-C Cable',
]

const statusOptions: SalesOrder['status'][] = [
  'Draft',
  'Pending',
  'Confirmed',
  'Shipped',
  'Completed',
  'Cancelled',
]

const initialOrders: SalesOrder[] = [
  {
    id: 1,
    soNumber: 'SO-1001',
    customer: 'ABC Company',
    orderDate: '2026-09-01',
    status: 'Completed',
    items: [
      {
        id: 1,
        product: 'Cheeseburger',
        quantity: 20,
        unitPrice: 3500,
      },
      {
        id: 2,
        product: 'Coca Cola',
        quantity: 20,
        unitPrice: 1500,
      },
    ],
  },
  {
    id: 2,
    soNumber: 'SO-1002',
    customer: 'Yangon Trading Co.',
    orderDate: '2026-09-03',
    status: 'Shipped',
    items: [
      {
        id: 3,
        product: 'Laptop Stand',
        quantity: 10,
        unitPrice: 45000,
      },
      {
        id: 4,
        product: 'Wireless Mouse',
        quantity: 15,
        unitPrice: 28000,
      },
    ],
  },
  {
    id: 3,
    soNumber: 'SO-1003',
    customer: 'Golden Star Co.',
    orderDate: '2026-09-05',
    status: 'Confirmed',
    items: [
      {
        id: 5,
        product: 'Classic Burger',
        quantity: 30,
        unitPrice: 3000,
      },
    ],
  },
  {
    id: 4,
    soNumber: 'SO-1004',
    customer: 'Myanmar Tech Store',
    orderDate: '2026-09-07',
    status: 'Pending',
    items: [
      {
        id: 6,
        product: 'USB-C Cable',
        quantity: 25,
        unitPrice: 12000,
      },
      {
        id: 7,
        product: 'Wireless Mouse',
        quantity: 10,
        unitPrice: 28000,
      },
    ],
  },
  {
    id: 5,
    soNumber: 'SO-1005',
    customer: 'City Mart',
    orderDate: '2026-09-08',
    status: 'Draft',
    items: [
      {
        id: 8,
        product: 'French Fries',
        quantity: 40,
        unitPrice: 2000,
      },
    ],
  },
]

const statusColors: Record<SalesOrder['status'], string> = {
  Draft: 'default',
  Pending: 'orange',
  Confirmed: 'blue',
  Shipped: 'purple',
  Completed: 'green',
  Cancelled: 'red',
}

export default function SalesOrderPage() {
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders)
  const [searchText, setSearchText] = useState('')
  const [customerFilter, setCustomerFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<
    SalesOrder['status'] | undefined
  >()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null)
  const [viewingOrder, setViewingOrder] = useState<SalesOrder | null>(null)

  const [items, setItems] = useState<SalesOrderItem[]>([])
  const [form] = Form.useForm<SalesOrderFormValues>()

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchText.toLowerCase().trim()

      const matchesSearch =
        !search ||
        order.soNumber.toLowerCase().includes(search) ||
        order.customer.toLowerCase().includes(search)

      const matchesCustomer =
        !customerFilter || order.customer === customerFilter

      const matchesStatus =
        !statusFilter || order.status === statusFilter

      return matchesSearch && matchesCustomer && matchesStatus
    })
  }, [orders, searchText, customerFilter, statusFilter])

  const totalSales = useMemo(() => {
    return orders.reduce((total, order) => {
      return (
        total +
        order.items.reduce(
          (orderTotal, item) => orderTotal + item.quantity * item.unitPrice,
          0,
        )
      )
    }, 0)
  }, [orders])

  const completedOrders = orders.filter(
    (order) => order.status === 'Completed',
  ).length

  const pendingOrders = orders.filter(
    (order) =>
      order.status === 'Pending' ||
      order.status === 'Confirmed' ||
      order.status === 'Shipped',
  ).length

  const calculateTotal = (order: SalesOrder) => {
    return order.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    )
  }

  const openCreateModal = () => {
    setEditingOrder(null)

    setItems([
      {
        id: Date.now(),
        product: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])

    form.resetFields()

    form.setFieldsValue({
      soNumber: `SO-${1001 + orders.length}`,
      orderDate: dayjs(),
      status: 'Draft',
    })

    setIsModalOpen(true)
  }

  const openEditModal = (order: SalesOrder) => {
    setEditingOrder(order)

    setItems(order.items.map((item) => ({ ...item })))

    form.setFieldsValue({
      soNumber: order.soNumber,
      customer: order.customer,
      orderDate: dayjs(order.orderDate),
      status: order.status,
    })

    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (items.length === 0) {
        message.error('Add at least one product to the sales order.')
        return
      }

      const invalidItem = items.some(
        (item) =>
          !item.product ||
          item.quantity <= 0 ||
          item.unitPrice < 0,
      )

      if (invalidItem) {
        message.error('Please complete all order items correctly.')
        return
      }

      if (editingOrder) {
        setOrders((current) =>
          current.map((order) =>
            order.id === editingOrder.id
              ? {
                  ...order,
                  soNumber: values.soNumber,
                  customer: values.customer,
                  orderDate: values.orderDate.format('YYYY-MM-DD'),
                  status: values.status,
                  items,
                }
              : order,
          ),
        )

        message.success('Sales order updated successfully.')
      } else {
        const newOrder: SalesOrder = {
          id: Date.now(),
          soNumber: values.soNumber,
          customer: values.customer,
          orderDate: values.orderDate.format('YYYY-MM-DD'),
          status: values.status,
          items,
        }

        setOrders((current) => [newOrder, ...current])

        message.success('Sales order created successfully.')
      }

      setIsModalOpen(false)
      form.resetFields()
      setItems([])
      setEditingOrder(null)
    } catch {
      // Ant Design displays validation errors automatically.
    }
  }

  const handleDelete = (id: number) => {
    setOrders((current) => current.filter((order) => order.id !== id))
    message.success('Sales order deleted successfully.')
  }

  const openViewModal = (order: SalesOrder) => {
    setViewingOrder(order)
    setIsViewModalOpen(true)
  }

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        product: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const updateItem = (
    id: number,
    field: keyof SalesOrderItem,
    value: string | number | null,
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value ?? 0,
            }
          : item,
      ),
    )
  }

  const itemTotal = items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  )

  const itemColumns: ColumnsType<SalesOrderItem> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <Select
          value={record.product || undefined}
          placeholder="Select product"
          style={{ width: '100%' }}
          onChange={(value) =>
            updateItem(record.id, 'product', value)
          }
          options={products.map((product) => ({
            label: product,
            value: product,
          }))}
        />
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 130,
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          style={{ width: '100%' }}
          onChange={(value) =>
            updateItem(record.id, 'quantity', value ?? 1)
          }
        />
      ),
    },
    {
      title: 'Unit Price',
      key: 'unitPrice',
      width: 150,
      render: (_, record) => (
        <InputNumber
          min={0}
          value={record.unitPrice}
          style={{ width: '100%' }}
          onChange={(value) =>
            updateItem(record.id, 'unitPrice', value ?? 0)
          }
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: 150,
      render: (_, record) => (
        <Text strong>
          {(record.quantity * record.unitPrice).toLocaleString()} MMK
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          disabled={items.length === 1}
          onClick={() => removeItem(record.id)}
        />
      ),
    },
  ]

  const columns: ColumnsType<SalesOrder> = [
    {
      title: 'SO Number',
      dataIndex: 'soNumber',
      key: 'soNumber',
      sorter: (a, b) => a.soNumber.localeCompare(b.soNumber),
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => record.items.length,
    },
    {
      title: 'Total',
      key: 'total',
      sorter: (a, b) => calculateTotal(a) - calculateTotal(b),
      render: (_, record) => (
        <Text strong>
          {calculateTotal(record).toLocaleString()} MMK
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SalesOrder['status']) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 170,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(record)}
          />

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />

          <Popconfirm
            title="Delete this sales order?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id)}
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
          <Title level={2} style={{ margin: 0 }}>
            Sales Orders
          </Title>

          <Text type="secondary">
            Manage customer orders and sales transactions
          </Text>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create Sales Order
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Total Orders</Text>
            <Title level={3} style={{ margin: '8px 0 0' }}>
              {orders.length}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Pending Orders</Text>
            <Title level={3} style={{ margin: '8px 0 0' }}>
              {pendingOrders}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Completed Orders</Text>
            <Title level={3} style={{ margin: '8px 0 0' }}>
              {completedOrders}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Total Sales</Text>
            <Title level={3} style={{ margin: '8px 0 0' }}>
              {totalSales.toLocaleString()} MMK
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
            placeholder="Search SO number or customer"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            style={{ width: 280 }}
          />

          <Select
            allowClear
            placeholder="Filter by customer"
            value={customerFilter}
            onChange={setCustomerFilter}
            style={{ width: 220 }}
            options={customers.map((customer) => ({
              label: customer,
              value: customer,
            }))}
          />

          <Select
            allowClear
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
            options={statusOptions.map((status) => ({
              label: status,
              value: status,
            }))}
          />
        </Space>

        <Table<SalesOrder>
          rowKey="id"
          columns={columns}
          dataSource={filteredOrders}
          scroll={{ x: 950 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>

      <Modal
        title={
          editingOrder
            ? 'Edit Sales Order'
            : 'Create Sales Order'
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setItems([])
          setEditingOrder(null)
        }}
        onOk={handleSubmit}
        okText={editingOrder ? 'Update' : 'Create'}
        width={1000}
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
                label="SO Number"
                name="soNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter sales order number.',
                  },
                ]}
              >
                <Input placeholder="SO-1001" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Customer"
                name="customer"
                rules={[
                  {
                    required: true,
                    message: 'Please select a customer.',
                  },
                ]}
              >
                <Select
                  placeholder="Select customer"
                  options={customers.map((customer) => ({
                    label: customer,
                    value: customer,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: 'Please select a status.',
                  },
                ]}
              >
                <Select
                  options={statusOptions.map((status) => ({
                    label: status,
                    value: status,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Order Date"
            name="orderDate"
            rules={[
              {
                required: true,
                message: 'Please select order date.',
              },
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 12 }}
          >
            <Col>
              <Text strong>Order Items</Text>
            </Col>

            <Col>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addItem}
              >
                Add Product
              </Button>
            </Col>
          </Row>

          <Table<SalesOrderItem>
            rowKey="id"
            columns={itemColumns}
            dataSource={items}
            pagination={false}
            scroll={{ x: 800 }}
            size="small"
          />

          <Row
            justify="end"
            style={{ marginTop: 20 }}
          >
            <Col>
              <Text strong style={{ fontSize: 18 }}>
                Total: {itemTotal.toLocaleString()} MMK
              </Text>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Sales Order Details"
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false)
          setViewingOrder(null)
        }}
        footer={null}
        width={850}
        destroyOnHidden
      >
        {viewingOrder && (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12}>
                <Text type="secondary">SO Number</Text>
                <div>
                  <Text strong>{viewingOrder.soNumber}</Text>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <Text type="secondary">Customer</Text>
                <div>
                  <Text strong>{viewingOrder.customer}</Text>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <Text type="secondary">Order Date</Text>
                <div>{viewingOrder.orderDate}</div>
              </Col>

              <Col xs={24} sm={12}>
                <Text type="secondary">Status</Text>
                <div>
                  <Tag color={statusColors[viewingOrder.status]}>
                    {viewingOrder.status}
                  </Tag>
                </div>
              </Col>
            </Row>

            <Table<SalesOrderItem>
              rowKey="id"
              pagination={false}
              dataSource={viewingOrder.items}
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'product',
                  key: 'product',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Unit Price',
                  dataIndex: 'unitPrice',
                  key: 'unitPrice',
                  render: (value: number) =>
                    `${value.toLocaleString()} MMK`,
                },
                {
                  title: 'Subtotal',
                  key: 'subtotal',
                  render: (_, item) =>
                    `${(
                      item.quantity * item.unitPrice
                    ).toLocaleString()} MMK`,
                },
              ]}
            />

            <Row justify="end" style={{ marginTop: 20 }}>
              <Text strong style={{ fontSize: 18 }}>
                Total:{' '}
                {calculateTotal(viewingOrder).toLocaleString()} MMK
              </Text>
            </Row>
          </>
        )}
      </Modal>
    </div>
  )
}