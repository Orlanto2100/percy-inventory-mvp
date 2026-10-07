import { useEffect } from 'react'
import {
  Form,
  Input,
  Modal,
} from 'antd'

import type { CustomerResponse } from '../../../api/customerApi'

export type CustomerFormValues = {
  name: string
  phone: string
  email?: string
  address?: string
}

type CustomerModalProps = {
  open: boolean
  editingCustomer: CustomerResponse | null
  submitting: boolean
  onCancel: () => void
  onSubmit: (values: CustomerFormValues) => void
}

export default function CustomerModal({
  open,
  editingCustomer,
  submitting,
  onCancel,
  onSubmit,
}: CustomerModalProps) {
  const [form] =
    Form.useForm<CustomerFormValues>()

  useEffect(() => {
    if (editingCustomer) {
      form.setFieldsValue({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        email:
          editingCustomer.email ?? undefined,
        address:
          editingCustomer.address ?? undefined,
      })
    } else {
      form.resetFields()
    }
  }, [editingCustomer, form])

  const handleSubmit = async () => {
    try {
      const values =
        await form.validateFields()

      onSubmit(values)
    } catch {
      // Ant Design displays validation errors automatically.
    }
  }

  return (
    <Modal
      title={
        editingCustomer
          ? 'Edit Customer'
          : 'Add Customer'
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={
        editingCustomer
          ? 'Update'
          : 'Create'
      }
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        style={{
          marginTop: 24,
        }}
      >
        <Form.Item
          label="Customer Name"
          name="name"
          rules={[
            {
              required: true,
              message:
                'Please enter the customer name',
            },
          ]}
        >
          <Input
            placeholder="e.g. John Doe"
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              required: true,
              message:
                'Please enter the phone number',
            },
          ]}
        >
          <Input
            placeholder="e.g. 09123456789"
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
          ]}
        >
          <Input
            placeholder="e.g. john@example.com"
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter customer address..."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}