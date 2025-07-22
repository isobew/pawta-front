<template>
  <div>
    <h1>Bem-vindo, {{ auth.user?.name }}</h1>
    <!-- Aqui lista as tasks etc -->
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
</script>
