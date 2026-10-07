import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Modal,
  Row,
  Typography,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'

import type { CustomerResponse } from '../../../api/customerApi'
import CustomerTable from '../components/CustomerTable'
import CustomerModal, {
  type CustomerFormValues,
} from '../components/CustomerModal'
import { useCustomers } from '../hooks/useCustomers'

const { Title, Text } = Typography

export default function CustomerPage() {
  const {
    customers,
    loading,
    submitting,
    deletingId,
    error,
    loadCustomers,
    create,
    update,
    remove,
  } = useCustomers()

  const [searchText, setSearchText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] =
    useState<CustomerResponse | null>(null)

  const filteredCustomers = useMemo(() => {
    const search = searchText.toLowerCase().trim()

    if (!search) {
      return customers
    }

    return customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(search) ||
        customer.phone
          .toLowerCase()
          .includes(search) ||
        (customer.email ?? '')
          .toLowerCase()
          .includes(search) ||
        (customer.address ?? '')
          .toLowerCase()
          .includes(search)
      )
    })
  }, [customers, searchText])

  const openCreateModal = () => {
    setEditingCustomer(null)
    setModalOpen(true)
  }

  const openEditModal = (
    customer: CustomerResponse,
  ) => {
    setEditingCustomer(customer)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (submitting) {
      return
    }

    setModalOpen(false)
    setEditingCustomer(null)
  }

  const handleSubmit = async (
    values: CustomerFormValues,
  ) => {
    let success: boolean

    if (editingCustomer) {
      success = await update(
        editingCustomer.customerId,
        {
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
        },
      )
    } else {
      success = await create(values)
    }

    if (success) {
      closeModal()
    }
  }

  const handleDelete = (
    customer: CustomerResponse,
  ) => {
    Modal.confirm({
      title: 'Delete customer?',
      content: (
        <>
          Are you sure you want to delete{' '}
          <strong>{customer.name}</strong>?
        </>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',

      onOk: async () => {
        await remove(customer.customerId)
      },
    })
  }

  return (
    <div>
      {/* Page header */}
      <div>
        <Title
          level={2}
          style={{
            margin: 0,
            color: '#263238',
          }}
        >
          Customers
        </Title>

        <Text type="secondary">
          Manage customers in your inventory system.
        </Text>
      </div>

      {/* Error message */}
      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load customers"
          description={error}
          action={
            <Button
              size="small"
              onClick={loadCustomers}
            >
              Retry
            </Button>
          }
          style={{
            marginTop: 24,
          }}
        />
      )}

      {/* Customer table card */}
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
            <Row gutter={[8, 8]}>
              <Col
                xs={24}
                sm={16}
                md={14}
                lg={12}
              >
                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <SearchOutlined
                    style={{
                      position: 'absolute',
                      left: 11,
                      top: '50%',
                      transform:
                        'translateY(-50%)',
                      zIndex: 1,
                    }}
                  />

                  <input
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(
                        event.target.value,
                      )
                    }
                    placeholder="Search customers..."
                    style={{
                      width: '100%',
                      height: 32,
                      paddingLeft: 32,
                      paddingRight: 8,
                      border:
                        '1px solid #d9d9d9',
                      borderRadius: 6,
                      outline: 'none',
                    }}
                  />
                </div>
              </Col>

              <Col
                xs={24}
                sm={8}
                md={6}
                lg={4}
              >
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadCustomers}
                  loading={loading}
                  style={{
                    width: '100%',
                  }}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
          </Col>

          <Col
            xs={24}
            lg={6}
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Add Customer
            </Button>
          </Col>
        </Row>

        {/* Customer table */}
        <CustomerTable
          customers={filteredCustomers}
          loading={loading}
          deletingId={deletingId}
          searchText={searchText}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </Card>

      {/* Create/Edit modal */}
      <CustomerModal
        open={modalOpen}
        editingCustomer={editingCustomer}
        submitting={submitting}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  )
}