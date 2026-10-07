import { Button, Card, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type CustomerInvoice = {
id: number
invoiceNo: string
salesOrderNo: string
customer: string
invoiceDate: string
dueDate: string
totalAmount: number
status: 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED'
}

const demoData: CustomerInvoice[] = [
{
id: 1,
invoiceNo: 'INV-0001',
salesOrderNo: 'SO-0001',
customer: 'ABC Company',
invoiceDate: '2026-09-16',
dueDate: '2026-10-16',
totalAmount: 5200,
status: 'PAID',
},
{
id: 2,
invoiceNo: 'INV-0002',
salesOrderNo: 'SO-0002',
customer: 'XYZ Trading',
invoiceDate: '2026-09-15',
dueDate: '2026-10-15',
totalAmount: 8750,
status: 'PARTIALLY_PAID',
},
{
id: 3,
invoiceNo: 'INV-0003',
salesOrderNo: 'SO-0003',
customer: 'DEF Store',
invoiceDate: '2026-09-14',
dueDate: '2026-09-21',
totalAmount: 3100,
status: 'OVERDUE',
},
]

const statusColors: Record<CustomerInvoice['status'], string> = {
DRAFT: 'default',
POSTED: 'processing',
PARTIALLY_PAID: 'warning',
PAID: 'success',
OVERDUE: 'error',
CANCELLED: 'default',
}

export default function CustomerInvoicePage() {
const columns: ColumnsType<CustomerInvoice> = [
{
title: 'Invoice No.',
dataIndex: 'invoiceNo',
key: 'invoiceNo',
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
title: 'Invoice Date',
dataIndex: 'invoiceDate',
key: 'invoiceDate',
},
{
title: 'Due Date',
dataIndex: 'dueDate',
key: 'dueDate',
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
render: (status: CustomerInvoice['status']) => ( <Tag color={statusColors[status]}>
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
title="Customer Invoices"
extra={ <Space> <Button>
View Unpaid </Button> </Space>
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
