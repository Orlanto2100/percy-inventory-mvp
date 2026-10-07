import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'

import type {
  PurchaseRequestResponse,
  PurchaseRequestStatus,
} from '../../../../api/purchaseRequestApi'

interface PurchaseRequestTableProps {
  purchaseRequests: PurchaseRequestResponse[]
  loading?: boolean

  canEdit: (
    record: PurchaseRequestResponse
  ) => boolean

  canSubmit: (
    record: PurchaseRequestResponse
  ) => boolean

  canApproveOrReject: boolean
  canProcessOrComplete: boolean

  onView: (
    record: PurchaseRequestResponse
  ) => void

  onEdit: (
    record: PurchaseRequestResponse
  ) => void

  onSubmit: (
    id: number
  ) => void | Promise<void>

  onApprove: (
    id: number
  ) => void | Promise<void>

  onReject: (
    id: number
  ) => void | Promise<void>

  onProcess: (
    id: number
  ) => void | Promise<void>

  onComplete: (
    id: number
  ) => void | Promise<void>
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

export default function PurchaseRequestTable({
  purchaseRequests,
  loading = false,
  canEdit,
  canSubmit,
  canApproveOrReject,
  canProcessOrComplete,
  onView,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
  onProcess,
  onComplete,
}: PurchaseRequestTableProps) {
  const columns: ColumnsType<
    PurchaseRequestResponse
  > = [
    {
      title: 'Request No.',
      dataIndex: 'requestNo',
      key: 'requestNo',
    },
    {
      title: 'Requester',
      dataIndex: 'requesterName',
      key: 'requesterName',
    },
    {
      title: 'Required Date',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      render: (
        value: string | null
      ) => value ?? '-',
    },
    {
      title: 'Location',
      dataIndex: 'locationName',
      key: 'locationName',
      render: (
        value: string | null
      ) => value ?? '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (
        value: PurchaseRequestStatus
      ) => (
        <Tag
          color={
            statusColors[value]
          }
        >
          {value.replaceAll(
            '_',
            ' '
          )}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (
        _,
        record
      ) => (
        <Space wrap>
          <Button
            size="small"
            onClick={() =>
              onView(record)
            }
          >
            View
          </Button>

          {canEdit(record) && (
            <Button
              size="small"
              onClick={() =>
                onEdit(record)
              }
            >
              Edit
            </Button>
          )}

          {canSubmit(record) && (
            <Popconfirm
              title="Submit this purchase request?"
              onConfirm={() =>
                onSubmit(
                  record.id
                )
              }
            >
              <Button
                size="small"
                type="primary"
              >
                Submit
              </Button>
            </Popconfirm>
          )}

          {canApproveOrReject &&
            record.status ===
              'PENDING_APPROVAL' && (
              <>
                <Button
                  size="small"
                  type="primary"
                  onClick={() =>
                    onApprove(
                      record.id
                    )
                  }
                >
                  Approve
                </Button>

                <Popconfirm
                  title="Reject this purchase request?"
                  onConfirm={() =>
                    onReject(
                      record.id
                    )
                  }
                >
                  <Button
                    size="small"
                    danger
                  >
                    Reject
                  </Button>
                </Popconfirm>
              </>
            )}

          {canProcessOrComplete &&
            record.status ===
              'APPROVED' && (
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  onProcess(
                    record.id
                  )
                }
              >
                Process
              </Button>
            )}

          {canProcessOrComplete &&
            record.status ===
              'PROCESSING' && (
              <Popconfirm
                title="Mark this purchase request as completed?"
                onConfirm={() =>
                  onComplete(
                    record.id
                  )
                }
              >
                <Button
                  size="small"
                  type="primary"
                >
                  Complete
                </Button>
              </Popconfirm>
            )}
        </Space>
      ),
    },
  ]

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={purchaseRequests}
      loading={loading}
      scroll={{
        x: 1100,
      }}
    />
  )
}