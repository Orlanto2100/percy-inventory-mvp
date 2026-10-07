import {
  Input,
  Row,
  Select,
  Space,
} from 'antd'
import type { SelectProps } from 'antd'

import type {
  LocationStatus,
  LocationType,
} from '../../../../api/locationApi'

type LocationFiltersProps = {
  search: string
  type?: LocationType
  status?: LocationStatus
  warehouseId?: number

  warehouseOptions: SelectProps['options']

  onSearchChange: (value: string) => void
  onTypeChange: (
    value: LocationType | undefined,
  ) => void
  onStatusChange: (
    value: LocationStatus | undefined,
  ) => void
  onWarehouseChange: (
    value: number | undefined,
  ) => void
}

const typeOptions: SelectProps['options'] = [
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

const statusOptions: SelectProps['options'] = [
  {
    value: 'ACTIVE',
    label: 'Active',
  },
  {
    value: 'INACTIVE',
    label: 'Inactive',
  },
]

export default function LocationFilters({
  search,
  type,
  status,
  warehouseId,
  warehouseOptions,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onWarehouseChange,
}: LocationFiltersProps) {
  return (
    <Row
      gutter={[12, 12]}
      style={{
        marginBottom: 16,
      }}
    >
      <Space
        wrap
        style={{
          width: '100%',
        }}
      >
        <Input.Search
          placeholder="Search by name or code"
          allowClear
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value,
            )
          }
          style={{
            width: 280,
          }}
        />

        <Select
          placeholder="Location type"
          allowClear
          value={type}
          onChange={onTypeChange}
          options={typeOptions}
          style={{
            width: 170,
          }}
        />

        <Select
          placeholder="Status"
          allowClear
          value={status}
          onChange={onStatusChange}
          options={statusOptions}
          style={{
            width: 150,
          }}
        />

        <Select
          placeholder="Warehouse"
          allowClear
          showSearch
          optionFilterProp="label"
          value={warehouseId}
          onChange={onWarehouseChange}
          options={warehouseOptions}
          style={{
            width: 240,
          }}
        />
      </Space>
    </Row>
  )
}