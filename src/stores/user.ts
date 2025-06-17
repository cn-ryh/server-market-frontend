// src/stores/userStore.ts
import { defineStore } from 'pinia';
import type { UserInfo } from '../types';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    id: 0,
    username: ""
  }),
  actions: {
    async login() {
      const res = await axios.get(`/user_info`);
      if(res.data.status !== 200)
      {
        this.$reset();
      }
      else
      {
        console.log(res.data.user);
        this.$state = res.data.user;
      }
    }
  },
  getters: {
    value: (state) => state,
  },
  persist: true, // 开启状态持久化（默认 localStorage）
});