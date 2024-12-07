<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import instance, { AxiosError, type AxiosStatic } from 'axios';
import { useUserStore } from './stores/user';
defineOptions({
  async beforeCreate() {
    const user = useUserStore();
    const token = sessionStorage.getItem('token');
    if (token) {
      await loadMyProfile(token).then(data => {
        user.setProfile(data);
        user.setToken(token);
      })
    }
  }
})
</script>

<template>
  <RouterView />
</template>

<script lang="ts">
const i = instance.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    Accept: 'application/json',
    "Content-Type": 'application/json',
  }
});
i.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response)
);
export const axios = i;
export async function loadMyProfile(jwt: string) {
  return await axios.get('/user', { headers: { Authorization: `Bearer ${jwt}` } }).then((r) => r.data)
}
</script>

<style>
.active {
  @apply text-purple-400
}
</style>