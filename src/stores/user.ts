// src/stores/userStore.ts
import { defineStore } from 'pinia';
import type { UserInfo } from '../types';
import axios from 'axios';
import { get } from '@/net/base';

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    id: 0,
    username: ""
  }),
  actions: {
    async login() {
      const [res, res2] = await Promise.all([axios.get(`/user_info`), get(`/user/info`)]);

      if (res.data.status !== 200) {
        this.$reset();
      }
      else {
        console.log(res.data.user);
        this.$state = {
          ...res.data.user,
          balance: res2.balance
        };
      }
    }
  },
  getters: {
    value: (state) => state,
  },
  persist: true, // 开启状态持久化（默认 localStorage）
});