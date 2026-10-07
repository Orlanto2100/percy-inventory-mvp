import { useEffect, useState } from 'react'
import { message } from 'antd'

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type ProductResponse,
} from '../../../api/productApi'

export type CreateProductValues = {
  productName: string
  sku: string
  price: number
  description?: string
}

export type UpdateProductValues = {
  productName: string
  price: number
  description?: string
}

export function useProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getProducts()

      setProducts(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load products.'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const create = async (
    values: CreateProductValues,
  ): Promise<boolean> => {
    try {
      setSubmitting(true)

      const newProduct = await createProduct(values)

      setProducts((currentProducts) => [
        ...currentProducts,
        newProduct,
      ])

      message.success('Product created successfully.')

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create product.'

      message.error(errorMessage)

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const update = async (
    productId: number,
    values: UpdateProductValues,
  ): Promise<boolean> => {
    try {
      setSubmitting(true)

      const updatedProduct = await updateProduct(
        productId,
        values,
      )

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.productId === productId
            ? updatedProduct
            : product,
        ),
      )

      message.success('Product updated successfully.')

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update product.'

      message.error(errorMessage)

      return false
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (
    productId: number,
  ): Promise<boolean> => {
    try {
      setDeletingId(productId)

      await deleteProduct(productId)

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.productId !== productId,
        ),
      )

      message.success('Product deleted successfully.')

      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete product.'

      message.error(errorMessage)

      return false
    } finally {
      setDeletingId(null)
    }
  }

  return {
    products,
    loading,
    submitting,
    deletingId,
    error,
    loadProducts,
    create,
    update,
    remove,
  }
}