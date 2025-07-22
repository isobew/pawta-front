<template>
    <div class="fixed left-0 top-0 h-screen w-16 bg-[#723046] flex flex-col items-center py-4 space-y-6 shadow-md">
      <!-- Quadro de Tarefas -->
      <div class="group relative cursor-pointer">
        <router-link to="/board" class="flex flex-col items-center text-white hover:text-gray-200">
          <i class='bx bxs-dashboard text-2xl'></i>
          <span
            class="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Quadro de Tarefas
          </span>
        </router-link>
      </div>
  
      <!-- Relatório de Tarefas -->
      <div class="group relative cursor-pointer">
        <router-link to="/report" class="flex flex-col items-center text-white hover:text-gray-200">
          <i class='bx bxs-report text-2xl'></i>
          <span
            class="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Relatório de Tarefas
          </span>
        </router-link>
      </div>

      <!-- logout -->
      <div class="group relative cursor-pointer mt-auto">
        <button id="logout-btn" @click="logout" class="flex flex-col items-center text-white hover:text-gray-200">
            <i class='bx bxs-exit text-2xl'></i>
          <span
            class="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Logout
          </span>
        </button @click="logout">
      </div>
    </div>
  </template>

<script lang="ts" setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const logout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

