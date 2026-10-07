import { useEffect } from 'react'
import {
  Form,
  Input,
  Modal,
} from 'antd'

import type { WarehouseResponse } from '../../../../api/warehouseApi'

export type WarehouseFormValues = {
  code: string
  name: string
  address?: string
  city?: string
  phoneNumber?: string
  email?: string
}

type WarehouseFormModalProps = {
  open: boolean
  editingWarehouse: WarehouseResponse | null
  submitting: boolean
  onCancel: () => void
  onSubmit: (values: WarehouseFormValues) => void
}

function WarehouseFormModal({
  open,
  editingWarehouse,
  submitting,
  onCancel,
  onSubmit,
}: WarehouseFormModalProps) {
  const [form] =
    Form.useForm<WarehouseFormValues>()

  useEffect(() => {
    if (!open) {
      return
    }

    if (editingWarehouse) {
      form.setFieldsValue({
        code: editingWarehouse.code,
        name: editingWarehouse.name,
        address:
          editingWarehouse.address ?? undefined,
        city:
          editingWarehouse.city ?? undefined,
        phoneNumber:
          editingWarehouse.phoneNumber ?? undefined,
        email:
          editingWarehouse.email ?? undefined,
      })
    } else {
      form.resetFields()
    }
  }, [
    open,
    editingWarehouse,
    form,
  ])

  async function handleSubmit(): Promise<void> {
    const values =
      await form.validateFields()

    onSubmit(values)
  }

  return (
    <Modal
      title={
        editingWarehouse
          ? 'Edit Warehouse'
          : 'Add Warehouse'
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={
        editingWarehouse
          ? 'Save Changes'
          : 'Add Warehouse'
      }
      cancelText="Cancel"
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Warehouse Code"
          name="code"
          rules={[
            {
              required: true,
              whitespace: true,
              message:
                'Please enter the warehouse code',
            },
            {
              max: 50,
              message:
                'Warehouse code cannot exceed 50 characters',
            },
          ]}
        >
          <Input
            placeholder="Enter warehouse code"
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item
          label="Warehouse Name"
          name="name"
          rules={[
            {
              required: true,
              whitespace: true,
              message:
                'Please enter the warehouse name',
            },
            {
              max: 100,
              message:
                'Warehouse name cannot exceed 100 characters',
            },
          ]}
        >
          <Input
            placeholder="Enter warehouse name"
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              max: 250,
              message:
                'Address cannot exceed 250 characters',
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter warehouse address"
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[
            {
              max: 100,
              message:
                'City cannot exceed 100 characters',
            },
          ]}
        >
          <Input
            placeholder="Enter city"
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              max: 20,
              message:
                'Phone number cannot exceed 20 characters',
            },
          ]}
        >
          <Input
            placeholder="Enter phone number"
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: 'email',
              message:
                'Please enter a valid email address',
            },
            {
              max: 254,
              message:
                'Email cannot exceed 254 characters',
            },
          ]}
        >
          <Input
            placeholder="Enter email address"
            disabled={submitting}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default WarehouseFormModal