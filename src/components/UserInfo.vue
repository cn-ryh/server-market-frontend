<template>
  <div>
    <div class="user-info-grid">
      <template v-if="loading">
        <div v-for="i in 8" :key="i" class="user-info-item">
          <NSkeleton :sharp="false" size="medium" />
        </div>
      </template>
      <template v-else>
        <div class="user-info-item">
          <div class="user-info-label">用户昵称</div>
          <div class="user-info-value">
            {{ userInfo.username }}
          </div>
        </div>

        <div class="user-info-item-right">
          <div class="user-info-label">实名认证</div>
          <div class="user-info-value">
            <NTag :type="userInfo.realname?.status === 1 ? 'success' : 'default'" size="small">
              {{ userInfo.realname?.status === 1 ? '已实名' : '未实名' }}
            </NTag>
          </div>
        </div>


        <div class="user-info-item-right">
          <div class="user-info-label">注册时间</div>
          <div class="user-info-value">{{ new Date(((userInfo.create_time) ?? (Date.now() / 1000)) *
            1000).toLocaleDateString() }}</div>
        </div>

        <div class="user-info-item">
          <div class="user-info-label">注册邮箱</div>
          <div class="user-info-value">{{ userInfo.email }}</div>
        </div>
      </template>

    </div>
    <br>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NTag, NSkeleton } from 'naive-ui'
import { useUserStore } from '@/stores/user';
const loading = ref(true);
const userStore = useUserStore();
console.log(userStore.username);
const userInfo = ref({
  email: userStore.email,
  username: userStore.username,
  realname: userStore.certifi,
  create_time: userStore.create_time,
  status: userStore.status,
});
onMounted(async () => {
  loading.value = false;
})
defineExpose({
  userInfo,
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/userInfo.scss';
</style>
