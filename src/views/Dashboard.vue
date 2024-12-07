<template>
    <template v-if="user.token">
        <div class="flex flex-col">
            <div class="flex gap-2.5 p-4 items-center">
                <div class="h-16 w-16 rounded-full bg-slate-300 shadow-lg flex items-center justify-center ">
                    <div class="opacity-60 font-mono text-2xl tracking-widest font-semibold">
                        {{ initials }}
                    </div>
                </div>
                <div class="flex-1 shrink-0">
                    <div class="text-xl">{{ user.profile?.firstName }} {{ user.profile?.lastName }}</div>
                    <div class="text-sm">{{ user.profile?.emailAddress }}</div>
                </div>
                <button @click="() => $router.push({ name: 'logout' })"
                    class="rounded-lg bg-red-700 hover:bg-red-800 shrink-0 text-white px-2.5 py-1.5 text-sm">
                    Logout
                </button>
            </div>
            <div class="flex items-center gap-4 border-b p-4">
                <router-link active-class="active" exact-active-class="active"
                    :to="{ name: 'transactions' }">Transactions</router-link>
                <router-link active-class="active" exact-active-class="active"
                    :to="{ name: 'transfer' }">Transfer</router-link>
                <router-link active-class="active" exact-active-class="active" :to="{ name: 'topUp' }">Top
                    Up</router-link>
            </div>
        </div>
        <RouterView />
    </template>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const user = useUserStore();
const initials = computed(() => {
    const first = user.profile?.firstName.charAt(0);
    const second = user.profile?.lastName.charAt(0);
    return `${first}${second}`
});

defineOptions({
})
</script>

<style scoped lang="postcss">
a {
    @apply px-2.5 py-1.5 rounded-md
}

.active {
    @apply bg-green-400;
    @apply text-white;
}
</style>