import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import type { NamePath } from 'antd/es/form/interface'

interface Option {
  value: number
  label: string
}

interface PurchaseRequestLineFormProps {
  field: {
    key: number
    name: number
  }
  fieldsCount: number
  productOptions: Option[]
  remove: (index: number) => void
}

export default function PurchaseRequestLineForm({
  field,
  fieldsCount,
  productOptions,
  remove,
}: PurchaseRequestLineFormProps) {
  const name = (
    fieldName: string
  ): NamePath =>
    [
      field.name,
      fieldName,
    ] as NamePath

  return (
    <div
      style={{
        border:
          '1px solid #d9d9d9',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <Space
        align="start"
        style={{
          display: 'flex',
          width: '100%',
        }}
        wrap
      >
        <Form.Item
          {...field}
          label="Product"
          name={name('productId')}
          style={{
            minWidth: 250,
            flex: 1,
          }}
          rules={[
            {
              required: true,
              message:
                'Please select a product',
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Select product"
            options={
              productOptions
            }
          />
        </Form.Item>

        <Form.Item
          {...field}
          label="Quantity"
          name={name('quantity')}
          rules={[
            {
              required: true,
              message:
                'Please enter quantity',
            },
            {
              type: 'number',
              min: 0.01,
              message:
                'Quantity must be greater than 0',
            },
          ]}
        >
          <InputNumber
            min={0.01}
            step={1}
            style={{
              width: 120,
            }}
          />
        </Form.Item>

        <Form.Item
          {...field}
          label="Unit"
          name={name('unit')}
          rules={[
            {
              required: true,
              message:
                'Please enter a unit',
            },
          ]}
        >
          <Input
            placeholder="PCS"
            style={{
              width: 100,
            }}
          />
        </Form.Item>

        {fieldsCount > 1 && (
          <Button
            type="text"
            danger
            icon={
              <MinusCircleOutlined />
            }
            onClick={() =>
              remove(field.name)
            }
            style={{
              marginTop: 30,
            }}
          />
        )}
      </Space>

      <Form.Item
        {...field}
        label="Description"
        name={name('description')}
      >
        <Input.TextArea
          rows={2}
          placeholder="Optional item description"
        />
      </Form.Item>

      <Space
        style={{
          display: 'flex',
          width: '100%',
        }}
        wrap
      >
        <Form.Item
          {...field}
          label="Required Date"
          name={name('requiredDate')}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          {...field}
          label="Notes"
          name={name('notes')}
          style={{
            flex: 1,
            minWidth: 250,
          }}
        >
          <Input
            placeholder="Optional notes"
          />
        </Form.Item>
      </Space>
    </div>
  )
}