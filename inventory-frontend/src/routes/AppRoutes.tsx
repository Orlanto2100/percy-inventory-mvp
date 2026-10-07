import { Routes, Route } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import ScrollToTop from './ScrollToTop'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

// ==================================================
// Dashboard
// ==================================================

import DashboardPage
  from '../features/dashboard/pages/DashboardPage'

// ==================================================
// Authentication
// ==================================================

import LoginPage
  from '../features/auth/pages/LoginPage'

// ==================================================
// Products
// ==================================================

import ProductPage
  from '../features/products/pages/ProductPage'

// ==================================================
// Warehouse
// ==================================================

import InventoryPage
  from '../features/warehouse/inventory/pages/InventoryPage'

import WarehousePage
  from '../features/warehouse/warehouses/pages/WarehousePage'

import LocationPage
  from '../features/warehouse/locations/pages/LocationPage'

// ==================================================
// Warehouse Operations
// ==================================================

import StockMovementPage
  from '../features/warehouse-operations/stock-movements/pages/StockMovementPage'

import PutawayPage
  from '../features/warehouse-operations/putaways/pages/PutawayPage'

import PickingPage
  from '../features/warehouse-operations/pickings/pages/PickingPage'

// ==================================================
// Purchasing
// ==================================================

import VendorPage
  from '../features/purchasing/vendors/pages/VendorPage'

import PurchaseRequestPage
  from '../features/purchasing/purchase-requests/pages/PurchaseRequestPage'

import RfqPage
  from '../features/purchasing/rfqs/pages/RfqPage'

import VendorQuotationPage
  from '../features/purchasing/vendor-quotations/pages/VendorQuotationPage'

import PurchaseOrderPage
  from '../features/purchasing/purchase-orders/pages/PurchaseOrderPage'

import ReceiptPage
  from '../features/purchasing/receipts/pages/ReceiptPage'

import VendorInvoicePage
  from '../features/purchasing/vendor-invoices/pages/VendorInvoicePage'

// ==================================================
// Sales
// ==================================================

import CustomerPage
  from '../features/sales/customers/pages/CustomerPage'

import CustomerQuotationPage
  from '../features/sales/customer-quotations/pages/CustomerQuotationPage'

import SalesOrderPage
  from '../features/sales/sales-orders/pages/SalesOrderPage'

import DeliveryPage
  from '../features/sales/deliveries/pages/DeliveryPage'

import CustomerInvoicePage
  from '../features/sales/customer-invoices/pages/CustomerInvoicePage'

// ==================================================
// Reports
// ==================================================

import InventoryReportPage
  from '../features/reports/inventory-reports/pages/InventoryReportPage'

import SalesReportPage
  from '../features/reports/sales-reports/pages/SalesReportPage'

import PurchasingReportPage
  from '../features/reports/purchasing-reports/pages/PurchasingReportPage'

import OperationsReportPage
  from '../features/reports/operations-reports/pages/OperationsReportPage'

// ==================================================
// Administration
// ==================================================

import UserPage
  from '../features/administration/users/pages/UserPage'

import RolePermissionPage
  from '../features/administration/roles-permissions/pages/RolePermissionPage'

import AuditLogPage
  from '../features/administration/audit-log/pages/AuditLogPage'

import SystemSettingsPage
  from '../features/administration/system-settings/pages/SystemSettingsPage'


export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* ==================================================
            Public
            ================================================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* ==================================================
            Protected Application
            ================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            {/* ==================================================
                Dashboard
                All authenticated employees
                ================================================== */}

            <Route
              path="/"
              element={<DashboardPage />}
            />


            {/* ==================================================
                Products
                All company employees can view products
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'WAREHOUSE_STAFF',
                    'PURCHASING_STAFF',
                    'SALES_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/products"
                element={<ProductPage />}
              />
            </Route>


            {/* ==================================================
                Warehouse
                Warehouse Staff + Admin
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'WAREHOUSE_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/inventory"
                element={<InventoryPage />}
              />

              <Route
                path="/warehouses"
                element={<WarehousePage />}
              />

              <Route
                path="/locations"
                element={<LocationPage />}
              />
            </Route>


            {/* ==================================================
                Purchase Requests
                All company employees
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'WAREHOUSE_STAFF',
                    'PURCHASING_STAFF',
                    'SALES_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/purchase-requests"
                element={<PurchaseRequestPage />}
              />
            </Route>


            {/* ==================================================
                Warehouse Operations
                Warehouse Staff + Admin
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'WAREHOUSE_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/putaways"
                element={<PutawayPage />}
              />

              <Route
                path="/pickings"
                element={<PickingPage />}
              />

              <Route
                path="/stock-movements"
                element={<StockMovementPage />}
              />
            </Route>


            {/* ==================================================
                Purchasing
                Purchasing Staff + Admin
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'PURCHASING_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/vendors"
                element={<VendorPage />}
              />

              <Route
                path="/rfqs"
                element={<RfqPage />}
              />

              <Route
                path="/vendor-quotations"
                element={<VendorQuotationPage />}
              />

              <Route
                path="/purchase-orders"
                element={<PurchaseOrderPage />}
              />

              <Route
                path="/receipts"
                element={<ReceiptPage />}
              />

              <Route
                path="/vendor-invoices"
                element={<VendorInvoicePage />}
              />
            </Route>


            {/* ==================================================
                Sales
                Sales Staff + Admin
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'SALES_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/customers"
                element={<CustomerPage />}
              />

              <Route
                path="/customer-quotations"
                element={<CustomerQuotationPage />}
              />

              <Route
                path="/sales-orders"
                element={<SalesOrderPage />}
              />

              <Route
                path="/deliveries"
                element={<DeliveryPage />}
              />

              <Route
                path="/customer-invoices"
                element={<CustomerInvoicePage />}
              />
            </Route>


            {/* ==================================================
                Inventory Reports
                All company employees
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'WAREHOUSE_STAFF',
                    'PURCHASING_STAFF',
                    'SALES_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/reports/inventory"
                element={<InventoryReportPage />}
              />
            </Route>


            {/* ==================================================
                Sales Reports
                Sales Staff + Admin
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'SALES_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/reports/sales"
                element={<SalesReportPage />}
              />
            </Route>


            {/* ==================================================
                Purchasing Reports
                Purchasing Staff + Admin
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'PURCHASING_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/reports/purchasing"
                element={<PurchasingReportPage />}
              />
            </Route>


            {/* ==================================================
                Operations Reports
                Warehouse Staff + Admin
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                    'WAREHOUSE_STAFF',
                  ]}
                />
              }
            >
              <Route
                path="/reports/operations"
                element={<OperationsReportPage />}
              />
            </Route>


            {/* ==================================================
                Administration
                Admin only
                ================================================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    'ADMIN',
                  ]}
                />
              }
            >
              <Route
                path="/users"
                element={<UserPage />}
              />

              <Route
                path="/roles-permissions"
                element={<RolePermissionPage />}
              />

              <Route
                path="/audit-log"
                element={<AuditLogPage />}
              />

              <Route
                path="/system-settings"
                element={<SystemSettingsPage />}
              />
            </Route>

          </Route>
        </Route>

      </Routes>
    </>
  )
}