<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
    NGrid, NGi, NCard, NSpace, NDivider, NTag,
    NButton, NDescriptions, NDescriptionsItem, NRadioGroup, NRadio
} from 'naive-ui'
import { get } from '@/net/base'

interface BillingCycle {
    billingcycle: string
    billingcycle_zh: string
}

interface ConfigItem {
    id: number
    option_name: string
    sub: any
}

interface Product {
    name: string
    description: string
    cycle: Array<{
        billingcycle_zh: string
        product_price: string
    }>
}

interface HostData {
    regdate: number
    nextduedate: number
    domain: string
    os: string
    username: string
    password: string
    dedicatedip: string
    domainstatus: string
}

interface ProductData {
    databaseInfo: {
        readonly id: number;
        user_id: number;
        title: string;
        price: string;
        status: "available" | "unavailable" | "maintenance"; // 联合类型增强安全性

        cpu: string;
        memory: string;

        systemDisk: string; // 可优化为对象类型 { linux: number; windows: number }

        dataDisk: string;
        uploadSpeed: string;
        downloadSpeed: string;

        description: string;

        created_at: string; // 实际使用可转为Date类型
    },
    billing_cycle: BillingCycle[]
    host_data: HostData
    config_array: ConfigItem[]
    product: Product
    configRes: {
        cpu: string
        memory: string
        uploadSpeed: string
        downloadSpeed: string
        systemDisk: string
    }
}

const props = defineProps<{ id: number }>()
const productData = ref<ProductData | null>(null)
const selectedBillingCycle = ref('月付')

onMounted(async () => {
    // 模拟API请求
    // 实际开发中应使用:
    productData.value = (await get(`/product/${props.id}`)).data;
    console.log(productData.value);

})

// 获取当前价格
const currentPrice = computed(() => {
    if (!productData.value) return '0.00'

    return productData.value.databaseInfo.price;
})

// 格式化日期
const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
}

// 获取配置项的值
const getConfigValue = (configId: number) => {
    if (!productData.value) return ''

    const config = productData.value.config_array.find(item => item.id === configId)
    if (!config) return ''
    // 处理不同的sub格式
    if (Array.isArray(config.sub)) {
        return config.sub[0].option_name
    } else if (typeof config.sub === 'object') {
        const keys = Object.keys(config.sub)
        if (keys.length > 0) {
            const child = config.sub[keys[0]].child
            if (child && child.length > 0) {
                return child[0].version
            }
        }
    }

    return ''
}
</script>

<template>
    <div class="product-detail" v-if="productData">
        <n-grid cols="24" x-gap="20" responsive="screen">
            <!-- 左侧参数区域 -->
            <n-gi span="18">
                <n-space vertical>
                    <!-- 商品标题 -->
                    <n-card>
                        <h1>{{ productData.product.name }}</h1>
                    </n-card>

                    <!-- 主要配置 -->
                    <n-card title="配置参数">
                        <n-grid cols="2 s:3 m:4" x-gap="12" y-gap="12">
                            <n-gi v-for="config in [
                                { id: 13, name: 'CPU', value: `${productData.configRes.cpu}核` },
                                { id: 14, name: '内存', value: `${parseInt(productData.configRes.memory) / 1024}G` },
                                { id: 15, name: '系统盘', value: '40G' },
                                { id: 17, name: '带宽', value: `${productData.configRes.uploadSpeed??productData.configRes.downloadSpeed}Mbps` },
                                { id: 18, name: '流入带宽', value: `${productData.configRes.downloadSpeed??productData.configRes.uploadSpeed}Mbps` },
                                { id: 19, name: 'IP数量', value: getConfigValue(19) }
                            ]" :key="config.id">
                                <n-card size="small" hoverable>
                                    <div class="config-title">{{ config.name }}</div>
                                    <div class="config-value">{{ config.value }}</div>
                                </n-card>
                            </n-gi>
                        </n-grid>
                    </n-card>

                    <!-- 详细信息 -->
                    <n-card title="详细信息">
                        <n-descriptions label-placement="left" bordered size="small" :column="1">
                            <n-descriptions-item label="区域">
                                {{ getConfigValue(11) }}
                            </n-descriptions-item>
                            <n-descriptions-item label="操作系统">
                                {{ getConfigValue(12) }}
                            </n-descriptions-item>
                            <n-descriptions-item label="网络类型">
                                {{ getConfigValue(16) }}
                            </n-descriptions-item>
                            <n-descriptions-item label="NAT转发">
                                {{ getConfigValue(20) }}
                            </n-descriptions-item>
                            <n-descriptions-item label="创建时间">
                                {{ formatDate(productData.host_data.regdate) }}
                            </n-descriptions-item>
                            <n-descriptions-item label="到期时间">
                                {{ formatDate(productData.host_data.nextduedate) }}
                            </n-descriptions-item>
                            <n-descriptions-item label="状态">
                                <n-tag type="success" size="small">已激活</n-tag>
                            </n-descriptions-item>
                        </n-descriptions>
                    </n-card>
                </n-space>
            </n-gi>

            <!-- 右侧购买区域 -->
            <n-gi span="6">
                <n-card class="purchase-card">
                    <n-space vertical>
                        <div class="price">
                            <div class="price-label">当前价格</div>
                            <div class="price-value">¥ {{ currentPrice }}</div>
                        </div>

                        <n-divider />

                        <div class="billing-cycle">
                            <n-radio-group v-model:value="selectedBillingCycle">
                                <n-space vertical>
                                    <n-radio v-for="cycle in productData.product.cycle" :key="cycle.billingcycle_zh"
                                        :value="`${cycle.billingcycle_zh}付`"
                                        :label="`${cycle.billingcycle_zh}付 ¥${cycle.product_price}`" />
                                </n-space>
                            </n-radio-group>
                        </div>

                        <n-button type="primary" size="large" block class="buy-button">
                            立即购买
                        </n-button>

                        <n-divider />

                        <div class="account-info">
                            <p><strong>登录信息</strong></p>
                            <p>用户名: {{ productData.host_data.username }}</p>
                            <p>密码: {{ productData.host_data.password }}</p>
                        </div>
                    </n-space>
                </n-card>
            </n-gi>
        </n-grid>
    </div>

    <div v-else class="loading">
        加载中...
    </div>
</template>

<style scoped>
.product-detail {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
}

.product-description {
    margin-top: 15px;
    color: #666;
    line-height: 1.6;
}

.product-description li {
    margin: 5px 0;
}

.config-title {
    font-size: 12px;
    color: #999;
}

.config-value {
    font-size: 16px;
    font-weight: bold;
    margin-top: 5px;
}

.purchase-card {
    position: sticky;
    top: 20px;
}

.price {
    text-align: center;
}

.price-label {
    font-size: 14px;
    color: #666;
}

.price-value {
    font-size: 28px;
    font-weight: bold;
    color: #f56c6c;
    margin-top: 5px;
}

.billing-cycle {
    margin: 15px 0;
}

.buy-button {
    margin-top: 20px;
}

.account-info {
    font-size: 13px;
    color: #666;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 4px;
}

.loading {
    text-align: center;
    padding: 50px;
    font-size: 18px;
    color: #999;
}
</style>