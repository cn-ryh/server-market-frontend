<template>
  <n-card title="余额提现">
    <n-form>
      <n-form-item label="提现金额" required>
        <n-input-number v-model:value="amount" placeholder="请输入提现金额" :min="1" :max="balance.available" :step="100">
          <template #suffix>元</template>
        </n-input-number>
        <n-input v-model:value="account" placeholder="请输入提现账户信息，请输入支付宝提现账号及姓名"></n-input>
      </n-form-item>

      <n-form-item label="预计到账">
        <n-tag type="info">{{ calculatedAmount }}元</n-tag>
        <span class="tip-text">(手续费: {{ fee }}元)</span>
      </n-form-item>

      <n-button type="primary" block @click="submitWithdraw" :loading="loading" :disabled="amount <= 0">
        申请提现
      </n-button>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NForm, NFormItem, NInputNumber, NButton, NTag, useMessage, NInput
} from 'naive-ui'

const props = defineProps<{
  balance: { available: number }
}>()

const emit = defineEmits(['withdraw'])
const message = useMessage()
const amount = ref(1);
const account = ref(``);
const loading = ref(false)

// 计算手续费和实际到账金额
const fee = computed(() => {
  return Number((amount.value > 0 ? amount.value * 0.02 : 0).toFixed(2));
})

const calculatedAmount = computed(() => {
  return Number((amount.value > 0 ? amount.value - fee.value : 0).toFixed(2));
})

const submitWithdraw = async () => {
  if (amount.value > props.balance.available) {
    message.error('提现金额超过可用余额')
    return
  }

  loading.value = true
  try {
    await emit('withdraw', amount.value, account.value)
    message.success('提现申请已提交')
    amount.value = 0
  } catch (error) {
    message.error('提现失败: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}
</script>