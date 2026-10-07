import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'

import type { User } from '../types/user'

interface UserTableProps {
  users: User[]
  loading: boolean
  onView: (user: User) => void
  onDeactivate: (id: number) => Promise<void>
  onActivate: (id: number) => Promise<void>
}

export default function UserTable({
  users,
  loading,
  onView,
  onDeactivate,
  onActivate,
}: UserTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string | null) =>
        email || '-',
    },
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (accountType) => (
        <Tag>{accountType}</Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) =>
        role ? <Tag>{role}</Tag> : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => onView(user)}
          >
            View
          </Button>

          {user.status === 'ACTIVE' ? (
            <Popconfirm
              title="Deactivate this user?"
              description="The user will no longer be able to log in."
              onConfirm={() =>
                onDeactivate(user.id)
              }
              okText="Deactivate"
              cancelText="Cancel"
            >
              <Button
                danger
                size="small"
              >
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Activate this user?"
              description="The user will be able to log in again."
              onConfirm={() =>
                onActivate(user.id)
              }
              okText="Activate"
              cancelText="Cancel"
            >
              <Button
                type="primary"
                size="small"
              >
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Table<User>
      rowKey="id"
      columns={columns}
      dataSource={users}
      loading={loading}
    />
  )
}