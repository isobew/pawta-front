<template>
  <div>
    <div class="flex w-[78vw] md:flex-row flex-col items-start justify-between">
        <div class="p-6 mb-2">
            <h2 class="md:text-3xl text-md text-f7f7f7">Users</h2>
            <p class="text-md text-f7f7f7 mt-2" style="font-weight: 300;">Manage users</p>
        </div>
        <SearchInput v-model="search" placeholder="Search..." class='mt-0' />
    </div>

    <div v-if="loading" class="py-10">
      <FullPageLoader />
    </div>

    <section v-else>
      <table class="w-[93%] ml-6 table-auto border border-[#d4d4d4] rounded shadow text-[#f7f7f7]">
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
              <div class="w-full flex gap-4">
                <i
                  class='bx bxs-edit text-lg cursor-pointer hover:text-yellow-400'
                  @click="openEditModal(user)"
                ></i>
                <i
                  class='bx bxs-trash text-lg cursor-pointer hover:text-red-500'
                  @click="openDeleteModal(user)"
                ></i>
              </div>
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
          Prev
        </button>

        <span class="text-[#f7f7f7]">Page {{ currentPage }} de {{ lastPage }}</span>

        <button
          :disabled="currentPage === lastPage"
          @click="fetchUsers(currentPage + 1)"
          class="px-4 py-2 rounded bg-[#e4e4e4] hover:bg-[#dcdcdc] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  </div>

  <!-- Modais -->
  <UserEditModal
    v-if="selectedUserToEdit"
    :visible="showEditModal"
    :user="selectedUserToEdit"
    @close="closeEditModal"
    @updated="handleUserUpdated"
  />

  <UserDeleteModal
    v-if="selectedUserToDelete"
    :visible="showDeleteModal"
    :user="selectedUserToDelete"
    @close="closeDeleteModal"
    @deleted="handleUserDeleted"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
import FullPageLoader from '../components/FullPageLoader.vue'
import SearchInput from '../components/SearchInput.vue'
import UserEditModal from '../components/User/UserEditModal.vue'
import UserDeleteModal from '../components/User/UserDeleteModal.vue'

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
const search = ref('')

const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selectedUserToEdit = ref<User | null>(null)
const selectedUserToDelete = ref<User | null>(null)


function openEditModal(user: User) {
  selectedUserToEdit.value = user
  showEditModal.value = true
}

function closeEditModal() {
  selectedUserToEdit.value = null
  showEditModal.value = false
}

function openDeleteModal(user: User) {
  selectedUserToDelete.value = user
  showDeleteModal.value = true
}

function closeDeleteModal() {
  selectedUserToDelete.value = null
  showDeleteModal.value = false
}

function handleUserUpdated() {
  closeEditModal()
  fetchUsers(currentPage.value)
}

function handleUserDeleted() {
  closeDeleteModal()
  fetchUsers(currentPage.value)
}

async function fetchUsers(page = 1) {
  loading.value = true
  try {
    const response = await api.get('/api/users-list', {
      params: {
        page,
        search: search.value,
      },
    })
    users.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

watch(search, () => {
  fetchUsers(1)
})
</script>
