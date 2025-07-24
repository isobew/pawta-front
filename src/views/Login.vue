<script lang="ts" setup>
    import { ref } from 'vue';
    import { useAuthStore } from '../stores/auth';
    import { useRouter } from 'vue-router';
    import { useToast } from 'vue-toast-notification';
    import Cookies from 'js-cookie';

    const email = ref('');
    const password = ref('');
    const auth = useAuthStore();
    const router = useRouter();
    const $toast = useToast();

    async function submit() {
        try {
            await auth.login({ email: email.value, password: password.value });
            router.push('/dashboard');
        } catch (error) {
            const msg = error.response?.data?.message || 'Erro no login. Tente novamente.';
            $toast.error(msg);
            Cookies.remove('XSRF-TOKEN');
            Cookies.remove('pawta_session');
        }
    }
</script>


<template>
  <div class="container mx-auto form-container">
    <div class="flex items-center gap-2 mb-4">
        <i class='bx bxs-cat text-4xl'></i>
        <h1 class="title-form">Welcome to Pawta!</h1>
    </div>
    <form @submit.prevent="submit" class="my-5 w-full flex flex-col items-center">
      <div class="relative">
        <i class="bx bx-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-xl"></i>
        <input
            v-model="email"
            type="email"
            placeholder="E-mail"
            class="input-form my-4 focus:outline-none"
            required
        />
      </div>

      <div class="relative">
        <i class="bx bx-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-xl"></i>
        <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="input-form focus:outline-none"
            required
        />
      </div>
      <button type="submit" id="auth-btn"
      class="min-h-[2.5em] mt-10 min-w-[50px] text-dark font-bold text-lg rounded-full cursor-pointer mt-5">
      LOGIN</button>
    </form>
    <p class="mt-5 pt-5 text-sm">
      Ainda não tem conta?
      <a href="/register" class="font-bold">Cadastre-se</a>
    </p>
  </div>
</template>
