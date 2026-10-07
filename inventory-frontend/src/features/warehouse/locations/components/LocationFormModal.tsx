import {
  Form,
  Input,
  Modal,
  Select,
} from 'antd'

import type {
  LocationCreateRequest,
  LocationResponse,
  LocationType,
  LocationUpdateRequest,
} from '../../../../api/locationApi'

type SelectOption = {
  value: number
  label: string
}

type LocationFormValues = {
  name: string
  code: string
  type: LocationType
  warehouseId: number
}

type LocationFormModalProps = {
  open: boolean
  loading?: boolean
  location?: LocationResponse | null
  warehouseOptions: SelectOption[]
  onCancel: () => void
  onSubmit: (
    values:
      | LocationCreateRequest
      | LocationUpdateRequest
  ) => void | Promise<void>
}

const typeOptions: {
  value: LocationType
  label: string
}[] = [
  {
    value: 'STORAGE',
    label: 'Storage',
  },
  {
    value: 'RECEIVING',
    label: 'Receiving',
  },
  {
    value: 'SHIPPING',
    label: 'Shipping',
  },
  {
    value: 'QUARANTINE',
    label: 'Quarantine',
  },
]

export default function LocationFormModal({
  open,
  loading = false,
  location = null,
  warehouseOptions,
  onCancel,
  onSubmit,
}: LocationFormModalProps) {
  const [form] =
    Form.useForm<LocationFormValues>()

  const isEditing =
    location !== null

  const handleFinish = async (
    values: LocationFormValues
  ) => {
    if (isEditing) {
      const updateRequest: LocationUpdateRequest =
        {
          name: values.name,
          code: values.code,
          type: values.type,
        }

      await onSubmit(updateRequest)
      return
    }

    const createRequest: LocationCreateRequest =
      {
        name: values.name,
        code: values.code,
        type: values.type,
        warehouseId:
          values.warehouseId,
      }

    await onSubmit(createRequest)
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={
        isEditing
          ? 'Edit Location'
          : 'Create Location'
      }
      open={open}
      confirmLoading={loading}
      onCancel={handleCancel}
      onOk={() =>
        form.submit()
      }
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={
          location
            ? {
                name: location.name,
                code: location.code,
                type: location.type,
                warehouseId:
                  location.warehouseId,
              }
            : {
                name: '',
                code: '',
                type: 'STORAGE',
                warehouseId:
                  undefined,
              }
        }
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message:
                'Please enter the location name',
            },
            {
              max: 100,
              message:
                'Name must be 100 characters or fewer',
            },
          ]}
        >
          <Input
            placeholder="e.g. Main Storage"
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[
            {
              required: true,
              message:
                'Please enter the location code',
            },
            {
              max: 50,
              message:
                'Code must be 50 characters or fewer',
            },
          ]}
        >
          <Input
            placeholder="e.g. ST-A01"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
              message:
                'Please select a location type',
            },
          ]}
        >
          <Select
            options={typeOptions}
            placeholder="Select location type"
          />
        </Form.Item>

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
            options={warehouseOptions}
            placeholder="Select warehouse"
            disabled={isEditing}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
