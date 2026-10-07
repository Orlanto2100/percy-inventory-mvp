const pageTitles: Record<string, string> = {

  // =====================================================
  // Dashboard
  // =====================================================

  '/': 'navigation.dashboard',

  // =====================================================
  // Inventory
  // =====================================================

  '/products': 'navigation.products',
  '/inventory': 'navigation.inventory',
  '/warehouses': 'navigation.warehouses',
  '/locations': 'navigation.locations',

  // =====================================================
  // Warehouse Operations
  // =====================================================

  '/stock-movements': 'navigation.stockMovements',
  '/putaways': 'navigation.putaways',
  '/pickings': 'navigation.pickings',

  // =====================================================
  // Purchasing
  // =====================================================

  '/vendors': 'navigation.vendors',
  '/purchase-requests': 'navigation.purchaseRequests',
  '/rfqs': 'navigation.rfqs',
  '/vendor-quotations': 'navigation.vendorQuotations',
  '/purchase-orders': 'navigation.purchaseOrders',
  '/receipts': 'navigation.receipts',
  '/vendor-invoices': 'navigation.vendorInvoices',

  // =====================================================
  // Sales
  // =====================================================

  '/customers': 'navigation.customers',
  '/customer-quotations': 'navigation.customerQuotations',
  '/sales-orders': 'navigation.salesOrders',
  '/deliveries': 'navigation.deliveries',
  '/customer-invoices': 'navigation.customerInvoices',

  // =====================================================
  // Reports
  // =====================================================

  '/reports/inventory':
    'navigation.inventoryReports',

  '/reports/sales':
    'navigation.salesReports',

  '/reports/purchasing':
    'navigation.purchasingReports',

  '/reports/operations':
    'navigation.operationsReports',

  // =====================================================
  // Administration
  // =====================================================

  '/users':
    'navigation.users',

  '/roles-permissions':
    'navigation.rolesPermissions',

  '/audit-log':
    'navigation.auditLog',

  '/system-settings':
    'navigation.systemSettings',
}

// =====================================================
// Get Page Title
// =====================================================

export function getPageTitle(
  path: string,
): string {

  // Exact match
  const exactTitle =
    pageTitles[path]

  if (exactTitle) {
    return exactTitle
  }

  // Nested route match
  //
  // Example:
  // /vendors/123
  //       ↓
  // /vendors
  //       ↓
  // navigation.vendors

  const matchingEntry =
    Object.entries(pageTitles)
      .filter(([key]) => key !== '/')
      .find(([key]) =>
        path.startsWith(`${key}/`),
      )

  if (matchingEntry) {
    return matchingEntry[1]
  }

  // Fallback
  return 'common.inventorySystem'
}