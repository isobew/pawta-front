<template>
  <div
    :class="[
      'h-screen fixed left-0 top-0 bg-[#202020] flex flex-col justify-between py-4 text-[#f7f7f7] p-6 space-y-6 shadow-md transition-all duration-300',
      isMobile ? 'w-[70px]' : 'w-[250px]'
    ]"
  >
    <div>
      <div class="flex flex-col mb-14 mt-3">
        <div class="flex items-center gap-2">
          <i class="bx bxs-cat text-2xl"></i>
          <h2 class="text-xl" v-if="!isMobile">PAWTA</h2>
        </div>
        <p
          class="text-sm font-semibold text-[#f7f7f7] uppercase tracking-widest mb-4 ml-8"
          v-if="!isMobile"
        >
          Menu
        </p>
      </div>

      <ul class="space-y-11">
        <li class="flex items-center gap-3 cursor-pointer hover:text-[#525392]">
          <RouterLink to="/dashboard" class="flex items-center gap-3 w-full" title="Dashboard">
            <i class="bx bxs-dashboard text-lg"></i>
            <span v-if="!isMobile">Dashboard</span>
          </RouterLink>
        </li>
        <li class="flex items-center gap-3 cursor-pointer hover:text-[#525392]">
          <RouterLink to="/boards" class="flex items-center gap-3 w-full" title="Boards">
            <i class="bx bx-task text-lg"></i>
            <span v-if="!isMobile">Boards</span>
          </RouterLink>
        </li>
        <li class="flex items-center gap-3 cursor-pointer hover:text-[#525392]">
          <RouterLink to="/tasks" class="flex items-center gap-3 w-full" title="All tasks">
            <i class="bx bx-book-content text-lg"></i>
            <span v-if="!isMobile">All tasks</span>
          </RouterLink>
        </li>
        <li
          class="flex items-center gap-3 cursor-pointer hover:text-[#525392]"
          v-if="isAdmin"
        >
          <RouterLink
            to="/manage-users"
            class="flex items-center gap-3 w-full"
            title="Manage users"
          >
            <i class="bx bx-user text-lg"></i>
            <span v-if="!isMobile">Manage users</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div>
      <!-- Profile -->
      <div class="flex items-center gap-3 mb-6">
        <img
          src="../assets/image.png"
          alt="avatar"
          class="w-[30px] h-[30px] rounded-full object-cover"
        />
        <div v-if="!isMobile">
          <router-link
            :to="`/profile`"
            class="text-sm cursor-pointer hover:text-[#525392]"
            title="Profile"
          >
            {{ userName }}
          </router-link>
          <div class="text-xs text-gray-400" v-if="isAdmin">ADMIN</div>
        </div>
      </div>

      <!-- Logout -->
      <div
        class="flex items-center gap-3 md:bg-[#525392] md:p-3 rounded-lg cursor-pointer hover:opacity-90"
        @click="logout"
        :title="isMobile ? 'Logout' : ''"
      >
        <i class="bx bx-log-out text-lg"></i>
        <span v-if="!isMobile" class="text-sm font-semibold">Logout</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const auth = useAuthStore()
const userName = ref('User')

const isAdmin = computed(() => auth.user?.is_admin == true)

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  try {
    const res = await api.get('/api/user')
    userName.value = res.data.name || 'User'
  } catch (err) {
    console.warn('Error:', err)
  }
})

watch(() => window.innerWidth, handleResize)

const logout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
