import { apiRequest } from '../api/client'
import type {
  CreateUserRequest,
  User,
} from '../features/administration/users/types/user'

export function getUsers(): Promise<User[]> {
  return apiRequest<User[]>('/users')
}

export function createUser(
  request: CreateUserRequest,
): Promise<User> {
  return apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function deactivateUser(
  id: number,
): Promise<void> {
  return apiRequest<void>(
    `/users/${id}/deactivate`,
    {
      method: 'PATCH',
    },
  )
}

export function activateUser(
  id: number,
): Promise<void> {
  return apiRequest<void>(
    `/users/${id}/activate`,
    {
      method: 'PATCH',
    },
  )
}