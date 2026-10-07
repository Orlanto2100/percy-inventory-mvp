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

import type { VendorResponse } from '../../../../api/vendorApi'

import VendorTable from '../components/VendorTable'
import VendorFilters from '../components/VendorFilters'
import VendorFormModal, {
  type VendorFormValues,
} from '../components/VendorFormModal'

import { useVendors } from '../hooks/useVendors'

const { Title, Text } = Typography

export default function VendorPage() {
  const { t } = useTranslation()

  const {
    vendors,
    loading,
    submitting,
    error,
    total,
    search,
    status,
    page,
    pageSize,

    loadVendors,
    create,
    update,
    deactivate,

    handleSearch,
    handleStatusChange,
    handlePageChange,
    handleSortChange,
  } = useVendors()

  const [formOpen, setFormOpen] = useState(false)

  const [editingVendor, setEditingVendor] =
    useState<VendorResponse | null>(null)

  const [viewingVendor, setViewingVendor] =
    useState<VendorResponse | null>(null)

  const [deactivatingId, setDeactivatingId] =
    useState<number | null>(null)

  function openCreateModal() {
    setEditingVendor(null)
    setFormOpen(true)
  }

  function openEditModal(vendor: VendorResponse) {
    setEditingVendor(vendor)
    setFormOpen(true)
  }

  function closeFormModal() {
    if (submitting) {
      return
    }

    setFormOpen(false)
    setEditingVendor(null)
  }

  function handleViewVendor(vendor: VendorResponse) {
    setViewingVendor(vendor)
  }

  function closeViewModal() {
    setViewingVendor(null)
  }

  async function handleSubmit(
    values: VendorFormValues,
  ) {
    let success: boolean

    if (editingVendor) {
      success = await update(
        editingVendor.id,
        {
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
        },
      )
    } else {
      success = await create({
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
      })
    }

    if (success) {
      closeFormModal()
    }
  }

  function handleDeactivateVendor(
    vendor: VendorResponse,
  ) {
    Modal.confirm({
      title: t('vendor.deactivateTitle'),
      content: (
        <>
          {t('vendor.deactivateMessage')}{' '}
          <strong>{vendor.name}</strong>?
        </>
      ),
      okText: t('vendor.deactivate'),
      okType: 'danger',
      cancelText: t('common.cancel'),

      onOk: async () => {
        setDeactivatingId(vendor.id)

        try {
          await deactivate(vendor.id)
        } finally {
          setDeactivatingId(null)
        }
      },
    })
  }

  return (
    <div>
      {/* Page Header */}
      <div>
        <Title
          level={2}
          style={{
            margin: 0,
            color: '#263238',
          }}
        >
          {t('vendor.title')}
        </Title>

        <Text type="secondary">
          {t('vendor.description')}
        </Text>
      </div>

      {/* Error */}
      {error && (
        <Alert
          type="error"
          showIcon
          message={t('vendor.loadError')}
          description={error}
          action={
            <Button
              size="small"
              onClick={() => loadVendors()}
            >
              {t('common.refresh')}
            </Button>
          }
          style={{
            marginTop: 24,
          }}
        />
      )}

      {/* Vendor Table Card */}
      <Card
        style={{
          marginTop: 24,
          background: '#f7f8fa',
        }}
      >
        {/* Toolbar */}
        <Row
          gutter={[12, 12]}
          align="middle"
          justify="space-between"
          style={{
            marginBottom: 20,
          }}
        >
          <Col xs={24} lg={18}>
            <VendorFilters
              search={search}
              status={status}
              onSearch={handleSearch}
              onStatusChange={handleStatusChange}
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
              <Col>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => loadVendors()}
                  loading={loading}
                >
                  {t('common.refresh')}
                </Button>
              </Col>

              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCreateModal}
                >
                  {t('vendor.addVendor')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Vendor Table */}
        <VendorTable
          vendors={vendors}
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          onView={handleViewVendor}
          onEdit={openEditModal}
          onDeactivate={handleDeactivateVendor}
          deactivatingId={deactivatingId}
        />
      </Card>

      {/* Create / Edit Modal */}
      <VendorFormModal
        open={formOpen}
        editingVendor={editingVendor}
        submitting={submitting}
        onCancel={closeFormModal}
        onSubmit={handleSubmit}
      />

      {/* View Vendor Modal */}
      <Modal
        title={t('vendor.details')}
        open={viewingVendor !== null}
        onCancel={closeViewModal}
        footer={null}
        destroyOnHidden
      >
        {viewingVendor && (
          <Descriptions
            bordered
            column={1}
            size="middle"
          >
            <Descriptions.Item label="ID">
              {viewingVendor.id}
            </Descriptions.Item>

            <Descriptions.Item
              label={t('vendor.name')}
            >
              {viewingVendor.name}
            </Descriptions.Item>

            <Descriptions.Item
              label={t('vendor.phone')}
            >
              {viewingVendor.phone || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={t('vendor.email')}
            >
              {viewingVendor.email || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={t('vendor.address')}
            >
              {viewingVendor.address || '-'}
            </Descriptions.Item>

            <Descriptions.Item
              label={t('common.status')}
            >
              {viewingVendor.status === 'ACTIVE'
                ? t('vendor.active')
                : t('vendor.inactive')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}