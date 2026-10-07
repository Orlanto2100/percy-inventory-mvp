import {
  Card,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface AuditLog {
  key: number
  timestamp: string
  username: string
  action: string
  resource: string
  record: string
  details: string
}

const auditLogs: AuditLog[] = []

const columns: ColumnsType<AuditLog> = [
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: 'User',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: 'Resource',
    dataIndex: 'resource',
    key: 'resource',
  },
  {
    title: 'Record',
    dataIndex: 'record',
    key: 'record',
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
  },
]

function AuditLogPage() {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%' }}
    >
      <div>
        <Title level={2}>
          Audit Log
        </Title>

        <Text type="secondary">
          Review system activity and user actions.
        </Text>
      </div>

      <Card>
        <Space wrap>
          <Input
            placeholder="Search audit logs"
            allowClear
            style={{ width: 240 }}
          />

          <Select
            placeholder="Action"
            allowClear
            style={{ width: 160 }}
            options={[
              {
                value: 'CREATE',
                label: 'Create',
              },
              {
                value: 'UPDATE',
                label: 'Update',
              },
              {
                value: 'DELETE',
                label: 'Delete',
              },
              {
                value: 'LOGIN',
                label: 'Login',
              },
              {
                value: 'LOGOUT',
                label: 'Logout',
              },
            ]}
          />

          <Select
            placeholder="Resource"
            allowClear
            style={{ width: 180 }}
            options={[
              {
                value: 'USER',
                label: 'User',
              },
              {
                value: 'PRODUCT',
                label: 'Product',
              },
              {
                value: 'INVENTORY',
                label: 'Inventory',
              },
              {
                value: 'PURCHASE_ORDER',
                label: 'Purchase Order',
              },
              {
                value: 'SALES_ORDER',
                label: 'Sales Order',
              },
            ]}
          />

          <DatePicker.RangePicker />
        </Space>
      </Card>

      <Card>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={auditLogs}
          pagination={{
            pageSize: 10,
          }}
          locale={{
            emptyText: 'No audit records found',
          }}
          scroll={{ x: 900 }}
        />
      </Card>
    </Space>
  )
}

export default AuditLogPage