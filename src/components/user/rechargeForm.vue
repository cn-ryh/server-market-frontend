<template>
  <n-card title="账户充值">
    <n-form ref="formRef" :model="formData">
      <n-form-item label="充值金额" path="amount" required>
        <n-input-number v-model:value="formData.amount" placeholder="请输入充值金额" :min="1" :step="100" clearable>
          <template #suffix>元</template>
        </n-input-number>
      </n-form-item>

      <n-space vertical>
        <n-radio-group v-model:value="formData.channel">
          <n-space item-style="display: flex;">
            <n-radio value="alipay" label="支付宝" />
            <n-radio value="wechat" label="微信支付" />
            <n-radio value="bank" label="银行卡" />
          </n-space>
        </n-radio-group>

        <n-button type="primary" block @click="submitRecharge" :loading="loading">
          确认充值
        </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NForm, NFormItem, NInputNumber, NRadioGroup, NRadio,
  NSpace, NButton, useMessage
} from 'naive-ui'

const emit = defineEmits(['recharge'])
const message = useMessage()
const loading = ref(false)

const formData = ref({
  amount: null as number | null,
  channel: 'alipay'
})

const submitRecharge = async () => {
  if (!formData.value.amount || formData.value.amount <= 0) {
    message.error('请输入有效的充值金额')
    return
  }

  loading.value = true
  try {
    await emit('recharge', formData.value.amount)
    // message.success(`成功充值 ${formData.value.amount} 元`)
    formData.value.amount = null
  } catch (error) {
    message.error('充值失败: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}
</script>