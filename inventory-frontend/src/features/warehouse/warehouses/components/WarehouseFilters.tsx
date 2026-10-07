import { Input, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import type { WarehouseStatus } from '../../../../api/warehouseApi'

type WarehouseFiltersProps = {
  search: string
  status: WarehouseStatus | undefined
  onSearch: (value: string) => void
  onStatusChange: (
    value: WarehouseStatus | undefined,
  ) => void
}

function WarehouseFilters({
  search,
  status,
  onSearch,
  onStatusChange,
}: WarehouseFiltersProps) {
  return (
    <Space
      wrap
      size="middle"
      style={{ width: '100%' }}
    >
      <Input
        allowClear
        value={search}
        placeholder="Search warehouses"
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

export default WarehouseFilters