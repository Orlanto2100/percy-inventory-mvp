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

import type { ProductResponse } from '../../../api/productApi'
import ProductTable from '../components/ProductTable'
import ProductModal, {
  type ProductFormValues,
} from '../components/ProductModal'
import { useProducts } from '../hooks/useProducts'

const { Title, Text } = Typography

export default function ProductPage() {
  const {
    products,
    loading,
    submitting,
    deletingId,
    error,
    loadProducts,
    create,
    update,
    remove,
  } = useProducts()

  const [searchText, setSearchText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] =
    useState<ProductResponse | null>(null)

  const filteredProducts = useMemo(() => {
    const search = searchText.toLowerCase().trim()

    if (!search) {
      return products
    }

    return products.filter((product) => {
      return (
        product.productName
          .toLowerCase()
          .includes(search) ||
        product.sku
          .toLowerCase()
          .includes(search) ||
        (product.description ?? '')
          .toLowerCase()
          .includes(search)
      )
    })
  }, [products, searchText])

  const openCreateModal = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const openEditModal = (product: ProductResponse) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (submitting) {
      return
    }

    setModalOpen(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (
    values: ProductFormValues,
  ) => {
    let success: boolean

    if (editingProduct) {
      success = await update(
        editingProduct.productId,
        {
          productName: values.productName,
          price: values.price,
          description: values.description,
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
    product: ProductResponse,
  ) => {
    Modal.confirm({
      title: 'Delete product?',
      content: (
        <>
          Are you sure you want to delete{' '}
          <strong>{product.productName}</strong>?
        </>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',

      onOk: async () => {
        await remove(product.productId)
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
          Products
        </Title>

        <Text type="secondary">
          Manage products in your inventory system.
        </Text>
      </div>

      {/* Error message */}
      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load products"
          description={error}
          action={
            <Button
              size="small"
              onClick={loadProducts}
            >
              Retry
            </Button>
          }
          style={{
            marginTop: 24,
          }}
        />
      )}

      {/* Product table card */}
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
              <Col xs={24} sm={16} md={14} lg={12}>
                <div style={{ position: 'relative' }}>
                  <SearchOutlined
                    style={{
                      position: 'absolute',
                      left: 11,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                    }}
                  />

                  <input
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(event.target.value)
                    }
                    placeholder="Search products..."
                    style={{
                      width: '100%',
                      height: 32,
                      paddingLeft: 32,
                      paddingRight: 8,
                      border: '1px solid #d9d9d9',
                      borderRadius: 6,
                      outline: 'none',
                    }}
                  />
                </div>
              </Col>

              <Col xs={24} sm={8} md={6} lg={4}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadProducts}
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
              Add Product
            </Button>
          </Col>
        </Row>

        {/* Product table */}
        <ProductTable
          products={filteredProducts}
          loading={loading}
          deletingId={deletingId}
          searchText={searchText}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </Card>

      {/* Create/Edit modal */}
      <ProductModal
        open={modalOpen}
        editingProduct={editingProduct}
        submitting={submitting}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  )
}