import { useEffect } from 'react'
import {
  Form,
  Input,
  Modal,
} from 'antd'

import type { VendorResponse } from '../../../../api/vendorApi'

export type VendorFormValues = {
  name: string
  phone: string
  email: string
  address: string
}

type VendorFormModalProps = {
  open: boolean
  editingVendor: VendorResponse | null
  submitting: boolean
  onCancel: () => void
  onSubmit: (values: VendorFormValues) => void
}

function VendorFormModal({
  open,
  editingVendor,
  submitting,
  onCancel,
  onSubmit,
}: VendorFormModalProps) {
  const [form] =
    Form.useForm<VendorFormValues>()

  useEffect(() => {
    if (!open) {
      return
    }

    if (editingVendor) {
      form.setFieldsValue({
        name: editingVendor.name,
        phone: editingVendor.phone,
        email: editingVendor.email,
        address: editingVendor.address,
      })
    } else {
      form.resetFields()
    }
  }, [
    open,
    editingVendor,
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
        editingVendor
          ? 'Edit Vendor'
          : 'Add Vendor'
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={
        editingVendor
          ? 'Save Changes'
          : 'Add Vendor'
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
          label="Vendor Name"
          name="name"
          rules={[
            {
              required: true,
              whitespace: true,
              message:
                'Please enter the vendor name',
            },
            {
              max: 100,
              message:
                'Vendor name cannot exceed 100 characters',
            },
          ]}
        >
          <Input
            placeholder="Enter vendor name"
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              required: true,
              whitespace: true,
              message:
                'Please enter the phone number',
            },
            {
              max: 50,
              message:
                'Phone number cannot exceed 50 characters',
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
              max: 100,
              message:
                'Email cannot exceed 100 characters',
            },
          ]}
        >
          <Input
            placeholder="Enter email address"
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
            placeholder="Enter vendor address"
            disabled={submitting}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default VendorFormModal