import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
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

type PurchaseOrderItem = {
  id: number
  product: string
  quantity: number
  unitPrice: number
}

type PurchaseOrder = {
  id: number
  poNumber: string
  vendor: string
  orderDate: string
  expectedDate: string
  status: 'Draft' | 'Pending' | 'Received' | 'Cancelled'
  items: PurchaseOrderItem[]
}

type PurchaseOrderFormValues = {
  poNumber: string
  vendor: string
  orderDate: dayjs.Dayjs
  expectedDate: dayjs.Dayjs
  status: PurchaseOrder['status']
}

const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    poNumber: 'PO-0001',
    vendor: 'ABC Foods Co.',
    orderDate: '2026-09-01',
    expectedDate: '2026-09-05',
    status: 'Received',
    items: [
      {
        id: 1,
        product: 'Cheeseburger',
        quantity: 50,
        unitPrice: 3500,
      },
      {
        id: 2,
        product: 'French Fries',
        quantity: 30,
        unitPrice: 1800,
      },
    ],
  },
  {
    id: 2,
    poNumber: 'PO-0002',
    vendor: 'Yangon Beverage Ltd.',
    orderDate: '2026-09-03',
    expectedDate: '2026-09-10',
    status: 'Pending',
    items: [
      {
        id: 1,
        product: 'Coca Cola',
        quantity: 100,
        unitPrice: 1200,
      },
      {
        id: 2,
        product: 'Mineral Water',
        quantity: 80,
        unitPrice: 700,
      },
    ],
  },
  {
    id: 3,
    poNumber: 'PO-0003',
    vendor: 'Tech Supply Myanmar',
    orderDate: '2026-09-04',
    expectedDate: '2026-09-12',
    status: 'Draft',
    items: [
      {
        id: 1,
        product: 'Wireless Mouse',
        quantity: 20,
        unitPrice: 18000,
      },
      {
        id: 2,
        product: 'USB-C Cable',
        quantity: 30,
        unitPrice: 9000,
      },
    ],
  },
  {
    id: 4,
    poNumber: 'PO-0004',
    vendor: 'ABC Foods Co.',
    orderDate: '2026-09-05',
    expectedDate: '2026-09-08',
    status: 'Cancelled',
    items: [
      {
        id: 1,
        product: 'Classic Burger',
        quantity: 40,
        unitPrice: 3000,
      },
    ],
  },
]

const vendors = [
  'ABC Foods Co.',
  'Yangon Beverage Ltd.',
  'Tech Supply Myanmar',
]

const products = [
  'Cheeseburger',
  'Classic Burger',
  'French Fries',
  'Coca Cola',
  'Mineral Water',
  'Wireless Mouse',
  'USB-C Cable',
  'Laptop Stand',
]

