import { Input, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import type { VendorStatus } from '../../../../api/vendorApi'

type VendorFiltersProps = {
  search: string
  status: VendorStatus | undefined
  onSearch: (value: string) => void
  onStatusChange: (
    value: VendorStatus | undefined,
  ) => void
}

function VendorFilters({
  search,
  status,
  onSearch,
  onStatusChange,
}: VendorFiltersProps) {
  return (
    <Space
      wrap
      size="middle"
      style={{ width: '100%' }}
    >
      <Input
        allowClear
        value={search}
        placeholder="Search vendors"
        prefix={<SearchOutlined />}
        onChange={(event) =>
          onSearch(event.target.value)
        }
        style={{ width: 280 }}
      />

      <Select
        allowClear
        value={status}
        placeholder="Status"
        onChange={onStatusChange}
        style={{ width: 160 }}
        options={[
          {
            label: 'Active',
            value: 'ACTIVE',
          },
          {
            label: 'Inactive',
            value: 'INACTIVE',
          },
        ]}
      />
    </Space>
  )
}

export default VendorFilters