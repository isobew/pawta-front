<template>
  <div class="w-[250px] h-screen fixed left-0 top-0 bg-[#202020] flex flex-col justify-between py-4 text-[#f7f7f7] p-6 space-y-6 shadow-md">
    <div>
      <div class="flex flex-col mb-14 mt-3">
        <div class="flex items-center gap-2">
          <i class="bx bxs-cat text-2xl"></i>
          <h2 class="text-xl">PAWTA</h2>
        </div>
        <p class="text-sm font-semibold text-[#f7f7f7] uppercase tracking-widest mb-4 ml-8">Menu</p>
      </div>

      <ul class="space-y-11">
        <li class="flex items-center gap-3 cursor-pointer hover:text-[#525392]">
          <i class="bx bxs-dashboard text-lg"></i>
          <span>Dashboard</span>
        </li>
        <li class="flex items-center gap-3 cursor-pointer hover:text-[#525392]">
          <i class="bx bx-task text-lg"></i>
          <span>Boards</span>
        </li>
        <li class="flex items-center gap-3 cursor-pointer hover:text-[#525392]">
          <i class="bx bx-book-content text-lg"></i>
          <span>All tasks</span>
        </li>
      </ul>
    </div>

    <div>
      <!-- Perfil -->
      <div class="flex items-center gap-3 mb-6">
        <img
          src="../assets/image.png"
          alt="avatar"
          class="w-[30px] h-[30px] rounded-full object-cover"
        />
        <span class="text-sm">{{ userName }}</span>
      </div>

      <!-- Logout -->
      <div class="flex items-center gap-3 bg-[#525392] p-3 rounded-lg cursor-pointer hover:opacity-90" @click="logout">
        <i class="bx bx-log-out text-lg"></i>
        <span class="text-sm font-semibold">Logout</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const auth = useAuthStore()
const userName = ref('User')

const logout = async () => {
  await auth.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    const res = await api.get('/api/user')
    userName.value = res.data.name || 'User'
  } catch (err) {
    console.warn('Error:', err)
  }
})
</script>
