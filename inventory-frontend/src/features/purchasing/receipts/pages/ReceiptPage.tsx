import { Button, Card, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type Receipt = {
id: number
receiptNo: string
purchaseOrderNo: string
vendor: string
receiptDate: string
receivedItems: number
status: 'PENDING' | 'PARTIAL' | 'RECEIVED' | 'INSPECTION' | 'COMPLETED'
}

const demoData: Receipt[] = [
{
id: 1,
receiptNo: 'GR-0001',
purchaseOrderNo: 'PO-0001',
vendor: 'ABC Supplies',
receiptDate: '2026-09-16',
receivedItems: 20,
status: 'COMPLETED',
},
{
id: 2,
receiptNo: 'GR-0002',
purchaseOrderNo: 'PO-0002',
vendor: 'XYZ Trading',
receiptDate: '2026-09-16',
receivedItems: 15,
status: 'INSPECTION',
},
{
id: 3,
receiptNo: 'GR-0003',
purchaseOrderNo: 'PO-0003',
vendor: 'DEF Supply',
receiptDate: '2026-09-15',
receivedItems: 8,
status: 'PARTIAL',
},
]

const statusColors: Record<Receipt['status'], string> = {
PENDING: 'default',
PARTIAL: 'warning',
RECEIVED: 'processing',
INSPECTION: 'orange',
COMPLETED: 'success',
}

export default function ReceiptPage() {
const columns: ColumnsType<Receipt> = [
{
title: 'Receipt No.',
dataIndex: 'receiptNo',
key: 'receiptNo',
},
{
title: 'Purchase Order',
dataIndex: 'purchaseOrderNo',
key: 'purchaseOrderNo',
},
{
title: 'Vendor',
dataIndex: 'vendor',
key: 'vendor',
},
{
title: 'Receipt Date',
dataIndex: 'receiptDate',
key: 'receiptDate',
},
{
title: 'Items Received',
dataIndex: 'receivedItems',
key: 'receivedItems',
},
{
title: 'Status',
dataIndex: 'status',
key: 'status',
render: (status: Receipt['status']) => ( <Tag color={statusColors[status]}>
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
title="Receipts"
extra={ <Space> <Button type="primary">
Receive Goods </Button> </Space>
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
