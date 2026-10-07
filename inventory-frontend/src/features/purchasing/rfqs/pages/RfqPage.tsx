import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import RfqFilters, {
  type RfqFilterValues,
} from '../components/RfqFilters'

import RfqTable, {
  type RfqAction,
} from '../components/RfqTable'

import RfqFormModal, {
  type RfqFormValues,
} from '../components/RfqFormModal'

import { useRfqs } from '../hooks/useRfqs'

import { useVendors } from '../../vendors/hooks/useVendors'
import { useProducts } from '../../../products/hooks/useProducts'

const { Title, Text } = Typography

function RfqPage() {
  const [modalOpen, setModalOpen] =
    useState(false)

  const [filters, setFilters] =
    useState<RfqFilterValues>({})

  const {
    rfqs,
    loading,
    submitting,
    create,
  } = useRfqs()

  const {
    vendors,
    loading: vendorsLoading,
  } = useVendors()

  const {
    products,
    loading: productsLoading,
  } = useProducts()

  const vendorOptions = useMemo(
    () =>
      vendors.map((vendor) => ({
        label: vendor.name,
        value: vendor.id,
      })),
    [vendors],
  )

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: product.productName,
        value: product.productId,
      })),
    [products],
  )

  const handleCreate = async (
    values: RfqFormValues,
  ) => {
    const success = await create({
      title: values.title,

      responseDeadline:
        values.responseDeadline!
          .endOf('day')
          .format(
            'YYYY-MM-DDTHH:mm:ss',
          ),

      description:
        values.description,

      vendorIds:
        values.vendorIds,

      items:
        values.items.map(
          (item) => ({
            productId:
              item.productId,
            quantity:
              item.quantity,
            notes:
              item.notes,
          }),
        ),
    })

    if (success) {
      setModalOpen(false)
    }
  }

  const handleAction = async (
    action: RfqAction,
  ) => {
    switch (action) {
      case 'view':
        // TODO
        break

      case 'edit':
        // TODO
        break

      case 'delete':
        // TODO
        break

      case 'reminder':
        // TODO
        break

      case 'close':
        // TODO
        break

      case 'compare':
        // TODO
        break

      case 'purchase-order':
        // TODO
        break

      default:
        break
    }
  }

  return (
    <div>
      <div>
        <Title
          level={2}
          style={{
            margin: 0,
            color: '#263238',
          }}
        >
          Requests for Quotation
        </Title>

        <Text type="secondary">
          Create and manage requests sent
          to vendors.
        </Text>
      </div>

      <Card
        style={{
          marginTop: 24,
          background: '#f7f8fa',
        }}
      >
        <Row
          gutter={[12, 12]}
          align="middle"
          justify="space-between"
          style={{
            marginBottom: 20,
          }}
        >
          <Col xs={24} lg={18}>
            <RfqFilters
              values={filters}
              vendors={vendorOptions}
              onChange={setFilters}
            />
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
              onClick={() =>
                setModalOpen(true)
              }
            >
              Create RFQ
            </Button>
          </Col>
        </Row>

        <RfqTable
          rfqs={rfqs}
          loading={loading}
          onAction={handleAction}
        />
      </Card>

      <RfqFormModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSubmit={handleCreate}
        vendors={vendorOptions}
        products={productOptions}
        submitting={
          submitting ||
          vendorsLoading ||
          productsLoading
        }
      />
    </div>
  )
}

export default RfqPage