<template>
  <n-card :title="product.title" hoverable>
    <n-grid style="width: 90%;margin-left: 5%" :cols="2" :x-gap="12" :y-gap="24">
      <n-gi>
        <div class="product_info_cell">
          <center>
            <span class="product_info_title">CPU</span>
            <div style="height:5px"></div>
            <span class="product_info_value">{{ product.cpu }}核</span>
          </center>
        </div>
      </n-gi>
      <n-gi>
        <div class="product_info_cell">
          <center>
            <span class="product_info_title">内存</span>
            <div style="height:5px"></div>
            <span class="product_info_value">{{ Number(product.memory) / 1024 }}G</span>
          </center>
        </div>
      </n-gi>
      <n-gi>
        <div class="product_info_cell">
          <center>
            <span class="product_info_title">系统盘</span>
            <div style="height:5px"></div>
            <span class="product_info_value">{{ product.systemDisk }}G</span>
          </center>
        </div>
      </n-gi>
      <n-gi>
        <div class="product_info_cell">
          <center>
            <span class="product_info_title">数据盘</span>
            <div style="height:5px"></div>
            <span class="product_info_value">{{ product.dataDisk }}G</span>
          </center>
        </div>
      </n-gi>
      <n-gi>
        <div class="product_info_cell">
          <center>
            <span class="product_info_title">上传带宽</span>
            <div style="height:5px"></div>
            <span class="product_info_value">{{ product.uploadSpeed }}</span>
          </center>
        </div>
      </n-gi>
      <n-gi>
        <div class="product_info_cell">
          <center>
            <span class="product_info_title">下行带宽</span>
            <div style="height:5px"></div>
            <span class="product_info_value">{{ product.downloadSpeed == '-' ? product.uploadSpeed :
              product.downloadSpeed
              }}</span>
          </center>
        </div>
      </n-gi>

    </n-grid>
    <center>
      <div class="product_price">￥{{ product.price }}</div>
    </center>
    <template #action>
      <n-button type="primary" block @click.stop="$emit('click', product)">查看详情</n-button>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { ProductListItem } from '@/types/product';
import { NCard, NButton, NGi, NGrid } from 'naive-ui';

defineProps<{
  product: ProductListItem
}>();

defineEmits(['click']);
</script>

<style scoped>
.description {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.n-card {
  margin-bottom: 24px;
  transition: transform 0.2s;
}

.n-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.product_info_cell {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(210, 201, 201, 0.5);
  padding: 8px;
  border-radius: 10px;
}

.product_info_title {
  font-weight: bold;
  margin-bottom: 3px;
}

.product_price {
  font-size: 1.5rem;
  font-weight: bolder;
  color: #ff6600;
  /* 设置价格字体颜色 */
  margin-top: 10px;
}
</style>