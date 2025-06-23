// src/stores/userStore.ts
import { defineStore } from 'pinia';
import type { UserInfo, Window } from '../types';
import axios from 'axios';
import { get } from '@/net/base';
declare const window: Window
export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    id: 0,
    username: "",
    create_time: Date.now(),
    certifi: undefined,
    balance: "0.00",
    freezeBalance: "0.00",
    email: ""
  }),
  actions: {
    async login() {
      try {
        const [res, res2] = await Promise.all([axios.get(`/user_info`), get(`/user/info`)]);
        if (res.data.status !== 200) {
          localStorage.removeItem(`user`);
          this.$state = {
            id: 0,
            username: ""
          };
          this.$reset();
        }
        else {
          const obj: Record<string, any> = {};
          for (let key of Object.keys(res.data.user)) {
            obj[key] = res.data.user[key];
          }
          obj.balance = res2.data.balance;
          obj.freezeBalance = res2.data.freezeBalance;
          this.$patch(obj);
        }
      }
      catch (e) {
        localStorage.removeItem(`user`);
        this.$state = {
          id: 0,
          username: ""
        };
        this.$reset();
      }
    }
  },
  getters: {
  },
  persist: true, // 开启状态持久化（默认 localStorage）
});