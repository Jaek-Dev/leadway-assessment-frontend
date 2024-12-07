<template>
    <div class="text-center text-xl font-normal p-4">Transfer</div>
    <div class="overflow-y-auto p-4">
        <Form :validation-schema="schema" @submit="submit" v-slot="{ meta, isSubmitting }" class="space-y-4">
            <div>
                <Field type="text" name="accountNumber" :disabled="isSubmitting" validate-on-change
                    class="w-full p-3 border rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
                    placeholder="Account Number" required />
                <ErrorMessage name="accountNumber" class="text-red-600 text-sm" />
            </div>
            <div>
                <Field type="number" name="amount" :disabled="isSubmitting" validate-on-change
                    class="w-full p-3 border rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
                    placeholder="Amount" required />
                <ErrorMessage name="amount" class="text-red-600 text-sm" />
            </div>
            <button type="submit" :disabled="isSubmitting || !meta.valid"
                class="w-full bg-blue-600 text-white py-3 rounded-lg hover:[:not(:disabled)]:bg-blue-700 disabled:opacity-60 transition">
                {{ isSubmitting ? 'Please Wait...' : 'Send' }}
            </button>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { axios } from '@/App.vue';
import { useUserStore } from '@/stores/user';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { number, object, string } from 'yup';

const notify = useToast();
const user = useUserStore();
const router = useRouter();

const schema = object().shape({
    amount: number().required().min(100),
    accountNumber: string().required().length(10)
})

async function submit(data: any) {
    data.amount = Number(data.amount);
    return axios.post('/transaction/transfer', data, { headers: { Authorization: `Bearer ${user.token}` } })
        .then(async (res) => {
            notify.success(data.amount + ' transferred to ' + data.accountNumber + ' successful.')
            router.push({ name: 'transactions' })
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