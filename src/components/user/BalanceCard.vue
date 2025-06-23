<template>
    <n-card title="账户余额">
        <n-statistic label="总余额" :value="balance.total">
            <template #suffix>元</template>
        </n-statistic>
        <n-space vertical class="mt-4">
            <n-progress type="line" :percentage="(balance.available / balance.total) * 100" indicator-placement="inside"
                processing>
                <span>可用余额: {{ balance.available }}元</span>
            </n-progress>
            <n-tag type="warning" size="small">
                冻结金额: {{ balance.frozen }}元
            </n-tag>
        </n-space>
    </n-card>
</template>

<script setup lang="ts">
import { NCard, NStatistic, NProgress, NSpace, NTag } from 'naive-ui'
import type { BalanceData } from '@/types/balance'

defineProps<{
    balance: BalanceData
}>()
</script>