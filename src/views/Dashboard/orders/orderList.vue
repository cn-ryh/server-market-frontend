<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue'
import {
    NDataTable, NTabs, NTabPane, NPagination, NButton, NTag, NSpace, NInput,
    useMessage, DataTableColumns, DataTableSortState
} from 'naive-ui'
import { get } from '@/net/base'
import { useUserStore } from '@/stores/user'

const messager = useMessage()
const userStore = useUserStore()

// 订单类型定义
interface Order {
    id: number
    productId: number
    productName: string
    price: number
    createTime: string
    status: 'completed' | 'pending' | 'canceled'
    balanceAfter: number
    counterparty: string
    counterpartyId: number
}

// 响应式数据
const activeTab = ref<'buyer' | 'seller'>('buyer')
const buyerOrders = ref<Order[]>([])
const sellerOrders = ref<Order[]>([])
const loading = ref(false)
const filterText = ref('')
const buyerPagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0
})
const sellerPagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0
})
// const sortState = ref<DataTableSortState>({
//   columnKey: 'createTime',
//   order: 'descend'
// })

// 获取订单数据
async function fetchOrders() {
    try {
        loading.value = true
        const response = await get('/order/list')
        buyerOrders.value = response.data.buyerOrders
        sellerOrders.value = response.data.sellerOrders
        buyerPagination.itemCount = buyerOrders.value.length
        sellerPagination.itemCount = sellerOrders.value.length
    } catch (error) {
        messager.error('获取订单列表失败')
        console.error(error)
    } finally {
        loading.value = false
    }
}

// 表格列定义
const createColumns = (): DataTableColumns<Order> => [
    {
        title: '订单ID',
        key: 'id',
        sorter: (a, b) => a.id - b.id
    },
    {
        title: '商品名称',
        key: 'productName',
        render: (row) => (
            <NButton
                text
                type="primary"
                onClick={() => window.location.href = `/productdetail?id=${row.productId}`}
            >
                {row.productName}
            </NButton>
        ),
        filter(value, row) {
            return row.productName.includes(value as string)
        }
    },
    {
        title: '价格',
        key: 'price',
        render: (row) => `¥${row.price.toFixed(2)}`,
        sorter: (a, b) => a.price - b.price
    },
    {
        title: '交易时间',
        key: 'createTime',
        sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
    },
    {
        title: '交易后余额',
        key: 'balanceAfter',
        render: (row) => `¥${row.balanceAfter.toFixed(2)}`,
        sorter: (a, b) => a.balanceAfter - b.balanceAfter
    },
    {
        title: '交易对象',
        key: 'counterparty',
        render: (row) => `${row.counterparty} (ID:${row.counterpartyId})`
    },
    {
        title: '状态',
        key: 'status',
        render: (row) => {
            const statusMap = {
                completed: { type: 'success', text: '已完成' },
                pending: { type: 'warning', text: '处理中' },
                canceled: { type: 'error', text: '已取消' }
            }
            const status = statusMap[row.status]
            return <NTag type={(status.type as any)}> {status.text} </NTag >
        }
    }
]

const columns = createColumns()

// 处理分页变化
function handleBuyerPageChange(page: number) {
    buyerPagination.page = page
}

function handleSellerPageChange(page: number) {
    sellerPagination.page = page
}

// 处理每页大小变化
function handleBuyerPageSizeChange(pageSize: number) {
    buyerPagination.pageSize = pageSize
    buyerPagination.page = 1
}

function handleSellerPageSizeChange(pageSize: number) {
    sellerPagination.pageSize = pageSize
    sellerPagination.page = 1
}

// 初始化获取数据
onMounted(() => {
    fetchOrders()
})
</script>

<template>
    <div class="order-list-container">
        <h1 class="page-title">我的订单</h1>

        <div class="filter-section">
            <NInput v-model:value="filterText" placeholder="搜索商品名称..." clearable>
                <template #prefix>
                    <i class="search-icon"></i>
                </template>
            </NInput>
        </div>

        <NTabs v-model:value="activeTab" type="line" animated>
            <NTabPane name="buyer" tab="购买记录">
                <NDataTable :columns="columns" :data="buyerOrders" :pagination="buyerPagination" :loading="loading"
                    :bordered="true" :remote="true" :single-line="false" :row-key="(row: Order) => row.id"
                    :filter="filterText" />

                <div class="pagination-wrapper">
                    <NSpace vertical>
                        <NPagination v-model:page="buyerPagination.page"
                            :page-count="Math.ceil(buyerPagination.itemCount / buyerPagination.pageSize)"
                            :page-sizes="[10, 20, 50]" :page-size="buyerPagination.pageSize"
                            @update:page="handleBuyerPageChange" @update:page-size="handleBuyerPageSizeChange"
                            show-size-picker />
                    </NSpace>
                </div>
            </NTabPane>

            <NTabPane name="seller" tab="出售记录">
                <NDataTable :columns="columns" :data="sellerOrders" :pagination="sellerPagination" :loading="loading"
                    :bordered="true" :remote="true" :single-line="false" :row-key="(row: Order) => row.id"
                    :filter="filterText" />

                <div class="pagination-wrapper">
                    <NSpace vertical>
                        <NPagination v-model:page="sellerPagination.page"
                            :page-count="Math.ceil(sellerPagination.itemCount / sellerPagination.pageSize)"
                            :page-sizes="[10, 20, 50]" :page-size="sellerPagination.pageSize"
                            @update:page="handleSellerPageChange" @update:page-size="handleSellerPageSizeChange"
                            show-size-picker />
                    </NSpace>
                </div>
            </NTabPane>
        </NTabs>
    </div>
</template>

<style scoped>
.order-list-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.page-title {
    text-align: center;
    margin-bottom: 24px;
    color: #333;
}

.filter-section {
    margin-bottom: 20px;
    max-width: 300px;
}

.pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.search-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999999' d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
    background-size: contain;
    margin-right: 8px;
}
</style>