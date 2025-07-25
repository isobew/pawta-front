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
            v-for="task in searchResults"
            :key="task.id"
            :item="task"
            @edit="openEditModal"
            @delete="openDeleteModal"
            :showActions="true"  
            :isAdmin="userIsAdmin"
            @click="openModal(task)"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>

    <div v-else>
      <div class="flex w-[78vw] justify-between pr-12">
        <button id="auth-btn"
            v-if="userIsAdmin"
            @click="showCreateModal = true"
            class="min-h-[2.5em] min-w-[50px] text-dark font-bold text-lg rounded-full cursor-pointer mb-8">
            + Create task</button>
        <button id="auth-btn"
            @click="exportTasks"
            class="min-h-[2.5em] min-w-[156px] text-dark font-bold text-sm rounded-full cursor-pointer mb-8"
        >
          > Export CSV
        </button>
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
            @click="openModal(task)"
          />
        </div>

        <div
          class="flex justify-between items-center mt-6 text-[#525392] w-[96%]"
          v-if="lastPage > 1"
        >
          <button
            :disabled="currentPage === 1"
            @click="fetchTasks(currentPage - 1)"
            class="px-4 py-2 rounded bg-[#e4e4e4] hover:bg-[#dcdcdc] disabled:opacity-50"
          >
            Prev
          </button>

          <span class="text-[#f7f7f7]">Page {{ currentPage }} de {{ lastPage }}</span>

          <button
            :disabled="currentPage === lastPage"
            @click="fetchTasks(currentPage + 1)"
            class="px-4 py-2 rounded bg-[#e4e4e4] hover:bg-[#dcdcdc] disabled:opacity-50"
          >
            Next
          </button>
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
    v-if="userIsAdmin"
  />

  <TaskDetailsModal
    v-if="selectedTask"
    :visible="showModal"
    :task="selectedTask"
    @close="closeModal"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import api from '../services/api'
import TaskCard from '../components/Task/TaskCard.vue'
import SearchInput from '../components/SearchInput.vue'
import FullPageLoader from '../components/FullPageLoader.vue'
import TaskDetailsModal from '../components/Task/TaskDetailsModal.vue'
import TaskEditModal from '../components/Task/TaskEditModal.vue'
import TaskDeleteModal from '../components/Task/TaskDeleteModal.vue'
import TaskCreateModal from '../components/Task/TaskCreateModal.vue'
import { useAuthStore } from '../stores/auth'

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  creator_id: string;
  createdAt: string;
  due_date: string;
  assignee_id?: string;
  due_in: number;
}

const auth = useAuthStore();
const user = computed(() => auth.user);

const userIsAdmin = computed(() => user.value.is_admin == true);

const tasks = ref<Task[]>([])
const currentPage = ref(1)
const lastPage = ref(1)

const search = ref('')
const isSearching = ref(false)
const isLoading = ref(false)
const searchResults = ref<Task[]>([])

const selectedTaskToEdit = ref<Task | null>(null)
const showEditModal = ref(false)

const selectedTaskToDelete = ref<Task | null>(null)
const showDeleteModal = ref(false)

const showCreateModal = ref(false)

const showModal = ref(false)
const selectedTask = ref(null)

const openModal = (task: Task) => {
  selectedTask.value = task
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
}

const openEditModal = (task: Task) => {
  selectedTaskToEdit.value = task
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedTaskToEdit.value = null
}

const openDeleteModal = (task: Task) => {
  selectedTaskToDelete.value = task
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedTaskToDelete.value = null
}

const handleTaskUpdated = (updatedTask: Task) => {
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

const handleTaskCreated = (newTask: Task) => {
  tasks.value.unshift(newTask)
  if (isSearching.value && search.value) {
    searchResults.value.unshift(newTask)
  }
  showCreateModal.value = false
}

const fetchTasks = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await api.get('/api/tasks', {
      params: { page }
    })
    tasks.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
  } catch (err) {
    console.error('Error loading tasks data', err)
  } finally {
    isLoading.value = false
  }
}

const exportTasks = async () => {
  try {
    const response = await api.get('/api/tasks/export', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error exporting tasks:', error);
  }
};

onMounted(async () => {
  fetchTasks()
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
