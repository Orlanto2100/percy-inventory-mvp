import { Button, Card, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type VendorQuotation = {
id: number
quotationNo: string
rfqNo: string
vendor: string
quotationDate: string
validUntil: string
totalAmount: number
deliveryDays: number
status: 'RECEIVED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED'
}

const demoData: VendorQuotation[] = [
{
id: 1,
quotationNo: 'VQ-0001',
rfqNo: 'RFQ-0001',
vendor: 'ABC Supplies',
quotationDate: '2026-09-16',
validUntil: '2026-09-30',
totalAmount: 5200,
deliveryDays: 7,
status: 'UNDER_REVIEW',
},
{
id: 2,
quotationNo: 'VQ-0002',
rfqNo: 'RFQ-0001',
vendor: 'XYZ Trading',
quotationDate: '2026-09-16',
validUntil: '2026-09-28',
totalAmount: 4900,
deliveryDays: 14,
status: 'RECEIVED',
},
{
id: 3,
quotationNo: 'VQ-0003',
rfqNo: 'RFQ-0001',
vendor: 'DEF Supply',
quotationDate: '2026-09-17',
validUntil: '2026-10-01',
totalAmount: 5250,
deliveryDays: 5,
status: 'ACCEPTED',
},
]

const statusColors: Record<VendorQuotation['status'], string> = {
RECEIVED: 'blue',
UNDER_REVIEW: 'processing',
ACCEPTED: 'success',
REJECTED: 'error',
}

export default function VendorQuotationPage() {
const columns: ColumnsType<VendorQuotation> = [
{
title: 'Quotation No.',
dataIndex: 'quotationNo',
key: 'quotationNo',
},
{
title: 'RFQ No.',
dataIndex: 'rfqNo',
key: 'rfqNo',
},
{
title: 'Vendor',
dataIndex: 'vendor',
key: 'vendor',
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
title: 'Delivery',
dataIndex: 'deliveryDays',
key: 'deliveryDays',
render: (days: number) => `${days} days`,
},
{
title: 'Status',
dataIndex: 'status',
key: 'status',
render: (status: VendorQuotation['status']) => ( <Tag color={statusColors[status]}>
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
title="Vendor Quotations"
extra={ <Space> <Button>
Compare </Button> </Space>
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
