import type { ReactNode } from 'react'

import {
  AppstoreOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons'

// =====================================================
// Roles
// =====================================================

export type Role =
  | 'ADMIN'
  | 'WAREHOUSE_STAFF'
  | 'PURCHASING_STAFF'
  | 'SALES_STAFF'

// =====================================================
// Menu Types
// =====================================================

export interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  roles?: Role[]
}

export interface MenuSection extends MenuItem {
  children: MenuItem[]
}

export type SidebarMenuItem =
  | MenuItem
  | MenuSection

// =====================================================
// All Company Roles
// =====================================================

const allCompanyRoles: Role[] = [
  'ADMIN',
  'WAREHOUSE_STAFF',
  'PURCHASING_STAFF',
  'SALES_STAFF',
]

// =====================================================
// Navigation
// =====================================================

export const menuItems: SidebarMenuItem[] = [

  // ===================================================
  // Dashboard
  // ===================================================

  {
    key: '/',
    label: 'navigation.dashboard',
    icon: <DashboardOutlined />,
    roles: allCompanyRoles,
  },

  // ===================================================
  // Inventory
  // ===================================================

  {
    key: 'inventory',
    label: 'navigation.inventory',
    icon: <AppstoreOutlined />,
    roles: [
      'ADMIN',
      'WAREHOUSE_STAFF',
    ],
    children: [
      {
        key: '/products',
        label: 'navigation.products',
        roles: allCompanyRoles,
      },

      {
        key: '/inventory',
        label: 'navigation.inventory',
        roles: [
          'ADMIN',
          'WAREHOUSE_STAFF',
        ],
      },

      {
        key: '/warehouses',
        label: 'navigation.warehouses',
        icon: <ShopOutlined />,
        roles: [
          'ADMIN',
          'WAREHOUSE_STAFF',
        ],
      },

      {
        key: '/locations',
        label: 'navigation.locations',
        icon: <EnvironmentOutlined />,
        roles: [
          'ADMIN',
          'WAREHOUSE_STAFF',
        ],
      },
    ],
  },

  // ===================================================
  // Purchase Requests
  // All company employees
  // ===================================================

  {
    key: '/purchase-requests',
    label: 'navigation.purchaseRequests',
    icon: <FileTextOutlined />,
    roles: allCompanyRoles,
  },

  // ===================================================
  // Sales
  // ===================================================

  {
    key: 'sales',
    label: 'navigation.sales',
    icon: <ShoppingCartOutlined />,
    roles: [
      'ADMIN',
      'SALES_STAFF',
    ],
    children: [
      {
        key: '/customers',
        label: 'navigation.customers',
        icon: <UserOutlined />,
        roles: [
          'ADMIN',
          'SALES_STAFF',
        ],
      },

      {
        key: '/customer-quotations',
        label: 'navigation.customerQuotations',
        icon: <FileTextOutlined />,
        roles: [
          'ADMIN',
          'SALES_STAFF',
        ],
      },

      {
        key: '/sales-orders',
        label: 'navigation.salesOrders',
        icon: <FileTextOutlined />,
        roles: [
          'ADMIN',
          'SALES_STAFF',
        ],
      },

      {
        key: '/deliveries',
        label: 'navigation.deliveries',
        icon: <SwapOutlined />,
        roles: [
          'ADMIN',
          'SALES_STAFF',
        ],
      },

      {
        key: '/customer-invoices',
        label: 'navigation.customerInvoices',
        icon: <FileTextOutlined />,
        roles: [
          'ADMIN',
          'SALES_STAFF',
        ],
      },
    ],
  },

  // ===================================================
  // Purchasing
  // ===================================================

  {
    key: 'purchasing',
    label: 'navigation.purchasing',
    icon: <ShopOutlined />,
    roles: [
      'ADMIN',
      'PURCHASING_STAFF',
    ],
    children: [
      {
        key: '/vendors',
        label: 'navigation.vendors',
        icon: <UserOutlined />,
        roles: [
          'ADMIN',
          'PURCHASING_STAFF',
        ],
      },

      {
        key: '/rfqs',
        label: 'navigation.rfqs',
        icon: <FileTextOutlined />,
        roles: [
          'ADMIN',
          'PURCHASING_STAFF',
        ],
      },

      {
        key: '/vendor-quotations',
        label: 'navigation.vendorQuotations',
        icon: <FileTextOutlined />,
        roles: [
          'ADMIN',
          'PURCHASING_STAFF',
        ],
      },

      {
        key: '/purchase-orders',
        label: 'navigation.purchaseOrders',
        icon: <FileTextOutlined />,
        roles: [
          'ADMIN',
          'PURCHASING_STAFF',
        ],
      },

      {
        key: '/receipts',
        label: 'navigation.receipts',
        icon: <SwapOutlined />,
        roles: [
          'ADMIN',
          'PURCHASING_STAFF',
        ],
      },

      {
        key: '/vendor-invoices',
        label: 'navigation.vendorInvoices',
        icon: <FileTextOutlined />,
        roles: [
          'ADMIN',
          'PURCHASING_STAFF',
        ],
      },
    ],
  },

  // ===================================================
  // Warehouse Operations
  // ===================================================

  {
    key: 'warehouse-operations',
    label: 'navigation.warehouseOperations',
    icon: <SwapOutlined />,
    roles: [
      'ADMIN',
      'WAREHOUSE_STAFF',
    ],
    children: [
      {
        key: '/putaways',
        label: 'navigation.putaways',
        roles: [
          'ADMIN',
          'WAREHOUSE_STAFF',
        ],
      },

      {
        key: '/pickings',
        label: 'navigation.pickings',
        roles: [
          'ADMIN',
          'WAREHOUSE_STAFF',
        ],
      },

      {
        key: '/stock-movements',
        label: 'navigation.stockMovements',
        roles: [
          'ADMIN',
          'WAREHOUSE_STAFF',
        ],
      },
    ],
  },

  // ===================================================
  // Reports
  // ===================================================

  {
    key: 'reports',
    label: 'navigation.reports',
    icon: <FileTextOutlined />,
    roles: allCompanyRoles,
    children: [
      {
        key: '/reports/inventory',
        label: 'navigation.inventoryReports',
        roles: allCompanyRoles,
      },

      {
        key: '/reports/sales',
        label: 'navigation.salesReports',
        roles: [
          'ADMIN',
          'SALES_STAFF',
        ],
      },

      {
        key: '/reports/purchasing',
        label: 'navigation.purchasingReports',
        roles: [
          'ADMIN',
          'PURCHASING_STAFF',
        ],
      },

      {
        key: '/reports/operations',
        label: 'navigation.operationsReports',
        roles: [
          'ADMIN',
          'WAREHOUSE_STAFF',
        ],
      },
    ],
  },

  // ===================================================
  // Administration
  // ===================================================

  {
    key: 'administration',
    label: 'navigation.administration',
    icon: <UserOutlined />,
    roles: [
      'ADMIN',
    ],
    children: [
      {
        key: '/users',
        label: 'navigation.users',
        roles: [
          'ADMIN',
        ],
      },

      {
        key: '/roles-permissions',
        label: 'navigation.rolesPermissions',
        roles: [
          'ADMIN',
        ],
      },

      {
        key: '/audit-log',
        label: 'navigation.auditLog',
        roles: [
          'ADMIN',
        ],
      },

      {
        key: '/system-settings',
        label: 'navigation.systemSettings',
        roles: [
          'ADMIN',
        ],
      },
    ],
  },
]

