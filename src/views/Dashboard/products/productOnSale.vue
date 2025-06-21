<template>
    <div class="personal-product-container">
        <n-layout has-sider>
            <!-- 左侧商品列表 -->
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="0" :width="300" show-trigger="bar">
                <n-h2 class="list-header">我的商品</n-h2>
                <n-list hoverable clickable>
                    <n-list-item v-for="product in personalProducts" :key="product.id" @click="selectProduct(product)"
                        :class="{ 'selected-item': selectedProduct?.id === product.id }">
                        <n-thing :title="product.productname" content-style="margin-top: 10px;">
                            <template #description>
                                <n-space vertical>
                                    <n-text depth="3">ID:{{ product.id }}</n-text>
                                    <n-text depth="3">CPU:{{ product.cpu }} 内存:{{ product.memory }} 带宽:{{ product.bw
                                    }}</n-text>
                                </n-space>
                            </template>
                        </n-thing>
                    </n-list-item>
                </n-list>
            </n-layout-sider>

            <!-- 右侧商品详情和上架表单 -->
            <n-layout-content>
                <div v-if="selectedProduct" class="detail-container">
                    <n-h2>商品详情</n-h2>
                    <n-card>
                        <n-grid :cols="2" :x-gap="24" :y-gap="24">
                            <n-gi>
                                <n-thing title="基本信息">
                                    <template #description>
                                        <n-space vertical>
                                            <n-text>ID: {{ selectedProduct.id }}</n-text>
                                            <n-text>名称: {{ selectedProduct.productname }}</n-text>
                                        </n-space>
                                    </template>
                                </n-thing>
                            </n-gi>
                            <n-gi>
                                <n-thing title="配置信息">
                                    <template #description>
                                        <n-space vertical>
                                            <n-text>CPU: {{ selectedProduct.cpu }}</n-text>
                                            <n-text>内存: {{ selectedProduct.memory }}</n-text>
                                            <n-text>系统盘: {{ selectedProduct.system_disk_size }}</n-text>
                                            <n-text>数据盘: {{ selectedProduct.data_disk_size }}G</n-text>
                                        </n-space>
                                    </template>
                                </n-thing>
                            </n-gi>
                        </n-grid>
                    </n-card>

                    <n-divider />

                    <n-card title="上架商品">
                        <n-form ref="formRef" :model="listingForm" :rules="listingRules" label-placement="left"
                            label-width="auto">
                            <n-form-item label="价格" path="price">
                                <n-input-number @update:value="handlePriceInput" v-model:value="listingForm.price"
                                    placeholder="请输入价格" :min="0" :step="0.01" clearable :default-value="0" />
                            </n-form-item>
                            <n-form-item label="描述" path="description">
                                <n-input v-model:value="listingForm.description" type="textarea" placeholder="请输入商品描述"
                                    :autosize="{ minRows: 3 }" />
                            </n-form-item>
                            <n-button type="primary" @click="handleListProduct" :loading="isListing">
                                上架商品
                            </n-button>
                        </n-form>
                    </n-card>
                </div>
                <div v-else class="empty-state">
                    <n-empty description="请从左侧选择商品查看详情">
                        <template #extra>
                            <n-text depth="3">选择商品后可设置价格和描述进行上架</n-text>
                        </template>
                    </n-empty>
                </div>
            </n-layout-content>
        </n-layout>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import {
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NList,
    NListItem,
    NThing,
    NText,
    NH2,
    NSpace,
    NCard,
    NGrid,
    NGi,
    NDivider,
    NForm,
    NFormItem,
    NInputNumber,
    NInput,
    NButton,
    NEmpty,
    FormRules,
    FormInst,
    useMessage
} from 'naive-ui';
import axios from 'axios';
import { post } from '@/net/base';
import { useRouter } from 'vue-router';

