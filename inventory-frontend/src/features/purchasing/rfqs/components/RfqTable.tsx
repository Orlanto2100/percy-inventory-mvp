import {
  Dropdown,
  Empty,
  Table,
  Tag,
  Typography,
} from 'antd'
import type {
  MenuProps,
  TableColumnsType,
} from 'antd'
import { MoreOutlined } from '@ant-design/icons'

import type {
  RfqResponse,
  RfqStatus,
} from '../../../../api/rfqApi'

export type RfqAction =
  | 'view'
  | 'edit'
  | 'delete'
  | 'reminder'
  | 'close'
  | 'compare'
  | 'purchase-order'

type RfqTableProps = {
  rfqs: RfqResponse[]
  loading?: boolean
  onAction?: (
    action: RfqAction,
    rfq: RfqResponse,
  ) => void
}

const statusConfig: Record<
  RfqStatus,
  {
    label: string
    color: string
  }
> = {
  DRAFT: {
    label: 'Draft',
    color: 'default',
  },
  SENT: {
    label: 'Sent',
    color: 'blue',
  },
  RESPONSES_RECEIVED: {
    label: 'Responses Received',
    color: 'gold',
  },
  AWARDED: {
    label: 'Awarded',
    color: 'purple',
  },
  CLOSED: {
    label: 'Closed',
    color: 'default',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'red',
  },
}

function getActionItems(
  record: RfqResponse,
  onAction?: (
    action: RfqAction,
    rfq: RfqResponse,
  ) => void,
): MenuProps['items'] {
  const action = (key: RfqAction) => ({
    onClick: () =>
      onAction?.(key, record),
  })

  const items: MenuProps['items'] = [
    {
      key: 'view',
      label: 'View',
      ...action('view'),
    },
  ]

  switch (record.status) {
    case 'DRAFT':
      items.push(
        {
          key: 'edit',
          label: 'Edit',
          ...action('edit'),
        },
        {
          key: 'delete',
          label: 'Delete',
          danger: true,
          ...action('delete'),
        },
      )
      break

    case 'SENT':
      items.push(
        {
          key: 'reminder',
          label: 'Send Reminder',
          ...action('reminder'),
        },
        {
          key: 'close',
          label: 'Close RFQ',
          ...action('close'),
        },
      )
      break

    case 'RESPONSES_RECEIVED':
      items.push({
        key: 'compare',
        label: 'Compare Quotations',
        ...action('compare'),
      })
      break

    case 'AWARDED':
      items.push({
        key: 'purchase-order',
        label: 'Create Purchase Order',
        ...action('purchase-order'),
      })
      break
  }

  return items
}

function RfqTable({
  rfqs,
  loading = false,
  onAction,
}: RfqTableProps) {
  const columns: TableColumnsType<RfqResponse> = [
    {
      title: 'RFQ No.',
      dataIndex: 'rfqNumber',
      key: 'rfqNumber',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <Typography.Text strong>
          {title}
        </Typography.Text>
      ),
    },
    {
      title: 'Vendors',
      dataIndex: 'vendorCount',
      key: 'vendorCount',
    },
    {
      title: 'Items',
      dataIndex: 'itemCount',
      key: 'itemCount',
    },
    {
      title: 'Response Deadline',
      dataIndex: 'responseDeadline',
      key: 'responseDeadline',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: RfqStatus) => {
        const config =
          statusConfig[status]

        return (
          <Tag color={config.color}>
            {config.label}
          </Tag>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          trigger={['click']}
          menu={{
            items: getActionItems(
              record,
              onAction,
            ),
          }}
        >
          <MoreOutlined
            style={{
              fontSize: 20,
              cursor: 'pointer',
            }}
          />
        </Dropdown>
      ),
    },
  ]

  return (
    <Table<RfqResponse>
      rowKey="rfqId"
      columns={columns}
      dataSource={rfqs}
      loading={loading}
      locale={{
        emptyText: (
          <Empty description="No RFQs found." />
        ),
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) =>
          `Total ${total} RFQs`,
      }}
      scroll={{ x: 900 }}
    />
  )
}

export default RfqTable