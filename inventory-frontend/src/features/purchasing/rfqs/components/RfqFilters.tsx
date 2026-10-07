import {
  DatePicker,
  Flex,
  Input,
  Select,
} from 'antd'
import type { Dayjs } from 'dayjs'

import type {
  RfqStatus,
} from '../../../../api/rfqApi'

export type RfqFilterValues = {
  search?: string
  status?: RfqStatus
  vendorId?: number
  responseDeadline?: Dayjs | null
}

type RfqFiltersProps = {
  values: RfqFilterValues
  vendors: {
    label: string
    value: number
  }[]
  onChange: (
    values: RfqFilterValues,
  ) => void
}

const statusOptions = [
  {
    label: 'Draft',
    value: 'DRAFT',
  },
  {
    label: 'Sent',
    value: 'SENT',
  },
  {
    label: 'Responses Received',
    value: 'RESPONSES_RECEIVED',
  },
  {
    label: 'Awarded',
    value: 'AWARDED',
  },
  {
    label: 'Closed',
    value: 'CLOSED',
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED',
  },
]

function RfqFilters({
  values,
  vendors,
  onChange,
}: RfqFiltersProps) {
  return (
    <Flex
      wrap
      gap={12}
    >
      <Input.Search
        placeholder="Search RFQ number or title"
        allowClear
        value={values.search}
        onChange={(event) =>
          onChange({
            ...values,
            search: event.target.value,
          })
        }
        onSearch={(search) =>
          onChange({
            ...values,
            search,
          })
        }
        style={{
          width: 280,
        }}
      />

      <Select
        placeholder="Status"
        allowClear
        value={values.status}
        onChange={(status) =>
          onChange({
            ...values,
            status,
          })
        }
        options={statusOptions}
        style={{
          width: 180,
        }}
      />

      <Select
        placeholder="Vendor"
        allowClear
        showSearch
        optionFilterProp="label"
        value={values.vendorId}
        onChange={(vendorId) =>
          onChange({
            ...values,
            vendorId,
          })
        }
        options={vendors}
        style={{
          width: 200,
        }}
      />

      <DatePicker
        placeholder="Response deadline"
        allowClear
        value={values.responseDeadline}
        onChange={(responseDeadline) =>
          onChange({
            ...values,
            responseDeadline,
          })
        }
      />
    </Flex>
  )
}

export default RfqFilters