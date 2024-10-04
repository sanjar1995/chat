<script setup lang="ts">
import { useMainStore } from "~/stores/main";
import { useUserStore } from "~/stores/user";

const mainStore = useMainStore();
const userStore = useUserStore();
const router = useRouter();
const users = computed(() => mainStore.users);
const selectUser = (id: number) => {
  userStore.activeUser = id;
  router.push("/chat");
};
</script>
<template>
  <div class="w-full h-screen flex flex-col items-center justify-center">
    <h4 class="text-32-med text-primary-color mb-4">Выберите ваш аккаунт:</h4>
    <div class="flex items-center justify-center gap-3">
      <div
        v-for="user in users"
        :key="user.id"
        @click="selectUser(user.id)"
        class="w-max px-2 h-14 bg-dark-onix-color flex items-center justify-center gap-4 rounded-md cursor-pointer"
      >
        <div
          class="w-11 h-11 bg-primary-color rounded-md flex items-center justify-center"
        >
          <IconUser class="text-white" />
        </div>
        <p class="text-24-reg text-white">{{ user.name }}</p>
      </div>
    </div>
  </div>
</template>
<style></style>
