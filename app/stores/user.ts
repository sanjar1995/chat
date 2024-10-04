import { defineStore } from "pinia";
import type { IUserStore } from "~/types/userStore.type";

export const useUserStore = defineStore("user", {
  state: (): IUserStore => ({
    activeUser: null,
    selectedUser: null,
  }),
  actions: {},
  persist: {
    storage: persistedState.sessionStorage,
    key: "user-store",
  },
});
