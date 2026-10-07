import { Button, Card, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type CustomerQuotation = {
id: number
quotationNo: string
customer: string
quotationDate: string
validUntil: string
totalAmount: number
status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
}

const demoData: CustomerQuotation[] = [
{
id: 1,
quotationNo: 'CQ-0001',
customer: 'ABC Company',
quotationDate: '2026-09-16',
validUntil: '2026-09-30',
totalAmount: 5200,
status: 'SENT',
},
{
id: 2,
quotationNo: 'CQ-0002',
customer: 'XYZ Trading',
quotationDate: '2026-09-15',
validUntil: '2026-09-25',
totalAmount: 8750,
status: 'ACCEPTED',
},
{
id: 3,
quotationNo: 'CQ-0003',
customer: 'DEF Store',
quotationDate: '2026-09-14',
validUntil: '2026-09-21',
totalAmount: 3100,
status: 'DRAFT',
},
]

const statusColors: Record<CustomerQuotation['status'], string> = {
DRAFT: 'default',
SENT: 'processing',
ACCEPTED: 'success',
REJECTED: 'error',
EXPIRED: 'warning',
}

export default function CustomerQuotationPage() {
const columns: ColumnsType<CustomerQuotation> = [
{
title: 'Quotation No.',
dataIndex: 'quotationNo',
key: 'quotationNo',
},
{
title: 'Customer',
dataIndex: 'customer',
key: 'customer',
},
{
title: 'Quotation Date',
dataIndex: 'quotationDate',
key: 'quotationDate',
},
{
title: 'Valid Until',
dataIndex: 'validUntil',
key: 'validUntil',
},
{
title: 'Total Amount',
dataIndex: 'totalAmount',
key: 'totalAmount',
render: (amount: number) => `$${amount.toLocaleString()}`,
},
{
title: 'Status',
dataIndex: 'status',
key: 'status',
render: (status: CustomerQuotation['status']) => ( <Tag color={statusColors[status]}>
{status} </Tag>
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
title="Customer Quotations"
extra={ <Space> <Button type="primary">
New Quotation </Button> </Space>
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
