import {
  Card,
  Col,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'

const { Title, Text } = Typography

type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

interface Permission {
  key: string
  resource: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

const initialPermissions: Record<Role, Permission[]> = {
  ADMIN: [
    {
      key: 'users',
      resource: 'Users',
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    {
      key: 'products',
      resource: 'Products',
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    {
      key: 'inventory',
      resource: 'Inventory',
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
  ],

  WAREHOUSE_STAFF: [
    {
      key: 'products',
      resource: 'Products',
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      key: 'inventory',
      resource: 'Inventory',
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      key: 'warehouses',
      resource: 'Warehouses',
      view: true,
      create: false,
      edit: true,
      delete: false,
    },
    {
      key: 'locations',
      resource: 'Locations',
      view: true,
      create: false,
      edit: true,
      delete: false,
    },
    {
      key: 'stock-movements',
      resource: 'Stock Movements',
      view: true,
      create: true,
      edit: false,
      delete: false,
    },
    {
      key: 'putaways',
      resource: 'Putaways',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'pickings',
      resource: 'Pickings',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
  ],

  PURCHASING_STAFF: [
    {
      key: 'vendors',
      resource: 'Vendors',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'purchase-requests',
      resource: 'Purchase Requests',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'rfqs',
      resource: 'RFQs',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'vendor-quotations',
      resource: 'Vendor Quotations',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'purchase-orders',
      resource: 'Purchase Orders',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'receipts',
      resource: 'Receipts',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
  ],

  SALES_STAFF: [
    {
      key: 'customers',
      resource: 'Customers',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'customer-quotations',
      resource: 'Customer Quotations',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'sales-orders',
      resource: 'Sales Orders',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'deliveries',
      resource: 'Deliveries',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      key: 'customer-invoices',
      resource: 'Customer Invoices',
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
  ],
}

function RolePermissionPage() {
  const [role, setRole] =
    useState<Role>('WAREHOUSE_STAFF')

  const permissions = initialPermissions[role]

  const columns: ColumnsType<Permission> = [
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      render: (value: boolean) => (
        <Switch checked={value} />
      ),
    },
    {
      title: 'Create',
      dataIndex: 'create',
      key: 'create',
      render: (value: boolean) => (
        <Switch checked={value} />
      ),
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      render: (value: boolean) => (
        <Switch checked={value} />
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (value: boolean) => (
        <Switch checked={value} />
      ),
    },
  ]

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%' }}
    >
      <div>
        <Title level={2}>
          Roles & Permissions
        </Title>

        <Text type="secondary">
          Configure permissions for each employee role.
        </Text>
      </div>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={role}
              onChange={setRole}
              style={{ width: '100%' }}
              options={[
                {
                  value: 'ADMIN',
                  label: 'Administrator',
                },
                {
                  value: 'WAREHOUSE_STAFF',
                  label: 'Warehouse Staff',
                },
                {
                  value: 'PURCHASING_STAFF',
                  label: 'Purchasing Staff',
                },
                {
                  value: 'SALES_STAFF',
                  label: 'Sales Staff',
                },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={permissions}
          pagination={false}
        />
      </Card>
    </Space>
  )
}

export default RolePermissionPage