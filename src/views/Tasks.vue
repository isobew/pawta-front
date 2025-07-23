<template>
  <div class="flex w-[78vw] items-start justify-between">
    <div class="p-6 mb-2">
      <h2 class="text-3xl text-f7f7f7">Tasks</h2>
      <p class="text-md text-f7f7f7 mt-2" style="font-weight: 300;">Manage your tasks</p>
    </div>
    <SearchInput v-model="search" placeholder="Search..." />
  </div>

  <div v-if="isLoading" class="p-6">
    <FullPageLoader />
  </div>

  <div v-else class="p-6">
    <div v-if="isSearching">
      <h2 class="text-2xl text-f7f7f7 mb-7">Search Results</h2>
      <div v-if="searchResults.length">
        <div class="flex flex-wrap gap-7">
          <TaskCard
            v-for="board in searchResults"
            :key="board.id"
            :item="board"
            @edit="openEditModal"
            @delete="openDeleteModal"
            :showActions="true"  
            :isAdmin="userIsAdmin"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>

    <div v-else>
      <div class="flex w-[78vw] justify-end pr-12" v-if="userIsAdmin">
        <button id="auth-btn"
            @click="showCreateModal = true"
            class="min-h-[2.5em] min-w-[50px] text-dark font-bold text-lg rounded-full cursor-pointer mb-8">
            + Create task</button>
      </div>
      <div v-if="tasks.length">
        <div class="flex flex-wrap gap-4">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :item="task"
            @edit="openEditModal"
            @delete="openDeleteModal"
            :showActions="true"  
            :isAdmin="userIsAdmin"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>
  </div>

  <!-- Modais -->
  <TaskEditModal
    v-if="selectedTaskToEdit"
    :visible="showEditModal"
    :task="selectedTaskToEdit"
    @close="closeEditModal"
    @updated="handleTaskUpdated"
  />

  <TaskDeleteModal
    v-if="selectedTaskToDelete"
    :visible="showDeleteModal"
    :task="selectedTaskToDelete"
    @close="closeDeleteModal"
    @deleted="handleTaskDeleted"
  />

  <TaskCreateModal
    :visible="showCreateModal"
    @close="showCreateModal = false"
    @created="handleTaskCreated"
    :creator-id="user.id"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
import TaskCard from '../components/TaskCard.vue'
import SearchInput from '../components/SearchInput.vue'
import FullPageLoader from '../components/FullPageLoader.vue'
import TaskEditModal from '../components/TaskEditModal.vue'
import TaskDeleteModal from '../components/TaskDeleteModal.vue'
import TaskCreateModal from '../components/TaskCreateModal.vue'

// Simulação do usuário logado
const user = ref({ id: 1 })

const tasks = ref([])
const search = ref('')
const isSearching = ref(false)
const isLoading = ref(false)
const searchResults = ref([])
const userIsAdmin = ref(true)

const selectedTaskToEdit = ref(null)
const showEditModal = ref(false)

const selectedTaskToDelete = ref(null)
const showDeleteModal = ref(false)

const showCreateModal = ref(false)

const openEditModal = (task: any) => {
  selectedTaskToEdit.value = task
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedTaskToEdit.value = null
}

const openDeleteModal = (task: any) => {
  selectedTaskToDelete.value = task
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedTaskToDelete.value = null
}

const handleTaskUpdated = (updatedTask: any) => {
  const index = tasks.value.findIndex(b => b.id === updatedTask.id)
  if (index !== -1) {
    tasks.value[index] = updatedTask
  }
  if (isSearching.value) {
    const searchIndex = searchResults.value.findIndex(b => b.id === updatedTask.id)
    if (searchIndex !== -1) {
      searchResults.value[searchIndex] = updatedTask
    }
  }
  closeEditModal()
}

const handleTaskDeleted = (deletedTaskId: number) => {
  tasks.value = tasks.value.filter(b => b.id !== deletedTaskId)
  if (isSearching.value) {
    searchResults.value = searchResults.value.filter(b => b.id !== deletedTaskId)
  }
  closeDeleteModal()
}

const handleTaskCreated = (newTask: any) => {
  tasks.value.unshift(newTask)
  if (isSearching.value && search.value) {
    searchResults.value.unshift(newTask)
  }
  showCreateModal.value = false
}

onMounted(async () => {
  isLoading.value = true
  try {
    const tasksRes = await api.get('/api/tasks')
    tasks.value = tasksRes.data.data
  } catch (err) {
    console.error('Error loading tasks data', err)
  } finally {
    isLoading.value = false
  }
})

watch(search, async (value) => {
  if (!value) {
    isSearching.value = false
    return
  }

  isSearching.value = true
  isLoading.value = true

  try {
    const res = await api.get('/api/tasks', {
      params: { search: value }
    })
    searchResults.value = res.data.data || []
  } catch (err) {
    console.error('Error during search', err)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
})
</script>
