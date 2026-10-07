import { Button, Card, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type Delivery = {
id: number
deliveryNo: string
salesOrderNo: string
customer: string
warehouse: string
deliveryDate: string
status: 'PENDING' | 'READY' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

const demoData: Delivery[] = [
{
id: 1,
deliveryNo: 'DO-0001',
salesOrderNo: 'SO-0001',
customer: 'ABC Company',
warehouse: 'Main Warehouse',
deliveryDate: '2026-09-18',
status: 'READY',
},
{
id: 2,
deliveryNo: 'DO-0002',
salesOrderNo: 'SO-0002',
customer: 'XYZ Trading',
warehouse: 'Main Warehouse',
deliveryDate: '2026-09-17',
status: 'SHIPPED',
},
{
id: 3,
deliveryNo: 'DO-0003',
salesOrderNo: 'SO-0003',
customer: 'DEF Store',
warehouse: 'Secondary Warehouse',
deliveryDate: '2026-09-16',
status: 'DELIVERED',
},
]

const statusColors: Record<Delivery['status'], string> = {
PENDING: 'default',
READY: 'processing',
SHIPPED: 'blue',
DELIVERED: 'success',
CANCELLED: 'error',
}

export default function DeliveryPage() {
const columns: ColumnsType<Delivery> = [
{
title: 'Delivery No.',
dataIndex: 'deliveryNo',
key: 'deliveryNo',
},
{
title: 'Sales Order',
dataIndex: 'salesOrderNo',
key: 'salesOrderNo',
},
{
title: 'Customer',
dataIndex: 'customer',
key: 'customer',
},
{
title: 'Warehouse',
dataIndex: 'warehouse',
key: 'warehouse',
},
{
title: 'Delivery Date',
dataIndex: 'deliveryDate',
key: 'deliveryDate',
},
{
title: 'Status',
dataIndex: 'status',
key: 'status',
render: (status: Delivery['status']) => ( <Tag color={statusColors[status]}>
{status.replace('_', ' ')} </Tag>
),
},
{
title: 'Action',
key: 'action',
render: () => ( <Space> <Button type="link">
View </Button> </Space>
),
},
]

return (
<Card
title="Deliveries"
extra={ <Space> <Button>
View Pending </Button> </Space>
}
>
<Table
rowKey="id"
columns={columns}
dataSource={demoData}
pagination={{
pageSize: 10,
}}
/> </Card>
)
}
