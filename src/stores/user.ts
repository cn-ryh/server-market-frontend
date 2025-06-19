// src/stores/userStore.ts
import { defineStore } from 'pinia';
import type { UserInfo, Window } from '../types';
import axios from 'axios';
import { get } from '@/net/base';
declare const window: Window
export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    id: 0,
    username: ""
  }),
  actions: {
    async login() {
      try {
        const [res, res2] = await Promise.all([axios.get(`/user_info`), get(`/user/info`)]);
        console.log(res.data);
        if (res.data.status !== 200) {
          this.$state = {
            id: 0,
            username: ""
          };
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
      catch (e) {
        window.$message.error(`登录失效，请前往登录。`);
        this.$state = {
          id: 0,
          username: ""
        };
        console.log(this.$state);
        this.$reset();

      }
    }
  },
  getters: {
    value: (state) => {
      return {

      }
    },
  },
  persist: true, // 开启状态持久化（默认 localStorage）
});