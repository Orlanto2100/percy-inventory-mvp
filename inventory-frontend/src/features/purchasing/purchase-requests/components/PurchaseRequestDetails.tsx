import {
  Descriptions,
  Divider,
  Modal,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'

import type {
  PurchaseRequestResponse,
  PurchaseRequestStatus,
} from '../../../../api/purchaseRequestApi'

interface PurchaseRequestDetailsProps {
  open: boolean
  purchaseRequest:
    | PurchaseRequestResponse
    | null
  onClose: () => void
}

const statusColors: Record<
  PurchaseRequestStatus,
  string
> = {
  DRAFT: 'default',
  PENDING_APPROVAL: 'gold',
  APPROVED: 'blue',
  REJECTED: 'red',
  PROCESSING: 'purple',
  COMPLETED: 'green',
}

export default function PurchaseRequestDetails({
  open,
  purchaseRequest,
  onClose,
}: PurchaseRequestDetailsProps) {
  if (!purchaseRequest) {
    return null
  }

  const lineColumns: ColumnsType<
    PurchaseRequestResponse['lines'][number]
  > = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) =>
        record.productName ??
        '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (
        value: string | null
      ) => value ?? '-',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Required Date',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
      render: (
        value: string | null
      ) => value ?? '-',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (
        value: string | null
      ) => value ?? '-',
    },
  ]

  return (
    <Modal
      open={open}
      title={`Purchase Request ${purchaseRequest.requestNo}`}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Descriptions
        bordered
        column={2}
        size="small"
      >
        <Descriptions.Item label="Request No.">
          {purchaseRequest.requestNo}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag
            color={
              statusColors[
                purchaseRequest.status
              ]
            }
          >
            {purchaseRequest.status.replaceAll(
              '_',
              ' '
            )}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Requester">
          {purchaseRequest.requesterName}
        </Descriptions.Item>

        <Descriptions.Item label="Request Date">
          {purchaseRequest.requestDate}
        </Descriptions.Item>

        <Descriptions.Item label="Required Date">
          {purchaseRequest.requiredDate}
        </Descriptions.Item>

        <Descriptions.Item label="Warehouse">
          {purchaseRequest.warehouseName ??
            '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Location">
          {purchaseRequest.locationName ??
            '-'}
        </Descriptions.Item>

        <Descriptions.Item
          label="Reason"
          span={2}
        >
          {purchaseRequest.reason}
        </Descriptions.Item>

        <Descriptions.Item
          label="Notes"
          span={2}
        >
          {purchaseRequest.notes ??
            '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider>
        Purchase Items
      </Divider>

      <Table
        rowKey="id"
        columns={lineColumns}
        dataSource={
          purchaseRequest.lines
        }
        pagination={false}
        scroll={{
          x: 800,
        }}
      />
    </Modal>
  )
}