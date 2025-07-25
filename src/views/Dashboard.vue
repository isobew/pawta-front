<template>
  <div class="flex w-[78vw] md:flex-row flex-col items-start justify-between">
    <div class="p-6 mb-7">
      <h2 class="md:text-3xl text-md text-f7f7f7">{{ userName ? 'Welcome, ' + userName : 'Loading...' }}</h2>
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
            @click="openModal(task)"
          />
        </div>
      </div>
      <div v-else class="text-center text-f7f7f7 mt-6">
        Not found.
      </div>
    </div>

    <div v-else>
      <h2 class="text-lg text-f7f7f7 mb-20 mt-15 text-center" v-if="tasks.length == 0">You have no tasks yet.</h2>
      <RouterLink to="/tasks" class="cursor-pointer" v-if="tasks.length > 0">
        <h2 class="text-2xl text-f7f7f7 mb-7">Tasks</h2>
      </RouterLink>
      <HorizontalSlider :items="tasks" :cardComponent="TaskCard" @select="openModal" v-if="tasks.length > 0" />

      <h2 class="text-2xl text-f7f7f7 mb-7 mt-15" v-if="tasks.length > 0">Reminders</h2>
      <HorizontalSlider :items="reminders" :cardComponent="ReminderCard" @select="openModal" v-if="tasks.length > 0" />

      <RouterLink to="/boards" class="cursor-pointer">
        <h2 class="text-2xl text-f7f7f7 mb-7 mt-15">Boards</h2>
      </RouterLink>
      <HorizontalSlider :items="boards" :cardComponent="BoardCard" />
    </div>
  </div>

  <TaskDetailsModal
    v-if="selectedTask"
    :visible="showModal"
    :task="selectedTask"
    @close="closeModal"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
import HorizontalSlider from '../components/HorizontalSlider.vue'
import BoardCard from '../components/Board/BoardCard.vue'
import TaskCard from '../components/Task/TaskCard.vue'
import ReminderCard from '../components/Task/ReminderCard.vue'
import SearchInput from '../components/SearchInput.vue'
import FullPageLoader from '../components/FullPageLoader.vue'
import TaskDetailsModal from '../components/Task/TaskDetailsModal.vue'

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

const tasks = ref([])
const boards = ref([])
const reminders = ref([])

const search = ref('')
const isSearching = ref(false)
const isLoading = ref(false)
const searchResults = ref([])
const userName = ref('')

const selectedTask = ref(null)
const showModal = ref(false)

const openModal = (task: Task) => {
  selectedTask.value = task
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
}

onMounted(async () => {
  isLoading.value = true

  try {
    const [tasksRes, boardsRes, remindersRes] = await Promise.all([
      api.get('/api/tasks'),
      api.get('/api/boards'),
      api.get('/api/reminders')
    ])

    tasks.value = tasksRes.data.data
    boards.value = boardsRes.data.data
    reminders.value = remindersRes.data

    const userRes = await api.get('/api/user')
    userName.value = userRes.data.name || 'User'
  } catch (err) {
    console.error('Error loading dashboard data', err)
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