export default function PurchaseOrderPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(
    initialPurchaseOrders,
  )

  const [search, setSearch] = useState('')
  const [vendorFilter, setVendorFilter] = useState<
    string | undefined
  >()
  const [statusFilter, setStatusFilter] = useState<
    PurchaseOrder['status'] | undefined
  >()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [editingOrder, setEditingOrder] =
    useState<PurchaseOrder | null>(null)

  const [viewingOrder, setViewingOrder] =
    useState<PurchaseOrder | null>(null)

  const [form] = Form.useForm<PurchaseOrderFormValues>()

  const [items, setItems] = useState<PurchaseOrderItem[]>([])

  const getOrderTotal = (order: PurchaseOrder) =>
    order.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    )

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        order.poNumber.toLowerCase().includes(searchValue) ||
        order.vendor.toLowerCase().includes(searchValue)

      const matchesVendor = vendorFilter
        ? order.vendor === vendorFilter
        : true

      const matchesStatus = statusFilter
        ? order.status === statusFilter
        : true

      return matchesSearch && matchesVendor && matchesStatus
    })
  }, [orders, search, vendorFilter, statusFilter])

  const openCreateModal = () => {
    setEditingOrder(null)

    form.resetFields()

    form.setFieldsValue({
      orderDate: dayjs(),
      status: 'Draft',
    })

    setItems([])

    setIsModalOpen(true)
  }

  const openEditModal = (order: PurchaseOrder) => {
    setEditingOrder(order)

    form.setFieldsValue({
      poNumber: order.poNumber,
      vendor: order.vendor,
      orderDate: dayjs(order.orderDate),
      expectedDate: dayjs(order.expectedDate),
      status: order.status,
    })

    setItems(order.items.map((item) => ({ ...item })))

    setIsModalOpen(true)
  }

  const openViewModal = (order: PurchaseOrder) => {
    setViewingOrder(order)
    setIsViewModalOpen(true)
  }

  const addItem = () => {
    setItems((currentItems) => [
      ...currentItems,
      {
        id: Date.now(),
        product: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const updateItem = (
    id: number,
    field: keyof PurchaseOrderItem,
    value: string | number,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const removeItem = (id: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    )
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (items.length === 0) {
        message.error('Please add at least one product')
        return
      }

      const hasInvalidItem = items.some(
        (item) =>
          !item.product ||
          item.quantity <= 0 ||
          item.unitPrice < 0,
      )

      if (hasInvalidItem) {
        message.error('Please complete all purchase order items')
        return
      }

      const orderData: PurchaseOrder = {
        id: editingOrder?.id ?? Date.now(),
        poNumber: values.poNumber,
        vendor: values.vendor,
        orderDate: values.orderDate.format('YYYY-MM-DD'),
        expectedDate: values.expectedDate.format('YYYY-MM-DD'),
        status: values.status,
        items,
      }

      if (editingOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order.id === editingOrder.id ? orderData : order,
          ),
        )

        message.success('Purchase order updated successfully')
      } else {
        setOrders((currentOrders) => [
          ...currentOrders,
          orderData,
        ])

        message.success('Purchase order created successfully')
      }

      setIsModalOpen(false)
      form.resetFields()
      setItems([])
    } catch {
      // Ant Design handles form validation errors
    }
  }

  const handleDelete = (order: PurchaseOrder) => {
    Modal.confirm({
      title: 'Delete purchase order?',
      content: `Are you sure you want to delete ${order.poNumber}?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setOrders((currentOrders) =>
          currentOrders.filter((item) => item.id !== order.id),
        )

        message.success('Purchase order deleted successfully')
      },
    })
  }

  const columns: ColumnsType<PurchaseOrder> = [
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      key: 'poNumber',
      sorter: (a, b) =>
        a.poNumber.localeCompare(b.poNumber),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) =>
        dayjs(a.orderDate).valueOf() -
        dayjs(b.orderDate).valueOf(),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
    },
    {
      title: 'Items',
      key: 'items',
      align: 'center',
      render: (_, order) => order.items.length,
    },
    {
      title: 'Total',
      key: 'total',
      align: 'right',
      sorter: (a, b) =>
        getOrderTotal(a) - getOrderTotal(b),
      render: (_, order) =>
        `${getOrderTotal(order).toLocaleString()} MMK`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PurchaseOrder['status']) => {
        const colorMap: Record<
          PurchaseOrder['status'],
          string
        > = {
          Draft: 'default',
          Pending: 'blue',
          Received: 'green',
          Cancelled: 'red',
        }

        return (
          <Tag color={colorMap[status]}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, order) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(order)}
          />

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(order)}
          />

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(order)}
          />
        </Space>
      ),
    },
  ]

  const itemColumns: ColumnsType<PurchaseOrderItem> = [
    {
      title: 'Product',
      key: 'product',
      width: 260,
      render: (_, item) => (
        <Select
          placeholder="Select product"
          value={item.product || undefined}
          onChange={(value) =>
            updateItem(item.id, 'product', value)
          }
          options={products.map((product) => ({
            label: product,
            value: product,
          }))}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 130,
      render: (_, item) => (
        <InputNumber
          min={1}
          value={item.quantity}
          onChange={(value) =>
            updateItem(item.id, 'quantity', value ?? 1)
          }
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Unit Price',
      key: 'unitPrice',
      width: 160,
      render: (_, item) => (
        <InputNumber
          min={0}
          value={item.unitPrice}
          onChange={(value) =>
            updateItem(item.id, 'unitPrice', value ?? 0)
          }
          style={{ width: '100%' }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) =>
            Number((value ?? '').replace(/,/g, ''))
          }
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: 150,
      align: 'right',
      render: (_, item) =>
        `${(
          item.quantity * item.unitPrice
        ).toLocaleString()} MMK`,
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_, item) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(item.id)}
        />
      ),
    },
  ]

  const editingTotal = items.reduce(
    (total, item) =>
      total + item.quantity * item.unitPrice,
    0,
  )

  return (
    <div>
      {/* Filters */}
      <Card
        bordered={false}
        style={{ marginBottom: 16 }}
      >
        <Space
          wrap
          style={{
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Space wrap>
            <Input
              placeholder="Search PO number or vendor"
              prefix={<SearchOutlined />}
              allowClear
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{ width: 270 }}
            />

            <Select
              placeholder="Vendor"
              allowClear
              value={vendorFilter}
              onChange={setVendorFilter}
              style={{ width: 190 }}
              options={vendors.map((vendor) => ({
                label: vendor,
                value: vendor,
              }))}
            />

            <Select
              placeholder="Status"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              options={[
                { label: 'Draft', value: 'Draft' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Received', value: 'Received' },
                {
                  label: 'Cancelled',
                  value: 'Cancelled',
                },
              ]}
            />
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create Purchase Order
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card bordered={false}>
        <Table<PurchaseOrder>
          rowKey="id"
          columns={columns}
          dataSource={filteredOrders}
          scroll={{ x: 1100 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) =>
              `Total ${total} purchase orders`,
          }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={
          editingOrder
            ? 'Edit Purchase Order'
            : 'Create Purchase Order'
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setItems([])
        }}
        onOk={handleSubmit}
        okText={
          editingOrder
            ? 'Save Changes'
            : 'Create Purchase Order'
        }
        width={1000}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Space
            size={16}
            style={{
              width: '100%',
              alignItems: 'flex-start',
            }}
          >
            <Form.Item
              label="PO Number"
              name="poNumber"
              rules={[
                {
                  required: true,
                  message: 'Please enter PO number',
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="PO-0005" />
            </Form.Item>

            <Form.Item
              label="Vendor"
              name="vendor"
              rules={[
                {
                  required: true,
                  message: 'Please select a vendor',
                },
              ]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Select vendor"
                options={vendors.map((vendor) => ({
                  label: vendor,
                  value: vendor,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Please select a status',
                },
              ]}
              style={{ flex: 1 }}
            >
              <Select
                options={[
                  {
                    label: 'Draft',
                    value: 'Draft',
                  },
                  {
                    label: 'Pending',
                    value: 'Pending',
                  },
                  {
                    label: 'Received',
                    value: 'Received',
                  },
                  {
                    label: 'Cancelled',
                    value: 'Cancelled',
                  },
                ]}
              />
            </Form.Item>
          </Space>

          <Space
            size={16}
            style={{
              width: '100%',
              alignItems: 'flex-start',
            }}
          >
            <Form.Item
              label="Order Date"
              name="orderDate"
              rules={[
                {
                  required: true,
                  message: 'Please select order date',
                },
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Expected Delivery"
              name="expectedDate"
              rules={[
                {
                  required: true,
                  message:
                    'Please select expected delivery date',
                },
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker
                style={{ width: '100%' }}
              />
            </Form.Item>

            <div style={{ flex: 1 }} />
          </Space>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <strong>Order Items</strong>

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addItem}
            >
              Add Product
            </Button>
          </div>

          <Table<PurchaseOrderItem>
            rowKey="id"
            columns={itemColumns}
            dataSource={items}
            pagination={false}
            scroll={{ x: 800 }}
            locale={{
              emptyText:
                'No products added. Click "Add Product".',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 20,
              fontSize: 18,
            }}
          >
            <strong>
              Total: {editingTotal.toLocaleString()} MMK
            </strong>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={
          viewingOrder
            ? `Purchase Order ${viewingOrder.poNumber}`
            : 'Purchase Order'
        }
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false)
          setViewingOrder(null)
        }}
        footer={null}
        width={900}
      >
        {viewingOrder && (
          <>
            <Space
              direction="vertical"
              size={16}
              style={{
                width: '100%',
                marginTop: 10,
              }}
            >
              <Space size={40} wrap>
                <div>
                  <div
                    style={{
                      color: '#64748b',
                      marginBottom: 4,
                    }}
                  >
                    PO Number
                  </div>
                  <strong>
                    {viewingOrder.poNumber}
                  </strong>
                </div>

                <div>
                  <div
                    style={{
                      color: '#64748b',
                      marginBottom: 4,
                    }}
                  >
                    Vendor
                  </div>
                  <strong>
                    {viewingOrder.vendor}
                  </strong>
                </div>

                <div>
                  <div
                    style={{
                      color: '#64748b',
                      marginBottom: 4,
                    }}
                  >
                    Order Date
                  </div>
                  <strong>
                    {viewingOrder.orderDate}
                  </strong>
                </div>

                <div>
                  <div
                    style={{
                      color: '#64748b',
                      marginBottom: 4,
                    }}
                  >
                    Expected Delivery
                  </div>
                  <strong>
                    {viewingOrder.expectedDate}
                  </strong>
                </div>

                <div>
                  <div
                    style={{
                      color: '#64748b',
                      marginBottom: 4,
                    }}
                  >
                    Status
                  </div>

                  <Tag
                    color={
                      viewingOrder.status === 'Received'
                        ? 'green'
                        : viewingOrder.status ===
                            'Cancelled'
                          ? 'red'
                          : viewingOrder.status ===
                              'Pending'
                            ? 'blue'
                            : 'default'
                    }
                  >
                    {viewingOrder.status}
                  </Tag>
                </div>
              </Space>

              <Table<PurchaseOrderItem>
                rowKey="id"
                pagination={false}
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
                    align: 'right',
                  },
                  {
                    title: 'Unit Price',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    align: 'right',
                    render: (value: number) =>
                      `${value.toLocaleString()} MMK`,
                  },
                  {
                    title: 'Subtotal',
                    key: 'subtotal',
                    align: 'right',
                    render: (_, item) =>
                      `${(
                        item.quantity *
                        item.unitPrice
                      ).toLocaleString()} MMK`,
                  },
                ]}
                dataSource={viewingOrder.items}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: 18,
                }}
              >
                <strong>
                  Total:{' '}
                  {getOrderTotal(
                    viewingOrder,
                  ).toLocaleString()}{' '}
                  MMK
                </strong>
              </div>
            </Space>
          </>
        )}
      </Modal>
    </div>
  )
}