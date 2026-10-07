import { Descriptions, Modal, Tag } from 'antd'

import type { User } from '../types/user'

interface UserDetailsModalProps {
  open: boolean
  user: User | null
  onClose: () => void
}

export default function UserDetailsModal({
  open,
  user,
  onClose,
}: UserDetailsModalProps) {
  if (!user) {
    return null
  }

  const isWarehouseStaff =
    user.role === 'WAREHOUSE_STAFF'

  return (
    <Modal
      title="User Details"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions
        column={1}
        bordered
      >
        <Descriptions.Item label="Username">
          {user.username}
        </Descriptions.Item>

        <Descriptions.Item label="Full Name">
          {user.fullName}
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          {user.email || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Account Type">
          <Tag>{user.accountType}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Role">
          {user.role ? (
            <Tag>{user.role}</Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>

        {isWarehouseStaff && (
          <Descriptions.Item label="Assigned Warehouse">
            {user.warehouseId ?? 'Not assigned'}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  )
}