import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Typography,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'

import type { WarehouseResponse } from '../../../../api/warehouseApi'

import WarehouseTable from '../components/WarehouseTable'
import WarehouseFilters from '../components/WarehouseFilters'
import WarehouseFormModal, {
  type WarehouseFormValues,
} from '../components/WarehouseFormModal'

import { useWarehouses } from '../hooks/useWarehouses'

const { Title, Text } = Typography

export default function WarehousePage() {
  const { t } = useTranslation()

  // ==================================================
  // Current User Role
  // ==================================================

  const userRole = localStorage.getItem('role')

  const isAdmin = userRole === 'ADMIN'


  // ==================================================
  // Warehouse Hook
  // ==================================================

  const {
    warehouses,
    loading,
    submitting,
    error,
    total,
    search,
    status,
    page,
    pageSize,

    loadWarehouses,
    create,
    update,
    activate,
    deactivate,

    handleSearch,
    handleStatusChange,
    handlePageChange,
    handleSortChange,
  } = useWarehouses()


  // ==================================================
  // State
  // ==================================================

  const [formOpen, setFormOpen] =
    useState(false)

  const [editingWarehouse, setEditingWarehouse] =
    useState<WarehouseResponse | null>(null)

  const [viewingWarehouse, setViewingWarehouse] =
    useState<WarehouseResponse | null>(null)

  const [activatingId, setActivatingId] =
    useState<number | null>(null)

  const [deactivatingId, setDeactivatingId] =
    useState<number | null>(null)


  // ==================================================
  // Create
  // ==================================================

  function openCreateModal() {
    setEditingWarehouse(null)
    setFormOpen(true)
  }


  // ==================================================
  // Edit
  // ==================================================

  function openEditModal(
    warehouse: WarehouseResponse,
  ) {
    setEditingWarehouse(warehouse)
    setFormOpen(true)
  }


  // ==================================================
  // Close Form
  // ==================================================

  function closeFormModal() {
    if (submitting) {
      return
    }

    setFormOpen(false)
    setEditingWarehouse(null)
  }


  // ==================================================
  // View
  // ==================================================

  function handleViewWarehouse(
    warehouse: WarehouseResponse,
  ) {
    setViewingWarehouse(warehouse)
  }


  function closeViewModal() {
    setViewingWarehouse(null)
  }


  // ==================================================
  // Submit Create / Update
  // ==================================================

  async function handleSubmit(
    values: WarehouseFormValues,
  ) {
    let success: boolean

    if (editingWarehouse) {
      success = await update(
        editingWarehouse.warehouseId,
        {
          code: values.code,
          name: values.name,
          address: values.address,
          city: values.city,
          phoneNumber: values.phoneNumber,
          email: values.email,
        },
      )
    } else {
      success = await create({
        code: values.code,
        name: values.name,
        address: values.address,
        city: values.city,
        phoneNumber: values.phoneNumber,
        email: values.email,
      })
    }

    if (success) {
      closeFormModal()
    }
  }


  // ==================================================
  // Deactivate
  // ==================================================

  function handleDeactivateWarehouse(
    warehouse: WarehouseResponse,
  ) {
    Modal.confirm({
      title: t(
        'warehouse.deactivateTitle',
      ),

      content: (
        <>
          {t(
            'warehouse.deactivateMessage',
          )}{' '}
          <strong>
            {warehouse.name}
          </strong>
          ?
        </>
      ),

      okText: t(
        'warehouse.deactivate',
      ),

      okType: 'danger',

      cancelText: t(
        'common.cancel',
      ),

      onOk: async () => {
        setDeactivatingId(
          warehouse.warehouseId,
        )

        try {
          await deactivate(
            warehouse.warehouseId,
          )
        } finally {
          setDeactivatingId(null)
        }
      },
    })
  }


  // ==================================================
  // Activate
  // ==================================================

  function handleActivateWarehouse(
    warehouse: WarehouseResponse,
  ) {
    Modal.confirm({
      title: t(
        'warehouse.activateTitle',
      ),

      content: (
        <>
          {t(
            'warehouse.activateMessage',
          )}{' '}
          <strong>
            {warehouse.name}
          </strong>
          ?
        </>
      ),

      okText: t(
        'warehouse.activate',
      ),

      cancelText: t(
        'common.cancel',
      ),

      onOk: async () => {
        setActivatingId(
          warehouse.warehouseId,
        )

        try {
          await activate(
            warehouse.warehouseId,
          )
        } finally {
          setActivatingId(null)
        }
      },
    })
  }


  // ==================================================
  // Render
  // ==================================================

  return (
    <div>

      {/* ================================================
          Page Header
          ================================================ */}

      <div>
        <Title
          level={2}
          style={{
            margin: 0,
            color: '#263238',
          }}
        >
          {t('warehouse.title')}
        </Title>

        <Text type="secondary">
          {t(
            'warehouse.description',
          )}
        </Text>
      </div>


      {/* ================================================
          Error
          ================================================ */}

      {error && (
        <Alert
          type="error"
          showIcon
          message={t(
            'warehouse.loadError',
          )}
          description={error}
          action={
            <Button
              size="small"
              onClick={() =>
                loadWarehouses()
              }
            >
              {t(
                'common.refresh',
              )}
            </Button>
          }
          style={{
            marginTop: 24,
          }}
        />
      )}


      {/* ================================================
          Warehouse Table Card
          ================================================ */}

      <Card
        style={{
          marginTop: 24,
          background: '#f7f8fa',
        }}
      >

        {/* ================================================
            Toolbar
            ================================================ */}

        <Row
          gutter={[12, 12]}
          align="middle"
          justify="space-between"
          style={{
            marginBottom: 20,
          }}
        >

          <Col xs={24} lg={18}>
            <WarehouseFilters
              search={search}
              status={status}
              onSearch={handleSearch}
              onStatusChange={
                handleStatusChange
              }
            />
          </Col>


          <Col
            xs={24}
            lg={6}
            style={{
              textAlign: 'right',
            }}
          >

            <Row
              gutter={[8, 8]}
              justify="end"
            >

              {/* Refresh - Everyone */}

              <Col>
                <Button
                  icon={
                    <ReloadOutlined />
                  }
                  onClick={() =>
                    loadWarehouses()
                  }
                  loading={loading}
                >
                  {t(
                    'common.refresh',
                  )}
                </Button>
              </Col>


              {/* Add Warehouse - Admin Only */}

              {isAdmin && (
                <Col>
                  <Button
                    type="primary"
                    icon={
                      <PlusOutlined />
                    }
                    onClick={
                      openCreateModal
                    }
                  >
                    {t(
                      'warehouse.addWarehouse',
                    )}
                  </Button>
                </Col>
              )}

            </Row>
          </Col>

        </Row>


        {/* ================================================
            Warehouse Table
            ================================================ */}

        <WarehouseTable
          warehouses={warehouses}
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}

          onPageChange={
            handlePageChange
          }

          onSortChange={
            handleSortChange
          }

          onView={
            handleViewWarehouse
          }

          /*
           * Admin only
           */
          onEdit={
            isAdmin
              ? openEditModal
              : undefined
          }

          onActivate={
            isAdmin
              ? handleActivateWarehouse
              : undefined
          }

          onDeactivate={
            isAdmin
              ? handleDeactivateWarehouse
              : undefined
          }

          activatingId={
            activatingId
          }

          deactivatingId={
            deactivatingId
          }
        />

      </Card>


      {/* ================================================
          Create / Edit Modal
          Admin Only
          ================================================ */}

      {isAdmin && (
        <WarehouseFormModal
          open={formOpen}
          editingWarehouse={
            editingWarehouse
          }
          submitting={submitting}
          onCancel={
            closeFormModal
          }
          onSubmit={handleSubmit}
        />
      )}


      {/* ================================================
          View Warehouse Modal
          Everyone
          ================================================ */}

      <Modal
        title={t(
          'warehouse.details',
        )}

        open={
          viewingWarehouse !== null
        }

        onCancel={
          closeViewModal
        }

        footer={null}

        destroyOnHidden
      >

        {viewingWarehouse && (
          <Descriptions
            bordered
            column={1}
            size="middle"
          >

            <Descriptions.Item label="ID">
              {
                viewingWarehouse.warehouseId
              }
            </Descriptions.Item>

            <Descriptions.Item
              label={t(
                'warehouse.code',
              )}
            >
              {
                viewingWarehouse.code
              }
            </Descriptions.Item>

            <Descriptions.Item
              label={t(
                'warehouse.name',
              )}
            >
              {
                viewingWarehouse.name
              }
            </Descriptions.Item>

            <Descriptions.Item
              label={t(
                'warehouse.address',
              )}
            >
              {
                viewingWarehouse.address ||
                '-'
              }
            </Descriptions.Item>

            <Descriptions.Item
              label={t(
                'warehouse.city',
              )}
            >
              {
                viewingWarehouse.city ||
                '-'
              }
            </Descriptions.Item>

            <Descriptions.Item
              label={t(
                'warehouse.phoneNumber',
              )}
            >
              {
                viewingWarehouse.phoneNumber ||
                '-'
              }
            </Descriptions.Item>

            <Descriptions.Item
              label={t(
                'warehouse.email',
              )}
            >
              {
                viewingWarehouse.email ||
                '-'
              }
            </Descriptions.Item>

            <Descriptions.Item
              label={t(
                'common.status',
              )}
            >
              {viewingWarehouse.status ===
              'ACTIVE'
                ? t(
                    'warehouse.active',
                  )
                : t(
                    'warehouse.inactive',
                  )}
            </Descriptions.Item>

          </Descriptions>
        )}

      </Modal>

    </div>
  )
}