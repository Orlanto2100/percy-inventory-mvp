import { Button, Card } from 'antd'

import PurchaseRequestDetails from '../components/PurchaseRequestDetails'
import PurchaseRequestFilters from '../components/PurchaseRequestFilters'
import PurchaseRequestForm from '../components/PurchaseRequestForm'
import PurchaseRequestTable from '../components/PurchaseRequestTable'

import { usePurchaseRequestPage } from '../hooks/usePurchaseRequestPage'

export default function PurchaseRequestPage() {
  const {
    purchaseRequests,
    loading,
    error,

    search,
    status,
    setSearch,
    setStatus,

    formOpen,
    formLoading,
    detailsOpen,

    selectedPurchaseRequest,

    warehousesLoading,
    productsLoading,

    warehouseOptions,
    productOptions,

    role,
    assignedWarehouseId,

    permissions,

    handleFormSubmit,
    handleSubmit,
    handleApprove,
    handleReject,
    handleProcess,
    handleComplete,

    handleView,
    handleEdit,

    handleCreateForm,
    handleCloseForm,
    handleCloseDetails,
  } = usePurchaseRequestPage()

  return (
    <>
      <Card
        title="Purchase Requests"
        extra={
          <Button
            type="primary"
            onClick={handleCreateForm}
            disabled={!permissions.canCreate}
            loading={
              warehousesLoading ||
              productsLoading
            }
          >
            Create Purchase Request
          </Button>
        }
      >
        <PurchaseRequestFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        {error && (
          <div
            style={{
              marginBottom: 16,
              color: 'red',
            }}
          >
            {error}
          </div>
        )}

        {role === 'WAREHOUSE_STAFF' &&
          assignedWarehouseId === undefined && (
            <div
              style={{
                marginBottom: 16,
                color: '#cf1322',
              }}
            >
              No warehouse is assigned to your
              account. Please contact an
              administrator.
            </div>
          )}

        <PurchaseRequestTable
          purchaseRequests={
            purchaseRequests
          }
          loading={loading}
          canEdit={
            permissions.canEdit
          }
          canSubmit={
            permissions.canSubmit
          }
          canApproveOrReject={
            permissions.canApproveOrReject
          }
          canProcessOrComplete={
            permissions.canProcessOrComplete
          }
          onView={handleView}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          onApprove={handleApprove}
          onReject={handleReject}
          onProcess={handleProcess}
          onComplete={handleComplete}
        />
      </Card>

      <PurchaseRequestForm
        open={formOpen}
        loading={formLoading}
        purchaseRequest={
          selectedPurchaseRequest
        }
        role={role}
        assignedWarehouseId={
          assignedWarehouseId
        }
        warehouseOptions={
          warehouseOptions
        }
        productOptions={
          productOptions
        }
        onCancel={
          handleCloseForm
        }
        onSubmit={
          handleFormSubmit
        }
      />

      <PurchaseRequestDetails
        open={detailsOpen}
        purchaseRequest={
          selectedPurchaseRequest
        }
        onClose={
          handleCloseDetails
        }
      />
    </>
  )
}