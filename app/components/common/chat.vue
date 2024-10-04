<script setup lang="ts">
import { useMainStore } from "~/stores/main";
import { useUserStore } from "~/stores/user";
import type { IUser, IMessage } from "~/types/mainStore.type";

const mainStore = useMainStore();
const userStore = useUserStore();
const users = computed(() => mainStore.users);
const activeUser:any = computed(() => userStore.activeUser);
const selectedUser:any = computed(() => userStore.selectedUser);

const activeUserData:any = computed(() =>
  users.value.find((item) => item.id === activeUser.value)
);
const selectedUserData:any = computed(() =>
  users.value.find((item) => item.id === selectedUser.value)
);

const selectChat = (id: number) => {
  userStore.selectedUser = id;
};

const messages = computed(() => {
  if (!activeUserData.value || !selectedUserData.value) {
    return [];
  }

  const messagesFromActiveUser =
    activeUserData.value.chat[selectedUser.value] || [];
  const messagesFromSelectedUser =
    selectedUserData.value.chat[activeUser.value] || [];

  const combinedMessages = [
    ...messagesFromSelectedUser.map((msg:any) => ({
      ...msg,
      senderId: selectedUser.value,
    })),
    ...messagesFromActiveUser.map((msg:any) => ({
      ...msg,
      senderId: activeUser.value,
    })),
  ];

  return combinedMessages;
});

const sortedMessages = computed(() =>
  messages.value.sort((a, b) => a.id - b.id)
);

const newMessageText = ref("");

const sendMessage = () => {
  if (!newMessageText.value.trim()) {
    return; 
  }

  const allMessages = [
    ...(activeUserData.value.chat[selectedUser.value] || []),
    ...(selectedUserData.value.chat[activeUser.value] || []),
  ];

  const newMessageId =
    allMessages.reduce((maxId, message) => Math.max(maxId, message.id), 0) + 1;

  const newMessage: IMessage = {
    id: newMessageId,
    text: newMessageText.value,
  };

  if (activeUserData.value) {
    const chat = activeUserData.value.chat[selectedUser.value] || [];
    chat.push({ ...newMessage, senderId: activeUser.value });
    mainStore.updateUserChat(activeUserData.value.id, selectedUser.value, chat);
  }

  if (selectedUserData.value) {
    const chat = selectedUserData.value.chat[activeUserData.value] || [];
    chat.push({ ...newMessage, senderId: activeUser.value });
    mainStore.updateUserChat(
      selectedUserData.value.id,
      activeUserData.value,
      chat
    );
  }

  newMessageText.value = "";
};

const syncStateWithLocalStorage = () => {
  const storedState = localStorage.getItem("main-store");
  if (storedState) {
    try {
      const parsedState = JSON.parse(storedState);
      mainStore.$state = parsedState;
    } catch (error) {
      console.error("Ошибка при парсинге состояния из localStorage:", error);
    }
  }
};

onMounted(() => {
  window.addEventListener("storage", (event) => {
    if (event.key === "pinia-state") {
      syncStateWithLocalStorage();
    }
  });
  watchEffect(() => {
    localStorage.setItem("pinia-state", JSON.stringify(mainStore.$state));
  });
});

</script>
<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div
      class="h-[600px] flex flex-col items-start justify-center rounded-md overflow-hidden"
    >
      <div class="w-full h-16 bg-zinc-700 flex items-center gap-2 px-2">
        <div
          class="w-12 h-12 bg-primary-color flex items-center justify-center rounded"
        >
          <IconUser class="text-white w-10 h-10" />
        </div>
        <p class="text-16-semi text-white">
          {{ activeUserData ? activeUserData.name : "Не найден" }}
        </p>
      </div>

      <div class="flex h-full">
        <div
          class="w-24 h-full flex flex-col items-center gap-7 bg-dark-gunmental-color border-r border-primary-color"
        >
          <div class="h-full flex flex-col items-center gap-7 pt-6">
            <template v-for="user in users" :key="user.id">
              <button
                v-if="user.id != activeUser"
                @click="selectChat(user.id)"
                class="flex flex-col items-center p-1 rounded hover:bg-gray-75-color"
              >
                <div
                  class="w-8 h-8 rounded-md G bg-primary-color flex items-center justify-center mb-2"
                >
                  <IconUser class="text-white" />
                </div>
                <p
                  class="w-20 text-14-med text-white whitespace-nowrap text-ellipsis overflow-hidden"
                  title="Азамат Мусагалиев"
                >
                  {{ user.name }}
                </p>
              </button>
            </template>
          </div>
          <button class="w-full h-10 bg-zinc-600">
            <span class="text-16-med text-white">Выйти</span>
          </button>
        </div>
        <div
          class="w-[300px] h-full bg-dark-gunmental-color flex flex-col justify-start"
        >
          <div
            class="w-full h-16 bg-primary-color flex items-center gap-2 px-2"
          >
            <template v-if="selectedUserData">
              <div
                class="w-12 h-12 bg-zinc-600 flex items-center justify-center rounded"
              >
                <IconUser class="text-white w-10 h-10" />
              </div>
              <p class="text-16-semi text-white">
                {{ selectedUserData.name }}
              </p>
            </template>
            <span v-if="!selectedUserData"
              >Выберите пользователя для общение</span
            >
          </div>
          <div class="w-full flex-grow">
            <div v-if="messages.length > 0" class="p-2 flex flex-col gap-3 overflow-y-auto h-[430px]">
              <div class="bg-lime-400 rounded-lg w-[80%] px-4 py-1 message"
                v-for="(message, index) in sortedMessages"
                :key="message.id"
                :class="{
                  'message-sent': message.senderId === activeUser,
                  'message-received': message.senderId !== activeUser,
                }"
              >
                <p>{{ message.text }}</p>
              </div>
            </div>
            <div v-else>
              <p>Сообщений нет</p>
            </div>
          </div>
          <div class="bg-zinc-700 flex items-center justify-between px-1 py-2">
            <input
              v-model="newMessageText"
              type="text"
              class="w-full h-9 bg-transparent outline-none text-white text-16-med"
              placeholder="Введите сообщение"
            />
            <IconSend
              class="text-primary-color w-8 h-8 cursor-pointer"
              @click="sendMessage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
