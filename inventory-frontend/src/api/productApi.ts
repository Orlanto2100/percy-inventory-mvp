import { apiRequest } from './client'

export type ProductResponse = {
  productId: number
  productName: string
  sku: string
  price: number
  description: string | null
}

export type CreateProductRequest = {
  productName: string
  sku: string
  price: number
  description?: string
}

export type UpdateProductRequest = {
  productName: string
  price: number
  description?: string
}

export function getProducts() {
  return apiRequest<ProductResponse[]>('/products')
}

export function getProductById(id: number) {
  return apiRequest<ProductResponse>(
    `/products/${id}`,
  )
}

export function getProductBySku(sku: string) {
  return apiRequest<ProductResponse>(
    `/products/sku/${encodeURIComponent(sku)}`,
  )
}

export function createProduct(
  request: CreateProductRequest,
) {
  return apiRequest<ProductResponse>('/products', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function updateProduct(
  id: number,
  request: UpdateProductRequest,
) {
  return apiRequest<ProductResponse>(
    `/products/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
  )
}

export function deleteProduct(id: number) {
  return apiRequest<void>(`/products/${id}`, {
    method: 'DELETE',
  })
}