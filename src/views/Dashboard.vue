<template>
  <div class="flex items-start justify-between">
    <div class="p-6 mb-7">
      <h2 class="text-3xl text-f7f7f7">Welcome, </h2>
      <p class="text-md text-f7f7f7 mt-2" style="font-weight: 300;">Manage your tasks</p>
    </div>
    <SearchInput v-model="search" placeholder="Search..." />
  </div>
  <div class="p-6">
    <h2 class="text-2xl text-f7f7f7 mb-7">Tasks</h2>
    <HorizontalSlider :items="tasks" :cardComponent="TaskCard" />

    <h2 class="text-2xl text-f7f7f7 mb-7 mt-15">Reminders</h2>
    <HorizontalSlider :items="reminders" :cardComponent="ReminderCard" />

    <h2 class="text-2xl text-f7f7f7 mb-7 mt-15">Boards</h2>
    <HorizontalSlider :items="boards" :cardComponent="BoardCard" />

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import HorizontalSlider from '../components/HorizontalSlider.vue'
import BoardCard from '../components/BoardCard.vue'
import TaskCard from '../components/TaskCard.vue'
import ReminderCard from '../components/ReminderCard.vue'
import SearchInput from '../components/SearchInput.vue'

const tasks = ref([])
const boards = ref([])
const reminders = ref([])
const search = ref('')

onMounted(async () => {
  try {
    const [tasksRes, boardsRes, remindersRes] = await Promise.all([
      api.get('/api/tasks'),
      api.get('/api/boards'),
      api.get('/api/reminders')
    ])

    tasks.value = tasksRes.data.data
    boards.value = boardsRes.data.data
    reminders.value = remindersRes.data
    
  } catch (err) {
    console.error('Error', err)
  }
})
</script>
