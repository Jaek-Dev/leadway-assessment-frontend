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
                        <template v-if="getBadge(item) === 'Debit'">
                            {{ item.receiverAccount.user.firstName }}
                            {{ item.receiverAccount.user.lastName }}
                        </template>
                        <template v-else>
                            {{ item.senderAccount.user.firstName }}
                            {{ item.senderAccount.user.lastName }}
                        </template>
                    </div>
                    <div class="text-sm"
                        :class="{ 'text-red-600': getBadge(item) === 'Debit', 'text-green-600': getBadge(item) !== 'Debit' }">
                        {{ getBadge(item) === 'Debit' ? '-' : '+' }} N{{ Intl.NumberFormat().format(item.amount) }}
                    </div>
                </div>
                <div class="flex flex-col shrink-0 items-end gap-1">
                    <div :class="{
                        'bg-green-700 text-green-100': getBadge(item) === 'Credit',
                        'bg-red-700 text-red-100': getBadge(item) === 'Debit',
                        'bg-blue-700 text-blue-100': getBadge(item) === 'Top Up',
                    }" class="px-2.5 py-1 rounded-full text-[10px]">
                        {{ getBadge(item) }}
                    </div>
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

function getBadge(item: any) {
    switch (true) {
        case (item.senderAccount.user.id === user.profile?.id && item.type === 'Top Up') || (item.receiverAccount.user.id === user.profile?.id && item.type === 'Top Up'):
            return 'Top Up'
        case (item.senderAccount.user.id === user.profile?.id && item.type === 'Debit') || (item.receiverAccount.user.id === user.profile?.id && item.type === 'Credit'):
            return 'Debit'
        default: return 'Credit'
    }
}
</script>