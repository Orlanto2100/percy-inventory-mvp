import {
  Form,
  Input,
  Modal,
  Select,
} from 'antd'
import { useEffect } from 'react'

import type {
  CreateUserRequest,
  Role,
} from '../types/user'

import { useWarehouses } from '../../../warehouse/warehouses/hooks/useWarehouses'

interface UserFormModalProps {
  open: boolean
  loading?: boolean
  onCancel: () => void
  onSubmit: (
    values: CreateUserRequest,
  ) => Promise<void>
}

export default function UserFormModal({
  open,
  loading = false,
  onCancel,
  onSubmit,
}: UserFormModalProps) {

  const [form] =
    Form.useForm<CreateUserRequest>()

  const role =
    Form.useWatch(
      'role',
      form,
    )

  // ==================================================
  // Warehouses
  // ==================================================

  const {
    warehouses,
    loading: warehousesLoading,
  } = useWarehouses()

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open, form])

  // ==================================================
  // Submit
  // ==================================================

  const handleFinish = async (
    values: CreateUserRequest,
  ) => {

    await onSubmit({
      ...values,

      // This form is ONLY for company accounts.
      accountType: 'COMPANY',

      // Company accounts require a role.
      role: values.role ?? null,

      // Only warehouse staff can have
      // an assigned warehouse.
      warehouseId:
        values.role === 'WAREHOUSE_STAFF'
          ? values.warehouseId
          : null,
    })

    form.resetFields()
  }

  return (
    <Modal
      title="Create Company User"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >

        {/* ==========================================
            Username
            ========================================== */}

        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message:
                'Username is required',
            },
            {
              max: 50,
              message:
                'Username must not exceed 50 characters',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* ==========================================
            Password
            ========================================== */}

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message:
                'Password is required',
            },
            {
              min: 8,
              message:
                'Password must be at least 8 characters',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* ==========================================
            Full Name
            ========================================== */}

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            {
              required: true,
              message:
                'Full name is required',
            },
            {
              max: 100,
              message:
                'Full name must not exceed 100 characters',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* ==========================================
            Email
            ========================================== */}

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: 'email',
              message:
                'Invalid email format',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* ==========================================
            Account Type
            ========================================== */}

        <Form.Item
          label="Account Type"
        >
          <Input
            value="Company"
            disabled
          />
        </Form.Item>

        {/* ==========================================
            Role
            ========================================== */}

        <Form.Item
          label="Role"
          name="role"
          rules={[
            {
              required: true,
              message:
                'Role is required for company users',
            },
          ]}
        >
          <Select<Role>
            placeholder="Select company role"
            options={[
              {
                label: 'Admin',
                value: 'ADMIN',
              },
              {
                label: 'Warehouse Staff',
                value: 'WAREHOUSE_STAFF',
              },
              {
                label: 'Purchasing Staff',
                value: 'PURCHASING_STAFF',
              },
              {
                label: 'Sales Staff',
                value: 'SALES_STAFF',
              },
            ]}
          />
        </Form.Item>

        {/* ==========================================
            Assigned Warehouse
            Warehouse Staff only
            ========================================== */}

        {role === 'WAREHOUSE_STAFF' && (
          <Form.Item
            label="Assigned Warehouse"
            name="warehouseId"
            rules={[
              {
                required: true,
                message:
                  'Warehouse is required for warehouse staff',
              },
            ]}
          >
            <Select<number>
              placeholder="Select warehouse"
              loading={
                warehousesLoading
              }
              options={warehouses
                .filter(
                  (warehouse) =>
                    warehouse.status ===
                    'ACTIVE',
                )
                .map(
                  (warehouse) => ({
                    label:
                      `${warehouse.code} - ${warehouse.name}`,

                    value:
                      warehouse.warehouseId,
                  }),
                )}
            />
          </Form.Item>
        )}

      </Form>
    </Modal>
  )
}