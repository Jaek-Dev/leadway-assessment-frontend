<template>
    <div class="text-center text-xl font-normal p-4">Transactions</div>
    <div class="overflow-y-auto p-4 flex flex-col gap-6">
        <div class="text-center" v-if="!transactions.length">
            You have not performed any transaction. Your transactions will show here
        </div>
        <template v-else>
            <div class="flex gap-3 items-center" v-for="(item) in transactions" :key="item.id">
                <div class="flex-1 shrink-0 flex-col gap-1">
                    <div class="capitalize font-normal">
                        {{ item.receiverAccount.user.firstName }}
                        {{ item.receiverAccount.user.lastName }}
                    </div>
                    <div class="text-sm"
                        :class="{ 'text-red-600': item.type === 'Debit', 'text-green-600': item.type !== 'Debit' }">
                        {{ item.type === 'Debit' ? '-' : '+' }} N{{ Intl.NumberFormat().format(item.amount) }}
                    </div>
                </div>
                <div class="flex flex-col shrink-0 items-end gap-1">
                    <div :class="{
                        'bg-green-700 text-green-100': item.type === 'Credit',
                        'bg-red-700 text-red-100': item.type === 'Debit',
                        'bg-blue-700 text-blue-100': item.type === 'Top Up',
                    }" class="px-2.5 py-1 rounded-full text-[10px]">{{ item.type }}</div>
                    <small class="opacity-60">
                        {{ moment(item.createdAt).format('YYYY-MM-DD hh:mm a') }}
                    </small>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { axios } from '@/App.vue';
import { useUserStore } from '@/stores/user';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';

const notify = useToast();
const transactions = ref<any[]>([]);
const user = useUserStore();

onMounted(load)
async function load() {
    return axios.get('/transaction', { headers: { Authorization: `Bearer ${user.token}` } })
        .then(async (res) => {
            transactions.value = res.data;
        })
        .catch(e => {
            let message = 'Something went wrong';
            if (e.data && e.data.message) {
                const m = e.data.message;
                message = Array.isArray(m) ? m[0] : m
            } else if (e.message) {
                message = e.message
            }
            notify.error(message)
        })
}
</script>