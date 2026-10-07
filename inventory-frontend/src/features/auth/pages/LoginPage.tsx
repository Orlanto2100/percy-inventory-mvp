import { useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
} from 'antd'
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login } from '../../../api/authApi'

const { Title, Text } = Typography

type LoginFormValues = {
  username: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (
    values: LoginFormValues
  ) => {
    try {
      setLoading(true)

      const response = await login(values)

      localStorage.setItem(
        'token',
        response.token
      )

      localStorage.setItem(
        'username',
        response.username
      )

      localStorage.setItem(
        'accountType',
        response.accountType
      )

      if (response.role) {
        localStorage.setItem(
          'role',
          response.role
        )
      } else {
        localStorage.removeItem('role')
      }

      if (response.warehouseId != null) {
        localStorage.setItem(
          'warehouseId',
          String(response.warehouseId)
        )
      } else {
        localStorage.removeItem(
          'warehouseId'
        )
      }

      message.success(
        'Login successful.'
      )

      navigate('/')
    } catch {
      message.error(
        'Invalid username or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fa',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
        }}
        styles={{
          body: {
            padding: 40,
          },
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <Title
            level={2}
            style={{
              marginBottom: 8,
              color: '#263238',
            }}
          >
            Inventory Management System
          </Title>

          <Text type="secondary">
            Sign in to continue
          </Text>
        </div>

        <Form<LoginFormValues>
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message:
                  'Please enter your username',
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message:
                  'Please enter your password',
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          <Text type="secondary">
            Inventory Management System
          </Text>
        </div>
      </Card>
    </div>
  )
}