// =====================================================
// Role-based Menu Filtering
// =====================================================

export function getMenuItemsForRole(
  role: Role,
): SidebarMenuItem[] {

  return menuItems
    .filter((item) => {
      if (!item.roles) {
        return true
      }

      return item.roles.includes(role)
    })
    .map((item) => {

      // -------------------------------------------------
      // Normal menu item
      // -------------------------------------------------

      if (!('children' in item)) {
        return item
      }

      // -------------------------------------------------
      // Filter children
      // -------------------------------------------------

      const children = item.children.filter(
        (child) => {
          if (!child.roles) {
            return true
          }

          return child.roles.includes(role)
        },
      )

      // -------------------------------------------------
      // Remove empty sections
      // -------------------------------------------------

      if (children.length === 0) {
        return null
      }

      return {
        ...item,
        children,
      }
    })
    .filter(
      (
        item,
      ): item is SidebarMenuItem =>
        item !== null,
    )
}

// =====================================================
// User Menu
// =====================================================

export const userMenuItems = [

  {
    key: 'profile',
    label: 'common.profile',
    icon: <UserOutlined />,
  },

  {
    key: 'settings',
    label: 'common.settings',
    icon: <SettingOutlined />,
  },

  {
    type: 'divider' as const,
  },

  {
    key: 'logout',
    label: 'common.logout',
    icon: <LogoutOutlined />,
    danger: true,
  },

]