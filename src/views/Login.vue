<template>
    <div class="p-8 w-full h-full flex items-center justify-center flex-col">
        <div class="w-full">
            <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back</h1>
            <p class="text-gray-600 text-center mb-6">Please login to your account</p>
            <Form :validation-schema="schema" @submit="submit" v-slot="{ meta, isSubmitting }" class="space-y-4">
                <div>
                    <Field type="text" name="email" :disabled="isSubmitting" validate-on-change
                        class="w-full p-3 border rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
                        placeholder="Email Address" required />
                    <ErrorMessage name="email" class="text-red-600 text-sm" />
                </div>
                <div>
                    <Field type="password" name="password" :disabled="isSubmitting" validate-on-change
                        class="w-full p-3 border rounded-lg mt-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Password" required />
                    <ErrorMessage name="password" class="text-red-600 text-sm" />
                </div>
                <button type="submit" :disabled="isSubmitting || !meta.valid"
                    class="w-full bg-blue-600 text-white py-3 rounded-lg hover:[:not(:disabled)]:bg-blue-700 disabled:opacity-60 transition">
                    {{ isSubmitting ? 'Please Wait...' : 'Login' }}
                </button>
            </Form>

            <p class="text-center text-sm mt-6">
                Don’t have an account?
                <router-link :to="{ name: 'register' }" class="text-blue-500 hover:underline">
                    Sign up here
                </router-link>
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { axios, loadMyProfile, } from '@/App.vue';
import { useUserStore } from '@/stores/user';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { object, string } from 'yup';

const notify = useToast();
const user = useUserStore()
const router = useRouter()
const schema = object().shape({
    email: string().required().email(),
    password: string().required()
});

defineOptions({
    beforeRouteEnter() {
        const user = useUserStore();
        if (user.token) {
            return { name: 'dashboard' };
        }
    }
})

async function submit(data: any) {
    return axios.post('/auth/login', data)
        .then(async (res) => {
            sessionStorage.setItem('token', res.data.accessToken);
            await loadMyProfile(res.data.accessToken).then(data => {
                user.setProfile(data);
                user.setToken(res.data.accessToken);
            })
            await router.push({ name: 'transactions' });
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