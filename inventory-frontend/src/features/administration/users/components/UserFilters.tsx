import {
  Input,
  Select,
  Space,
} from 'antd'
import { useTranslation } from 'react-i18next'
import type {
  AccountType,
  Role,
} from '../types/user'

interface UserFiltersProps {
  search: string
  accountType?: AccountType
  role?: Role
  onSearchChange: (value: string) => void
  onAccountTypeChange: (
    value: AccountType | undefined,
  ) => void
  onRoleChange: (
    value: Role | undefined,
  ) => void
}

export default function UserFilters({
  search,
  accountType,
  role,
  onSearchChange,
  onAccountTypeChange,
  onRoleChange,
}: UserFiltersProps) {
  const { t } = useTranslation()

  return (
    <Space
      wrap
      style={{ marginBottom: 16 }}
    >
      <Input
        placeholder={t('users.search')}
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        allowClear
        style={{ width: 220 }}
      />

      <Select
        placeholder={t('users.accountType')}
        value={accountType}
        onChange={onAccountTypeChange}
        allowClear
        style={{ width: 180 }}
        options={[
          {
            label: 'Company',
            value: 'COMPANY',
          },
          {
            label: 'Vendor',
            value: 'VENDOR',
          },
          {
            label: 'Customer',
            value: 'CUSTOMER',
          },
        ]}
      />

      <Select
        placeholder={t('users.role')}
        value={role}
        onChange={onRoleChange}
        allowClear
        style={{ width: 200 }}
        options={[
          {
            label: 'Admin',
            value: 'ADMIN',
          },
          {
            label: 'Warehouse Staff',
            value: 'WAREHOUSE_STAFF',
          },
          {
            label: 'Purchasing Staff',
            value: 'PURCHASING_STAFF',
          },
          {
            label: 'Sales Staff',
            value: 'SALES_STAFF',
          },
        ]}
      />
    </Space>
  )
}