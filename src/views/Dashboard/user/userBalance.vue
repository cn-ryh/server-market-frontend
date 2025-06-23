<template>
    <n-layout>
        <n-layout-header bordered>
            <n-h1>账户余额管理</n-h1>
        </n-layout-header>

        <n-layout-content content-style="padding: 24px;">
            <n-grid cols="1 600:2" x-gap="24" y-gap="24">
                <!-- 左侧卡片组 -->
                <n-gi>
                    <BalanceCard :balance="balance" />
                    <RechargeForm @recharge="handleRecharge" class="mt-6" />
                </n-gi>

                <!-- 右侧卡片组 -->
                <n-gi>
                    <WithdrawForm :balance="balance" @withdraw="handleWithdraw" />
                    <WithdrawHistory :records="withdrawRecords" class="mt-6" />

                    <n-card title="交易记录" class="mt-6">
                        <n-button @click="navigateToOrders">查看完整交易记录</n-button>
                    </n-card>
                </n-gi>
            </n-grid>
        </n-layout-content>
    </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NLayout, NLayoutHeader, NLayoutContent, NH1, NGrid, NGi, NCard, NButton } from 'naive-ui'
import BalanceCard from '@/components/user/BalanceCard.vue'
import RechargeForm from '@/components/user/rechargeForm.vue'
import WithdrawForm from '@/components/user/withdrawForm.vue'
import WithdrawHistory from '@/components/user/withdarwHistory.vue'
// import { fetchBalance, rechargeBalance, withdrawBalance, fetchWithdrawHistory } from '@/api/balanceApi'
import type { BalanceData, WithdrawRecord } from '@/types/balance'
import { useUserStore } from '@/stores/user'
import { post } from '@/net/base'
const userStore = useUserStore();
const router = useRouter();
const balance = ref<BalanceData>({ total: 0, available: 0, frozen: 0 });
const withdrawRecords = ref<WithdrawRecord[]>([]);

// 加载数据
onMounted(async () => {
    balance.value = {
        total: Number(userStore.balance!),
        available: Number(userStore.balance!),
        frozen: Number(userStore.freezeBalance!)
    };
    withdrawRecords.value = await fetchWithdrawHistory()
})

// 充值处理
const handleRecharge = async (_amount: number) => {
    window.alert(`联系 QQ: 3373428471 充值`);
}

// 提现处理
const handleWithdraw = async (amount: number, account: string) => {
    await post(`/user/withdraw`, { amount, account });
}

// 跳转交易记录
const navigateToOrders = () => {
    router.push('/order/list')
}
</script>