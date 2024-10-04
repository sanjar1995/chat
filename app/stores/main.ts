import { defineStore } from "pinia";
import type { IMainStore, IMessage } from "~/types/mainStore.type";

export const useMainStore = defineStore("main", {
  state: (): IMainStore => ({
    users: [
      {
        id: 1,
        name: "Денис Дорохов",
        chat: {
          2: [],
          3: [],
          4: [],
        },
      },
      {
        id: 2,
        name: "Азамат Мусагалиев",
        chat: {
          1: [],
          3: [],
          4: [],
        },
      },
      {
        id: 3,
        name: "Сергей Бурунов",
        chat: {
          1: [],
          2: [],
          4: [],
        },
      },
      {
        id: 4,
        name: "Гарик Харламов",
        chat: {
          1: [],
          2: [],
          3: [],
        },
      },
    ],
  }),
  actions: {
    updateUserChat(userId: number, chatPartnerId: number, chat: IMessage[]) {
      const user = this.users.find((user) => user.id === userId);
      if (user) {
        user.chat[chatPartnerId] = chat;
      }
    },
  },
  persist: {
    storage: persistedState.localStorage,
    key: "main-store",
  },
});
