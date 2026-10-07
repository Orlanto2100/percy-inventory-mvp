import {
  Input,
  Select,
  Space,
} from 'antd'

import type {
  PurchaseRequestStatus,
} from '../../../../api/purchaseRequestApi'

const { Search } = Input

interface PurchaseRequestFiltersProps {
  search: string
  status?: PurchaseRequestStatus

  onSearchChange: (
    value: string
  ) => void

  onStatusChange: (
    value: PurchaseRequestStatus | undefined
  ) => void
}

export default function PurchaseRequestFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: PurchaseRequestFiltersProps) {
  return (
    <Space
      style={{
        width: '100%',
        marginBottom: 16,
      }}
      wrap
    >
      <Search
        placeholder="Search request no. or requester"
        allowClear
        value={search}
        onChange={(event) =>
          onSearchChange(
            event.target.value
          )
        }
        style={{
          width: 300,
        }}
      />

      <Select
        placeholder="Filter by status"
        allowClear
        value={status}
        onChange={onStatusChange}
        style={{
          width: 200,
        }}
        options={[
          {
            value: 'DRAFT',
            label: 'Draft',
          },
          {
            value:
              'PENDING_APPROVAL',
            label:
              'Pending Approval',
          },
          {
            value: 'APPROVED',
            label: 'Approved',
          },
          {
            value: 'REJECTED',
            label: 'Rejected',
          },
          {
            value: 'PROCESSING',
            label: 'Processing',
          },
          {
            value: 'COMPLETED',
            label: 'Completed',
          },
        ]}
      />
    </Space>
  )
}