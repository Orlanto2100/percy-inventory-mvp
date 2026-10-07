import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { Dayjs } from 'dayjs'

const { Text } = Typography

export type RfqFormValues = {
  title: string
  responseDeadline: Dayjs | null
  description?: string
  vendorIds: number[]
  items: {
    productId: number
    quantity: number
    notes?: string
  }[]
  emailSubject?: string
  emailMessage?: string
}

type SelectOption = {
  label: string
  value: number
}

type RfqFormModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (
    values: RfqFormValues,
  ) => Promise<void>
  submitting?: boolean
  vendors: SelectOption[]
  products: SelectOption[]
}

function RfqFormModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  vendors,
  products,
}: RfqFormModalProps) {
  const [form] =
    Form.useForm<RfqFormValues>()

  const handleSubmit = async () => {
    try {
      const values =
        await form.validateFields()

      await onSubmit(values)

      form.resetFields()
    } catch {
      // Ant Design displays validation errors.
    }
  }

  const handleClose = () => {
    if (submitting) {
      return
    }

    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Create Request for Quotation"
      open={open}
      onCancel={handleClose}
      width={720}
      destroyOnHidden
      footer={
        <Flex
          justify="flex-end"
          gap={8}
        >
          <Button
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            loading={submitting}
            onClick={handleSubmit}
          >
            Create RFQ
          </Button>
        </Flex>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          vendorIds: [],
          items: [
            {
              productId: undefined,
              quantity: 1,
              notes: '',
            },
          ],
        }}
      >
        {/* ==========================================
            Title
            ========================================== */}

        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message:
                'Please enter an RFQ title',
            },
          ]}
        >
          <Input
            placeholder="e.g. Office Furniture"
          />
        </Form.Item>

        {/* ==========================================
            Response Deadline
            ========================================== */}

        <Form.Item
          label="Response Deadline"
          name="responseDeadline"
          rules={[
            {
              required: true,
              message:
                'Please select a response deadline',
            },
          ]}
        >
          <DatePicker
            style={{
              width: '100%',
            }}
            format="DD MMM YYYY"
          />
        </Form.Item>

        {/* ==========================================
            Vendors
            ========================================== */}

        <Form.Item
          label="Vendors"
          name="vendorIds"
          rules={[
            {
              required: true,
              message:
                'Please select at least one vendor',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select vendors"
            showSearch
            optionFilterProp="label"
            options={vendors}
          />
        </Form.Item>

        {/* ==========================================
            Description
            ========================================== */}

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            rows={4}
            placeholder="Describe the requirements..."
          />
        </Form.Item>

        {/* ==========================================
            Requested Items
            ========================================== */}

        <div
          style={{
            marginBottom: 16,
          }}
        >
          <Text strong>
            Requested Items
          </Text>
        </div>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(
                ({
                  key,
                  name,
                  ...restField
                }) => (
                  <Flex
                    key={key}
                    gap={8}
                    align="flex-start"
                    style={{
                      marginBottom: 12,
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        'productId',
                      ]}
                      rules={[
                        {
                          required: true,
                          message:
                            'Select a product',
                        },
                      ]}
                      style={{
                        flex: 1,
                        marginBottom: 0,
                      }}
                    >
                      <Select
                        placeholder="Select product"
                        showSearch
                        optionFilterProp="label"
                        options={products}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        'quantity',
                      ]}
                      rules={[
                        {
                          required: true,
                          message:
                            'Enter quantity',
                        },
                      ]}
                      style={{
                        width: 110,
                        marginBottom: 0,
                      }}
                    >
                      <InputNumber
                        min={1}
                        style={{
                          width: '100%',
                        }}
                        placeholder="Qty"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        'notes',
                      ]}
                      style={{
                        flex: 1,
                        marginBottom: 0,
                      }}
                    >
                      <Input
                        placeholder="Notes"
                      />
                    </Form.Item>

                    <Button
                      danger
                      type="text"
                      icon={
                        <DeleteOutlined />
                      }
                      disabled={
                        fields.length === 1
                      }
                      onClick={() =>
                        remove(name)
                      }
                    />
                  </Flex>
                ),
              )}

              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() =>
                  add({
                    quantity: 1,
                    notes: '',
                  })
                }
              >
                Add Item
              </Button>
            </>
          )}
        </Form.List>

        {/* ==========================================
            Email
            ========================================== */}

        <Form.Item
          label="Email Subject"
          name="emailSubject"
          style={{
            marginTop: 24,
          }}
        >
          <Input
            placeholder="Request for Quotation"
          />
        </Form.Item>

        <Form.Item
          label="Email Message"
          name="emailMessage"
        >
          <Input.TextArea
            rows={7}
            placeholder="Write the message that will be sent to vendors..."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RfqFormModal