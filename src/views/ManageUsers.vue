<template>
  <div>
    <div class="flex w-[78vw] items-start justify-between">
        <div class="p-6 mb-2">
            <h2 class="text-3xl text-f7f7f7">Manage users</h2>
        </div>
        <SearchInput v-model="search" placeholder="Search..." class='mt-0' />
    </div>

    <div v-if="loading" class="py-10">
      <FullPageLoader />
    </div>

    <table v-else class="w-[93%] ml-6 table-auto border border-[#d4d4d4] rounded shadow text-[#f7f7f7] mt-10">
      <thead class="">
        <tr>
          <th class="p-3 text-left border-b border-[#d4d4d4]">Nome</th>
          <th class="p-3 text-left border-b border-[#d4d4d4]">Email</th>
          <th class="p-3 text-left border-b border-[#d4d4d4]">Admin</th>
          <th class="p-3 text-left border-b border-[#d4d4d4]">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
        >
          <td class="p-3 border-b border-[#d4d4d4]">{{ user.name }}</td>
          <td class="p-3 border-b border-[#d4d4d4]">{{ user.email }}</td>
          <td class="p-3 border-b border-[#d4d4d4]">
            <span
              :class="user.is_admin ? 'text-green-600 font-medium' : 'text-gray-500'"
            >
              {{ user.is_admin ? 'Yes' : 'No' }}
            </span>
          </td>
          <td class="p-3 border-b border-[#d4d4d4]">
          {{ user.email }}
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="flex justify-between items-center mt-6 text-[#525392] w-[93%] ml-6"
      v-if="lastPage > 1"
    >
      <button
        :disabled="currentPage === 1"
        @click="fetchUsers(currentPage - 1)"
        class="px-4 py-2 rounded bg-[#e4e4e4] hover:bg-[#dcdcdc] disabled:opacity-50"
      >
        Anterior
      </button>

      <span class="text-[#f7f7f7]">Página {{ currentPage }} de {{ lastPage }}</span>

      <button
        :disabled="currentPage === lastPage"
        @click="fetchUsers(currentPage + 1)"
        class="px-4 py-2 rounded bg-[#e4e4e4] hover:bg-[#dcdcdc] disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import FullPageLoader from '../components/FullPageLoader.vue'
import SearchInput from '../components/SearchInput.vue'

interface User {
  id: number
  name: string
  email: string
  is_admin: boolean
}

const users = ref<User[]>([])
const currentPage = ref(1)
const lastPage = ref(1)
const loading = ref(false)

async function fetchUsers(page = 1) {
  loading.value = true
  try {
    const response = await api.get(`/api/users-list?page=${page}`)
    users.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page

    console.log(response.data)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchUsers()
})
</script>
