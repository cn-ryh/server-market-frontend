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
    balance: "0",
    email: ""
  }),
  actions: {
    async login() {
      try {
        const [res, res2] = await Promise.all([axios.get(`/user_info`), get(`/user/info`)]);
        if (res.data.status !== 200) {
          console.log(1);
          this.$reset();
        }
        else {
          const obj: Record<string, any> = {};
          for (let key of Object.keys(res.data.user)) {
            obj[key] = res.data.user[key];
          }
          obj.balance = res2.balance;
          this.$patch(obj);
          console.log(`@` + this.$state);
          console.log(`??` + this.username);
        }
      }
      catch (e) {
        this.$state = {
          id: 0,
          username: ""
        };
        this.$reset();
      }
    }
  },
  getters: {
    // realname: (state) => {
    //   return state.certifi;
    // },
    // username: (state) => {
    //   console.log(`???@`);
    //   console.log(state);
    //   return state.username;
    // },
    // balance: (state) => {
    //   return state.balance;
    // },
    // email: (state) => {
    //   return state.email;
    // },
    // create_time: (state) => {
    //   return state.create_time;
    // }
  },
  persist: true, // 开启状态持久化（默认 localStorage）
});