<template>
  <n-card title="提现记录">
    <n-data-table
      :columns="columns"
      :data="records"
      :pagination="pagination"
      :loading="loading"
      striped
    />
  </n-card>
</template>

<script setup lang="tsx">
import { NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import type { WithdrawRecord } from '@/types/balance'
import { ref } from 'vue';

defineProps<{
  records: WithdrawRecord[]
}>();

const loading = ref(false);
const pagination = { pageSize: 10 };

// 状态标签颜色映射
const statusTagMap: Record<string, string> = {
  pending: 'warning',
  success: 'success',
  failed: 'error',
  processing: 'info'
};

const columns: DataTableColumns<WithdrawRecord> = [
  { title: '申请时间', key: 'date', width: 180 },
  { 
    title: '金额(元)', 
    key: 'amount',
    render: (row) => `${row.amount}元`
  },
  { 
    title: '手续费', 
    key: 'fee',
    render: (row) => `${row.fee}元`
  },
  { 
    title: '状态', 
    key: 'status',
    render: (row) => (
      <NTag type={statusTagMap[row.status] as any} size="small">
        { row.status === 'pending' ? '审核中' : 
           row.status === 'success' ? '成功' : 
           row.status === 'failed' ? '失败' : '处理中' }
      </NTag>
    )
  }
]
</script>