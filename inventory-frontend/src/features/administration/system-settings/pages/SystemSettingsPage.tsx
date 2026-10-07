import {
  Card,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd'

const { Title, Text } = Typography

function SystemSettingsPage() {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%' }}
    >
      <div>
        <Title level={2}>
          System Settings
        </Title>

        <Text type="secondary">
          Configure general system behavior and
          application defaults.
        </Text>
      </div>

      <Card title="General">
        <Row gutter={[24, 20]}>
          <Col xs={24} md={12}>
            <Space
              direction="vertical"
              style={{ width: '100%' }}
            >
              <Text strong>
                Company Name
              </Text>

              <Input
                placeholder="Company name"
              />
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Space
              direction="vertical"
              style={{ width: '100%' }}
            >
              <Text strong>
                Company Email
              </Text>

              <Input
                placeholder="Company email"
              />
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Space
              direction="vertical"
              style={{ width: '100%' }}
            >
              <Text strong>
                Phone
              </Text>

              <Input
                placeholder="Company phone"
              />
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Space
              direction="vertical"
              style={{ width: '100%' }}
            >
              <Text strong>
                Currency
              </Text>

              <Select
                defaultValue="MMK"
                style={{ width: '100%' }}
                options={[
                  {
                    value: 'MMK',
                    label: 'MMK - Myanmar Kyat',
                  },
                  {
                    value: 'USD',
                    label: 'USD - US Dollar',
                  },
                  {
                    value: 'JPY',
                    label: 'JPY - Japanese Yen',
                  },
                ]}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="Inventory">
        <Space
          direction="vertical"
          size="large"
          style={{ width: '100%' }}
        >
          <Space>
            <Switch />
            <div>
              <Text strong>
                Allow Negative Stock
              </Text>

              <br />

              <Text type="secondary">
                Allow inventory quantities to fall
                below zero.
              </Text>
            </div>
          </Space>

          <Divider />

          <Space
            direction="vertical"
            style={{ width: '100%' }}
          >
            <Text strong>
              Default Warehouse
            </Text>

            <Select
              placeholder="Select default warehouse"
              style={{ width: 300 }}
              options={[]}
            />
          </Space>
        </Space>
      </Card>

      <Card title="Notifications">
        <Space
          direction="vertical"
          size="large"
        >
          <Space>
            <Switch defaultChecked />
            <Text>
              Low stock alerts
            </Text>
          </Space>

          <Space>
            <Switch defaultChecked />
            <Text>
              Email notifications
            </Text>
          </Space>
        </Space>
      </Card>
    </Space>
  )
}

export default SystemSettingsPage