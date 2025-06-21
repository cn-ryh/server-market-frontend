<template>
    <div class="container">
        <!-- 搜索和筛选区域 -->
        <n-card title="筛选条件" class="filter-card">
            <n-space vertical>
                <!-- 搜索框 -->
                <n-input v-model:value="searchKeyword" placeholder="输入商品名称搜索..." clearable @update:value="handleSearch">
                    <template #prefix>
                        <n-icon><search-icon /></n-icon>
                    </template>
                </n-input>

                <!-- 多选筛选 -->
                <n-grid :cols="4" :x-gap="24">
                    <n-gi>
                        <n-select v-model:value="priceRange" placeholder="价格范围" :options="priceOptions"
                            @update:value="handleFilterChange" />
                    </n-gi>
                    <n-gi>
                        <n-button type="primary" @click="resetFilters">重置筛选</n-button>
                    </n-gi>
                </n-grid>
            </n-space>
        </n-card>

        <!-- 商品列表 -->
        <div ref="scrollContainer" class="scroll-container">
            <n-grid :cols="3" :x-gap="24" :y-gap="24" :h-gap="24">
                <n-gi v-for="item of products" :key="item.id">
                    <product-card :product="item" @click="handleProductClick(item)" />
                </n-gi>
            </n-grid>
        </div>
        <!-- 无限滚动加载提示 -->
        <n-spin v-if="loading" class="load-more-spin">
            <template #description>正在加载...</template>
        </n-spin>
        <div v-if="noMoreData" class="no-more">没有更多商品了</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
    NInput,
    NSelect,
    NButton,
    NCard,
    NGrid,
    NGi,
    NSpace,
    NSpin,
    useMessage,
    NIcon
} from 'naive-ui';
import { SearchOutline as SearchIcon } from '@vicons/ionicons5';
import ProductCard from '@/components/productCard.vue';
import { Product } from '@/types/product';
import { post } from '@/net/base';
import { useRouter } from 'vue-router';
const router = useRouter();
// 数据状态
const products = ref<Product[]>([]);
const loading = ref(false);
const noMoreData = ref(false);
const pageSize = 20;
const currentPage = ref(1);
const scrollContainer = ref<HTMLElement | null>(null);

// 筛选条件
const searchKeyword = ref('');
const selectedCategories = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);
const priceRange = ref<string | null>(null);

const priceOptions = [
    { label: '0-100元', value: '0-100' },
    { label: '100-500元', value: '100-500' },
    { label: '500-1000元', value: '500-1000' },
    { label: '1000元以上', value: '1000+' }
];

// 响应式判断移动端
const isMobile = ref(window.innerWidth < 768);
const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
};

// 初始加载数据
const fetchProducts = async (page: number) => {
    if (noMoreData.value) return;

    loading.value = true;
    try {
        const response: any[] = (await post(`/product/list`, {
            page, pageSize
        })).data.products ?? {};
        if (page === 1) {
            products.value = response as any[];
        } else {
            products.value = [...products.value, ...response as any[]];
        }

        if ((response as any[]).length < pageSize) {
            noMoreData.value = true;
        } else {
            currentPage.value++;
        }
    } catch (error) {
        useMessage().error('加载商品失败');
    } finally {
        loading.value = false;
    }
};

// 处理筛选变化
const handleFilterChange = () => {
    resetPagination();
    fetchProducts(currentPage.value);
};

// 处理搜索
const handleSearch = () => {
    resetPagination();
    fetchProducts(currentPage.value);
};

// 重置筛选
const resetFilters = () => {
    searchKeyword.value = '';
    selectedCategories.value = [];
    selectedBrands.value = [];
    priceRange.value = null;
    resetPagination();
    fetchProducts(currentPage.value);
};

// 重置分页状态
const resetPagination = () => {
    currentPage.value = 1;
    noMoreData.value = false;
};

// 应用筛选条件
const filteredProducts = computed(() => {
    let result = [...products.value];

    // 关键词搜索 (名称和描述)
    if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        result = result.filter(p =>
            p.title.toLowerCase().includes(keyword) ||
            p.description.toLowerCase().includes(keyword)
        );
    }

    // 价格筛选
    if (priceRange.value) {
        const [min, max] = priceRange.value.split('-').map(Number);
        if (priceRange.value === '1000+') {
            result = result.filter(p => p.price >= 1000);
        } else {
            result = result.filter(p => p.price >= min && p.price < max);
        }
    }

    return result;
});

// 无限滚动处理
const handleScroll = () => {
    if (!scrollContainer.value || loading.value || noMoreData.value) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;
    if (scrollHeight - scrollTop - clientHeight < 50) {
        fetchProducts(currentPage.value);
    }
};

// 产品点击事件
const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
    // 这里可以添加导航到详情页的逻辑
    console.log('Selected product:', product);
};

// 生命周期钩子
onMounted(() => {
    fetchProducts(1);
    window.addEventListener('resize', handleResize);
    if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', handleScroll);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', handleScroll);
    }
});

</script>

<style scoped>
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.filter-card {
    margin-bottom: 24px;
}

.scroll-container {
    margin-top: 20px;
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 0 12px;
}

.load-more-spin,
.no-more {
    text-align: center;
    padding: 20px 0;
    color: #888;
}

@media (max-width: 768px) {
    .filter-card {
        padding: 16px;
    }

    .scroll-container {
        height: calc(100vh - 180px);
    }
}
</style>