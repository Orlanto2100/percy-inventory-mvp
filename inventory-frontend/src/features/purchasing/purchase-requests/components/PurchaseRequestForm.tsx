import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import type {
  CreatePurchaseRequestRequest,
  PurchaseRequestResponse,
  UpdatePurchaseRequestRequest,
} from '../../../../api/purchaseRequestApi'

import PurchaseRequestLineForm from './PurchaseRequestLineForm'

import {
  usePurchaseRequestForm,
  type PurchaseRequestFormValues,
} from '../hooks/usePurchaseRequestForm'

type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

interface Option {
  value: number
  label: string
}

interface PurchaseRequestFormProps {
  open: boolean
  loading?: boolean
  purchaseRequest?: PurchaseRequestResponse | null
  role: Role | null
  assignedWarehouseId?: number
  warehouseOptions: Option[]
  productOptions: Option[]
  onCancel: () => void
  onSubmit: (
    values:
      | CreatePurchaseRequestRequest
      | UpdatePurchaseRequestRequest
  ) => Promise<void>
}

export default function PurchaseRequestForm({
  open,
  loading = false,
  purchaseRequest,
  role,
  assignedWarehouseId,
  warehouseOptions,
  productOptions,
  onCancel,
  onSubmit,
}: PurchaseRequestFormProps) {
  const [
    form,
  ] = Form.useForm<PurchaseRequestFormValues>()

  /*
   * Watch the warehouse actually selected
   * inside the form.
   */
  const selectedWarehouseId =
    Form.useWatch(
      'warehouseId',
      form
    )

  const {
    isEditing,
    initialValues,
    locationsLoading,
    locationOptions,
    getWarehouseOptions,
    handleWarehouseChange,
    prepareRequest,
  } = usePurchaseRequestForm({
    open,
    purchaseRequest,
    role,
    assignedWarehouseId,
    warehouseOptions,
    selectedWarehouseId,
  })

  const handleFinish = async (
    values: PurchaseRequestFormValues
  ) => {
    await onSubmit(
      prepareRequest(values)
    )
  }

  return (
    <Modal
      open={open}
      title={
        isEditing
          ? 'Edit Purchase Request'
          : 'Create Purchase Request'
      }
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Warehouse"
          name="warehouseId"
          rules={[
            {
              required: true,
              message:
                'Please select a warehouse',
            },
          ]}
        >
          <Select
            placeholder="Select warehouse"
            options={
              getWarehouseOptions()
            }
            disabled={
              role ===
              'WAREHOUSE_STAFF'
            }
            allowClear
            onChange={
              handleWarehouseChange
            }
          />
        </Form.Item>

        <Form.Item
          label="Location"
          name="locationId"
        >
          <Select
            placeholder={
              !selectedWarehouseId
                ? 'Select warehouse first'
                : locationsLoading
                  ? 'Loading locations...'
                  : locationOptions.length > 0
                    ? 'Select location'
                    : 'No locations available'
            }
            options={
              locationOptions
            }
            loading={
              locationsLoading
            }
            disabled={
              !selectedWarehouseId ||
              locationsLoading
            }
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          label="Required Date"
          name="requiredDate"
          rules={[
            {
              required: true,
              message:
                'Please select the required date',
            },
          ]}
        >
          <DatePicker
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

        <Form.Item
          label="Reason"
          name="reason"
          rules={[
            {
              required: true,
              message:
                'Please enter the reason',
            },
            {
              max: 500,
              message:
                'Reason cannot exceed 500 characters',
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Why is this purchase required?"
          />
        </Form.Item>

        <Form.Item
          label="Notes"
          name="notes"
        >
          <Input.TextArea
            rows={3}
            placeholder="Additional notes"
          />
        </Form.Item>

        <Form.List
          name="lines"
          rules={[
            {
              validator: async (
                _,
                lines
              ) => {
                if (
                  !lines ||
                  lines.length === 0
                ) {
                  return Promise.reject(
                    new Error(
                      'At least one purchase line is required'
                    )
                  )
                }
              },
            },
          ]}
        >
          {(
            fields,
            { add, remove }
          ) => (
            <>
              <Space
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  width: '100%',
                  marginBottom: 16,
                }}
              >
                <strong>
                  Purchase Items
                </strong>

                <Button
                  type="dashed"
                  icon={
                    <PlusOutlined />
                  }
                  onClick={() =>
                    add({
                      quantity: 1,
                      unit: 'PCS',
                    })
                  }
                >
                  Add Item
                </Button>
              </Space>

              {fields.map(
                (field) => (
                  <PurchaseRequestLineForm
                    key={field.key}
                    field={field}
                    fieldsCount={
                      fields.length
                    }
                    productOptions={
                      productOptions
                    }
                    remove={remove}
                  />
                )
              )}
            </>
          )}
        </Form.List>

        <Space
          style={{
            display: 'flex',
            justifyContent:
              'flex-end',
            width: '100%',
            marginTop: 24,
          }}
        >
          <Button
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {isEditing
              ? 'Update'
              : 'Create'}
          </Button>
        </Space>
      </Form>
    </Modal>
  )
}