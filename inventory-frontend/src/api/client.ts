const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8080/api'

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    },
  )

  if (!response.ok) {
    let errorMessage =
      `Request failed (${response.status})`

    try {
      const errorBody = await response.json()

      if (errorBody.detail) {
        errorMessage = errorBody.detail
      } else if (errorBody.message) {
        errorMessage = errorBody.message
      } else if (errorBody.error) {
        errorMessage = errorBody.error
      }
    } catch {
      // Response wasn't JSON.
    }

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text)
}