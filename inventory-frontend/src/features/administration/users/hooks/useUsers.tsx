import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import {
  activateUser as activateUserApi,
  createUser,
  deactivateUser as deactivateUserApi,
  getUsers,
} from '../../../../api/userApi'
import type {
  CreateUserRequest,
  User,
} from '../types/user'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)

      const data = await getUsers()

      setUsers(data)
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : 'Failed to load users',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const addUser = async (
    request: CreateUserRequest,
  ) => {
    try {
      await createUser(request)

      message.success(
        'User created successfully.',
      )

      await loadUsers()
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : 'Failed to create user',
      )

      throw error
    }
  }

  const deactivateUser = async (id: number) => {
    try {
      await deactivateUserApi(id)

      message.success(
        'User deactivated successfully.',
      )

      await loadUsers()
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : 'Failed to deactivate user',
      )
    }
  }

  const activateUser = async (id: number) => {
    try {
      await activateUserApi(id)

      message.success(
        'User activated successfully.',
      )

      await loadUsers()
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : 'Failed to activate user',
      )
    }
  }

  return {
    users,
    loading,
    addUser,
    deactivateUser,
    activateUser,
    reload: loadUsers,
  }
}