// 商品类型定义
interface PersonalProduct {
    orderid: number;
    api_type: string;
    zjmf_api_id: number;
    id: number;
    domain: string;
    initiative_renew: number;
    domainstatus: string;
    regdate: number;
    dedicatedip: string;
    assignedips: string[];
    nextduedate: number;
    notes: string;
    nextinvoicedate: number;
    firstpaymentamount: string;
    amount: string;
    billingcycle: string;
    os: string;
    os_url: string;
    dcmid: number;
    productname: string;
    auth: any[];
    product_type: string;
    pid: number;
    pay_type: PayType;
    host_cancel: string;
    cycle_desc: string;
    domainstatus_desc: string;
    price_desc: string;
    area_code: string;
    area_name: string;
    area: string;
    cpu: string;
    memory: string;
    system_disk_size: string;
    network_type: string;
    bw: string;
    ip_num: string;
    data_disk_size: string;
    nat_acl_limit: string;
    nat_web_limit: string;
    invoice_id: number;
    options: Options;
}

interface PayType {
    pay_type: string;
    pay_hour_cycle: string;
    pay_day_cycle: string;
    pay_ontrial_status: number;
    pay_ontrial_cycle: string;
    pay_ontrial_num: string;
    pay_ontrial_condition: any[];
    pay_ontrial_cycle_type: string;
    pay_ontrial_num_rule: string;
    clientscount_rule: string;
}

interface Options {
    os: string;
    Memory: string;
    DiskSpace: string;
    CPU: string;
}

// 上架表单类型
interface ListingForm {
    price: number;
    description: string;
}

// 响应式数据
const personalProducts = ref<PersonalProduct[]>([]);
const selectedProduct = ref<PersonalProduct | null>(null);
const listingForm = ref<ListingForm>({
    price: 0,
    description: ''
});
const isListing = ref(false);
const formRef = ref<FormInst | null>(null);
const message = useMessage();
// 表单验证规则
const listingRules: FormRules = {
    price: [
        {
            required: true,
            validator(_, value: number | null) {
                // 自定义验证逻辑
                if (value === null || value === undefined || value === 0) {
                    return new Error('请输入价格');
                }
                if (value < 0.01) {
                    return new Error('价格必须大于0');
                }
                return true;
            },
            trigger: ['blur', 'input']
        },
        {
            type: 'number',
            min: 0.01,
            message: '价格必须大于0',
            trigger: ['blur', 'input']
        }
    ],
    description: []
};

// 获取个人商品列表
const fetchPersonalProducts = async () => {
    try {
        personalProducts.value = (await axios.get(`/host/list`)).data.data.list;
    } catch (error) {
        message.error('获取商品列表失败');
    }
};

// 选择商品
const selectProduct = async (product: PersonalProduct) => {
    selectedProduct.value = product;
    // 重置表单
    listingForm.value = {
        price: 0,
        description: ''
    };
    // 清除表单验证状态
    await nextTick();
    formRef.value?.restoreValidation();
};
// 添加输入处理函数
const handlePriceInput = (value: number | null) => {
    listingForm.value.price = value ?? 0;
    formRef.value?.validate(undefined, (rule) => {
        return rule?.key === 'price';
    });
};
const router = useRouter();
// 上架商品
const handleListProduct = async () => {
    if (!selectedProduct.value) return;
    try {
        await formRef.value?.validate();
        isListing.value = true;
        const res = await post(`/product/onsale`, {
            id: selectedProduct.value.id,
            price: listingForm.value.price,
            description: listingForm.value.description
        });
        if (res.code === 0) {
            message.success('上架成功');
            setTimeout(() => {
                router.push(`/product/${selectedProduct.value!.id}`);
            }, 2000);
        }
    } catch (errors) {
        console.error('表单验证失败', errors);
    }
    finally {
        isListing.value = false;
    }
};

// 组件挂载时获取数据
onMounted(() => {
    fetchPersonalProducts();
});
</script>

<style scoped>
.personal-product-container {
    height: calc(100vh - 64px);
}

.list-header {
    padding: 16px;
    margin-bottom: 0;
}

.selected-item {
    background-color: #f0f7ff;
    border-left: 3px solid #2080f0;
}

.detail-container {
    padding: 24px;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}
</style>