<template>
  <div class="min-h-screen bg-[#2F2F2F]">
      <Sidebar />
    <main class="pt-6 pl-6 pb-6 ml-[260px]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>