import { useEffect } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Modal,
} from 'antd'

import type { ProductResponse } from '../../../api/productApi'

export type ProductFormValues = {
  productName: string
  sku: string
  price: number
  description?: string
}

type ProductModalProps = {
  open: boolean
  editingProduct: ProductResponse | null
  submitting: boolean
  onCancel: () => void
  onSubmit: (values: ProductFormValues) => void
}

export default function ProductModal({
  open,
  editingProduct,
  submitting,
  onCancel,
  onSubmit,
}: ProductModalProps) {
  const [form] = Form.useForm<ProductFormValues>()

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        productName: editingProduct.productName,
        sku: editingProduct.sku,
        price: editingProduct.price,
        description:
          editingProduct.description ?? undefined,
      })
    } else {
      form.resetFields()

      form.setFieldsValue({
        price: 0,
      })
    }
  }, [editingProduct, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      onSubmit(values)
    } catch {
      // Ant Design displays validation errors automatically.
    }
  }

  return (
    <Modal
      title={
        editingProduct
          ? 'Edit Product'
          : 'Add Product'
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={
        editingProduct
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
          label="Product Name"
          name="productName"
          rules={[
            {
              required: true,
              message:
                'Please enter the product name',
            },
            {
              max: 100,
              message:
                'Product name cannot exceed 100 characters',
            },
          ]}
        >
          <Input
            placeholder="e.g. Cheeseburger"
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label="SKU"
          name="sku"
          rules={[
            {
              required: true,
              message: 'Please enter the SKU',
            },
            {
              max: 50,
              message:
                'SKU cannot exceed 50 characters',
            },
          ]}
        >
          <Input
            placeholder="e.g. BURGER-001"
            maxLength={50}
            disabled={!!editingProduct}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: 'Please enter the price',
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{
              width: '100%',
            }}
            placeholder="Price"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              max: 1000,
              message:
                'Description cannot exceed 1000 characters',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter a product description..."
            maxLength={1000}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}