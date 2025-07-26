<template>
  <div class="min-h-screen bg-[#2F2F2F]">
      <Sidebar />
    <main class="pt-6 md:pl-6 pb-6 md:ml-[260px] ml-[50px]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>