<template>
  <div class="home">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      欢迎回来, {{ nickname }}
    </div>

    <!-- 用户卡片 -->
    <div class="content-info">
      <n-card :loading="loading" class="user-card">
        <n-space>
          <div class="user-card-avatar">
            <img style="margin-top: 1px; height: 64px; border-radius: 64px; transform: scale(1.2);"
              src="https://www.loliapi.com/acg/pp/" alt="用户头像" />
          </div>
          <div style="margin-left: 16px; text-align: left; margin-top: 5px;">
            <h3 style="margin: 0px;">{{ forTime }}，{{ nickname }}</h3>
            <n-skeleton style="margin: 8px 0px 0px; width: 500px;" v-if="loading" />
          </div>
        </n-space>
      </n-card>
    </div>

    <!-- 统计卡片 -->
    <div style="margin-top: 20px;">
      <Traffic />
    </div>

    <!-- 内容面板 -->
    <div style="margin-top: 20px;" class="content-grid">
      <div class="left-column">
        <!-- 用户信息卡片 -->
        <NCard title="用户信息" class="info-card">
          <NAlert v-if="isRealname === false" type="warning" title="未实名认证" style="margin-bottom: 16px">
            您的账户尚未完成实名认证, 请尽快完成实名认证。
            <br>
            <NButton text type="primary" @click="goToRealname">立即前往</NButton>
          </NAlert>
          <UserInfo ref="userInfoRef" />
        </NCard>
      </div>

      <!-- 通知卡片 -->
      <NCard title="通知内容" class="notice-card">
        <div class="markdown-content" v-html="renderedNotice" />
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NAlert, NButton } from 'naive-ui'
import { ref, onMounted, computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

import UserInfo from "@/components/UserInfo.vue"
import { get } from '@/net/base'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore();
console.log(userStore.username);
const notices = ref('');
const nickname = userStore.username!;

// 用户信息引用
const userInfoRef = ref<{ userInfo: { isRealname: boolean; avatar: string; signRemainder: number; } } | null>(null)

// 一言和流量数据
const loading = ref(false)

// 现在几点
const forTime = computed(() => {
  const date = new Date()
  const hours = date.getHours()
  if (hours < 6) {
    return '凌晨好'
  } else if (hours < 12) {
    return '早上好'
  } else if (hours < 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
})


// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true
})


// 渲染通知
const renderedNotice = computed(() => {
  if (!notices.value) return ''
  try {
    const html = marked.parse(notices.value) as string
    return DOMPurify.sanitize(html)
  } catch {
    return ''
  }
})
// 获取通知
const fetchNotice = async (): Promise<void> => {
  notices.value = (await get(`/notice`)).data;
}
const isRealname = ref(userStore.certifi?.status === 1);
const goToRealname = () => { window.location.href = `/` }
// 页面挂载后执行
onMounted(() => {
  fetchNotice();

})
</script>

<style lang="scss" scoped>
@use '../../assets/styles/home.scss';
</style>