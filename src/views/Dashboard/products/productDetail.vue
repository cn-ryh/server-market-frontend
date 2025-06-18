<script setup lang="tsx">
import { ref, computed, onMounted } from 'vue'
import {
    NGrid, NGi, NCard, NSpace, NDivider, NTag,
    NButton, NDescriptions, NDescriptionsItem,
    useMessage,
    useModal
} from 'naive-ui'
import { get } from '@/net/base'
import { useUserStore } from '@/stores/user';
const messager = useMessage();
const showMessage = () => {
    messager.warning(`逗你的，怎么可能给你看`);
}
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
        area?: {
            qty: number,
            spec: string,
        },
        cpu?: {
            qty: number,
            spec: string,
        }
        memory?: {
            qty: number,
            spec: string,
        }
        uploadSpeed?: {
            qty: number,
            spec: string,
        }
        downloadSpeed?: {
            qty: number,
            spec: string,
        }
        systemDisk?: {
            qty: number,
            spec: string,
        },
        dataDisk?: {
            qty: number,
            spec: string,
        },
        ipNum?: {
            qty: number,
            spec: string,
        },
        netNum?: {
            qty: number,
            spec: string,
        }
    }
}

const props = defineProps<{ id: number }>();
const productData = ref<ProductData | null>(null);

onMounted(async () => {
    productData.value = (await get(`/product/${props.id}`)).data;
    console.log(productData.value?.configRes);
});

const currentPrice = computed(() => {
    if (!productData.value) return '0.00'
    return productData.value.databaseInfo.price;
});

const mapper = {
    'area': {
        name: "区域",
        type: ''
    },
    'cpu': {
        name: "CPU",
        type: '核'
    },
    'memory': {
        name: "内存",
        type: 'MB'
    },
    'systemDisk': {
        name: "系统盘",
        type: 'G'
    },
    'networkType': {
        name: "网络类型",
        type: ''
    },
    'ipNum': {
        name: "IP数量",
        type: '个'
    },
    'netNum': {
        name: "NAT转发",
        type: '个'
    },
    'siteNum': {
        name: "共享建站",
        type: '个'
    },
    'dataDisk': {
        name: "数据盘",
        type: 'G'
    },
    'uploadSpeed': {
        name: "带宽",
        type: 'Mbps'
    },
    'downloadSpeed': {
        name: "流入带宽",
        type: 'Mbps'
    }
}
const agreements = computed(() =>[
    { id: 1, title: "物品描述确认", content: "我已确认界面描述的商品符合我的要求，不因商品与需求不符产生纠纷（实际收到商品与描述不符的除外）。" },
    { id: 2, title: "价格与支付", content: `我同意以当前商品价格人民币 ${currentPrice.value} 元进行交易，交易后不得以存在更低价商品/商品降价为由产生纠纷。` },
    { id: 3, title: "交付方式", content: "商品自动交付成功视为已收到货物，交易即刻完成。" },
    { id: 4, title: "免责条款", content: "商品描述部分由委托方填写，与本平台无关，请自行仔细鉴别，如发现被骗可联系平台客服。" },
    { id: 5, title: "协议生效", content: "本协议经双方勾选确认后立即生效。" }
]);
// 存储每条协议的勾选状态
const checkedItems = ref<boolean[]>(new Array(agreements.value.length).fill(false));

// 计算属性：是否全部勾选
const allChecked = computed(() => checkedItems.value.every(item => item));

const userStore = useUserStore();
const modal = useModal();
function buyObject() {
    function makeBuy() {

    }
    if (Number(userStore.$state.balance) <= Number(currentPrice)) {
        modal.create({
            title: `余额不足`,
            content: `余额不足，请先充值，如已充值请刷新界面。`,
            positiveText: '关闭',
            onPositiveClick: () => {
                modal.destroyAll();
            }
        });
    }
    else {    // 提交处理
        const handleSubmit = () => {
            if (allChecked.value) {
                alert("协议已生效！交易将继续进行");
            } else {
                alert("请先同意全部条款");
            }
        };

        modal.create({
            title: `购买`,
            preset: `card`,
            style: { width: '75vw' },
            content: () => (<div class="agreement-container">
                <p>您正在购买平台用户委托我方代出售的商品 {productData.value?.product.name}</p>
                <h2 class="title">购买协议确认书</h2>

                {/* 协议条款列表 */}
                <ul class="agreement-list">
                    {agreements.value.map((agreement, index) => (
                        <li class="agreement-item" key={agreement.id}>
                            <div class="flex-container">
                                <label class="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        checked={checkedItems.value[index]}
                                        onChange={() => checkedItems.value[index] = !checkedItems.value[index]}
                                        class="checkbox"
                                    />
                                    <span class={`checkmark ${checkedItems.value[index] ? 'checked' : ''}`}></span>
                                </label>
                                <div class="content">
                                    <h3>{agreement.title}</h3>
                                    <p>{agreement.content}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* 提交按钮 */}
                <NButton type='primary'
                    onClick={handleSubmit}
                    class={`submit-btn ${allChecked.value ? 'active' : 'disabled'}`}
                    disabled={!allChecked.value}
                >
                    确认协议并继续
                </NButton>
            </div>),
        });
    }
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
                                { id: 13, name: 'CPU', value: `${productData.configRes.cpu?.spec}核` },
                                { id: 14, name: '内存', value: `${parseInt(productData.configRes.memory!.spec) / 1024}G` },
                                { id: 15, name: '系统盘', value: '40G' },
                                { id: 17, name: '带宽', value: `${productData.configRes.uploadSpeed?.spec ?? productData.configRes.downloadSpeed?.spec}Mbps` },
                                { id: 18, name: '流入带宽', value: `${productData.configRes.downloadSpeed?.spec ?? productData.configRes.uploadSpeed?.spec}Mbps` },
                                { id: 19, name: 'IP数量', value: 0 }
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
                            <n-descriptions-item v-for="(value, key) in productData.configRes"
                                :label="mapper[key].name">
                                <n-tag type="success" size="large">{{ value!.qty === 0 ? value!.spec : value?.qty
                                    }} {{ mapper[key].type }}</n-tag>
                            </n-descriptions-item>

                            <n-descriptions-item label="状态">
                                <n-tag type="success" size="large">已激活</n-tag>
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
                        <n-button type="primary" size="large" @click="buyObject" block class="buy-button">
                            立即购买
                        </n-button>

                        <n-divider />

                        <div class="account-info">
                            <p><strong>登录信息</strong></p>
                            <p @click="showMessage">用户名: {{ productData.host_data.username }}</p>
                            <p @click="showMessage">密码: {{ productData.host_data.password }}</p>
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

<style>
/* 新增 Flex 容器 */
.flex-container {
    display: flex;
    /* 启用 Flex 布局 */
    align-items: flex-start;
    /* 顶部对齐（可选：center 居中对齐） */
    gap: 15px;
    /* 元素间距 */
}

.flex-container h3 {
    margin-top: 0px !important;
}

/* 可选：垂直居中方案（二选一） */
/* 方案1：顶部对齐（默认） */
.checkbox-wrapper {
    margin-top: 4px;
    /* 微调垂直位置 */
}
</style>